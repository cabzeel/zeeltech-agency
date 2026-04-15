const Project = require('../models/Project');
const slugify = require('../utils/slugify');

exports.createProject = async (req, res, next) => {
  try {
    if (!req.body.slug) req.body.slug = slugify(req.body.title);
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) { next(error); }
};

exports.getProjects = async (req, res, next) => {
  try {
    const { status, category, isFeatured, page = 1, limit = 10, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { clientName: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate('category', 'name slug')
      .populate('teamMembers', 'name position imgUrl slug')
      .sort('order')
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json({ success: true, count: projects.length, total, pages: Math.ceil(total / limit), data: projects });
  } catch (error) { next(error); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('teamMembers', 'name position imgUrl slug');
    if (!project) { const e = new Error('Project not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: project });
  } catch (error) { next(error); }
};

exports.getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('teamMembers', 'name position imgUrl slug');
    if (!project) { const e = new Error('Project not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: project });
  } catch (error) { next(error); }
};

exports.updateProject = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) req.body.slug = slugify(req.body.title);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) { const e = new Error('Project not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: project });
  } catch (error) { next(error); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) { const e = new Error('Project not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) { next(error); }
};

exports.reorderProjects = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) { const e = new Error('Order must be an array'); e.statusCode = 400; return next(e); }
    await Promise.all(order.map(item => Project.findByIdAndUpdate(item.id, { order: item.order })));
    res.status(200).json({ success: true, message: 'Projects reordered successfully' });
  } catch (error) { next(error); }
};
