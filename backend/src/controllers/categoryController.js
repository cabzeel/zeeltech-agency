const Category = require('../models/Category');
const slugify = require('../utils/slugify');

exports.createCategory = async (req, res, next) => {
  try {
    if (!req.body.slug) req.body.slug = slugify(req.body.name);
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const categories = await Category.find(filter).sort('name');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) { next(error); }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) { const e = new Error('Category not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) req.body.slug = slugify(req.body.name);
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) { const e = new Error('Category not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) { const e = new Error('Category not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) { next(error); }
};
