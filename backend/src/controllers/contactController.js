const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    // Notify all superadmins
    const Role = require('../models/Role');
    const adminRole = await Role.findOne({ title: 'superadmin' });
    if (adminRole) {
      const admins = await User.find({ role: adminRole._id, isActive: true });
      const notifications = admins.map(admin => ({
        title: 'New Contact Message',
        message: `${contact.name} sent a message: "${contact.subject}"`,
        type: 'contact',
        recipient: admin._id,
        link: `/contacts/${contact._id}`,
      }));
      if (notifications.length) await Notification.insertMany(notifications);
    }
    res.status(201).json({ success: true, message: 'Message received. We will be in touch!', data: contact });
  } catch (error) { next(error); }
};

exports.getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.status(200).json({ success: true, count: contacts.length, total, data: contacts });
  } catch (error) { next(error); }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) { const e = new Error('Contact not found'); e.statusCode = 404; return next(e); }
    if (contact.status === 'unread') {
      contact.status = 'read';
      await contact.save();
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) { next(error); }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
      const e = new Error('Invalid status'); e.statusCode = 400; return next(e);
    }
    const update = { status };
    if (status === 'replied') update.repliedAt = new Date();
    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) { const e = new Error('Contact not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: contact });
  } catch (error) { next(error); }
};

exports.replyContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) { const e = new Error('Contact not found'); e.statusCode = 404; return next(e); }
    const { replyMessage } = req.body;
    if (!replyMessage) { const e = new Error('Reply message is required'); e.statusCode = 400; return next(e); }
    await transporter.sendMail({
      from: `"Zeeltech Agency" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html: `<p>Dear ${contact.name},</p><p>${replyMessage}</p><br/><p>Best regards,<br/>Zeeltech Team</p>`,
    });
    contact.status = 'replied';
    contact.repliedAt = new Date();
    await contact.save();
    res.status(200).json({ success: true, message: 'Reply sent successfully', data: contact });
  } catch (error) { next(error); }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) { const e = new Error('Contact not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) { next(error); }
};
