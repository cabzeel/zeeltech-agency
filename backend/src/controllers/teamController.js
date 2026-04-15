const Team = require('../models/Team');
const slugify = require('../utils/slugify');

exports.createTeamMember = async (req, res, next) => {
  try {
    if (!req.body.slug) req.body.slug = slugify(req.body.name);
    const member = await Team.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.getTeamMembers = async (req, res, next) => {
  try {
    const { isVisible } = req.query;
    const filter = {};
    if (isVisible !== undefined) filter.isVisible = isVisible === 'true';
    const members = await Team.find(filter)
      .populate('projects', 'title slug coverImage')
      .sort('order');
    res.status(200).json({ success: true, count: members.length, data: members });
  } catch (error) { next(error); }
};

exports.getTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id).populate('projects', 'title slug coverImage');
    if (!member) { const e = new Error('Team member not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.getTeamMemberBySlug = async (req, res, next) => {
  try {
    const member = await Team.findOne({ slug: req.params.slug }).populate('projects', 'title slug coverImage');
    if (!member) { const e = new Error('Team member not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.updateTeamMember = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) req.body.slug = slugify(req.body.name);
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) { const e = new Error('Team member not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) { const e = new Error('Team member not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) { next(error); }
};

exports.reorderTeam = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) { const e = new Error('Order must be an array'); e.statusCode = 400; return next(e); }
    await Promise.all(order.map(item => Team.findByIdAndUpdate(item.id, { order: item.order })));
    res.status(200).json({ success: true, message: 'Team reordered successfully' });
  } catch (error) { next(error); }
};
