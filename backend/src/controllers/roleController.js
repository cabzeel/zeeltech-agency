const Role = require('../models/Role');

exports.createRole = async (req, res, next) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error) { next(error); }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, count: roles.length, data: roles });
  } catch (error) { next(error); }
};

exports.getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) { const e = new Error('Role not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: role });
  } catch (error) { next(error); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) { const e = new Error('Role not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: role });
  } catch (error) { next(error); }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) { const e = new Error('Role not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (error) { next(error); }
};
