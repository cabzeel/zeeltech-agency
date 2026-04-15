const Service = require('../models/Service');
const slugify = require('../utils/slugify');

exports.createService = async (req, res, next) => {
  try {
    if (!req.body.slug) req.body.slug = slugify(req.body.title);
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) { next(error); }
};

exports.getServices = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const services = await Service.find(filter)
      .populate('relatedProjects', 'title slug coverImage')
      .sort('order');
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) { next(error); }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('relatedProjects', 'title slug coverImage');
    if (!service) { const e = new Error('Service not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: service });
  } catch (error) { next(error); }
};

exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug }).populate('relatedProjects', 'title slug coverImage');
    if (!service) { const e = new Error('Service not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: service });
  } catch (error) { next(error); }
};

exports.updateService = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) req.body.slug = slugify(req.body.title);
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) { const e = new Error('Service not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: service });
  } catch (error) { next(error); }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) { const e = new Error('Service not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) { next(error); }
};

exports.reorderServices = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, order }, ...]
    if (!Array.isArray(order)) { const e = new Error('Order must be an array'); e.statusCode = 400; return next(e); }
    await Promise.all(order.map(item => Service.findByIdAndUpdate(item.id, { order: item.order })));
    res.status(200).json({ success: true, message: 'Services reordered successfully' });
  } catch (error) { next(error); }
};
