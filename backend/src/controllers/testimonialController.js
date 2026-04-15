const Testimonial = require('../models/Testimonial');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Role = require('../models/Role');

exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    // Notify superadmins
    const adminRole = await Role.findOne({ title: 'superadmin' });
    if (adminRole) {
      const admins = await User.find({ role: adminRole._id, isActive: true });
      const notifications = admins.map(admin => ({
        title: 'New Testimonial Submitted',
        message: `${testimonial.name} from ${testimonial.company} submitted a testimonial`,
        type: 'system',
        recipient: admin._id,
        link: `/testimonials/${testimonial._id}`,
      }));
      if (notifications.length) await Notification.insertMany(notifications);
    }
    res.status(201).json({ success: true, message: 'Testimonial submitted for review', data: testimonial });
  } catch (error) { next(error); }
};

exports.getTestimonials = async (req, res, next) => {
  try {
    const { status, isFeatured } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) { next(error); }
};

exports.getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) { const e = new Error('Testimonial not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) { next(error); }
};

exports.updateTestimonialStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      const e = new Error('Invalid status'); e.statusCode = 400; return next(e);
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!testimonial) { const e = new Error('Testimonial not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) { next(error); }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) { const e = new Error('Testimonial not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) { next(error); }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) { const e = new Error('Testimonial not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) { next(error); }
};
