const Subscriber = require('../models/Subscriber');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Role = require('../models/Role');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.subscribe = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();
        return res.status(200).json({ success: true, message: 'Welcome back! You have been resubscribed.' });
      }
      const e = new Error('This email is already subscribed'); e.statusCode = 400; return next(e);
    }
    const subscriber = await Subscriber.create({ email, name });
    // Welcome email
    try {
      await transporter.sendMail({
        from: `"Zeeltech Agency" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Zeeltech Newsletter!',
        html: `<p>Hi ${name || 'there'},</p><p>Thanks for subscribing to Zeeltech's newsletter. Stay tuned for our latest updates!</p><p>Best,<br/>Zeeltech Team</p>`,
      });
    } catch (_) { /* email failure shouldn't block subscription */ }
    // Notify admins
    const adminRole = await Role.findOne({ title: 'superadmin' });
    if (adminRole) {
      const admins = await User.find({ role: adminRole._id, isActive: true });
      if (admins.length) {
        await Notification.insertMany(admins.map(a => ({
          title: 'New Subscriber',
          message: `${email} just subscribed to the newsletter`,
          type: 'subscriber',
          recipient: a._id,
        })));
      }
    }
    res.status(201).json({ success: true, message: 'Subscribed successfully!', data: subscriber });
  } catch (error) { next(error); }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOneAndUpdate({ email }, { status: 'unsubscribed' }, { new: true });
    if (!subscriber) { const e = new Error('Email not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) { next(error); }
};

exports.getSubscribers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Subscriber.countDocuments(filter);
    const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.status(200).json({ success: true, count: subscribers.length, total, data: subscribers });
  } catch (error) { next(error); }
};

exports.deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) { const e = new Error('Subscriber not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Subscriber removed' });
  } catch (error) { next(error); }
};

exports.sendNewsletter = async (req, res, next) => {
  try {
    const { subject, html } = req.body;
    if (!subject || !html) { const e = new Error('Subject and html content are required'); e.statusCode = 400; return next(e); }
    const subscribers = await Subscriber.find({ status: 'active' }).select('email name');
    if (!subscribers.length) { return res.status(200).json({ success: true, message: 'No active subscribers found' }); }
    const results = await Promise.allSettled(subscribers.map(sub =>
      transporter.sendMail({
        from: `"Zeeltech Agency" <${process.env.EMAIL_USER}>`,
        to: sub.email,
        subject,
        html: `${html}<br/><hr/><p style="font-size:12px">To unsubscribe, <a href="${process.env.CLIENT_URL}/unsubscribe?email=${sub.email}">click here</a></p>`,
      })
    ));
    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    res.status(200).json({ success: true, message: `Newsletter sent to ${sent} subscribers. Failed: ${failed}` });
  } catch (error) { next(error); }
};
