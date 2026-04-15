const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const slugify = require('../utils/slugify');

const calcReadTime = (content) => Math.ceil(content.split(/\s+/).length / 200);

exports.createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    if (!req.body.slug) req.body.slug = slugify(req.body.title);
    if (req.body.content) req.body.readTime = calcReadTime(req.body.content);
    if (req.body.status === 'published') req.body.publishedAt = new Date();
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.getBlogs = async (req, res, next) => {
  try {
    const { status, category, isFeatured, page = 1, limit = 10, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .populate('author', 'username email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json({
      success: true, count: blogs.length, total,
      pages: Math.ceil(total / limit), currentPage: Number(page), data: blogs,
    });
  } catch (error) { next(error); }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .populate('category', 'name slug')
      .populate({ path: 'comments', match: { status: 'approved' } });
    if (!blog) { const e = new Error('Blog not found'); e.statusCode = 404; return next(e); }
    blog.views += 1;
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'username email')
      .populate('category', 'name slug')
      .populate({ path: 'comments', match: { status: 'approved' } });
    if (!blog) { const e = new Error('Blog not found'); e.statusCode = 404; return next(e); }
    blog.views += 1;
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.updateBlog = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) req.body.slug = slugify(req.body.title);
    if (req.body.content) req.body.readTime = calcReadTime(req.body.content);
    if (req.body.status === 'published') {
      const existing = await Blog.findById(req.params.id);
      if (existing && existing.status !== 'published') req.body.publishedAt = new Date();
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) { const e = new Error('Blog not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) { const e = new Error('Blog not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) { next(error); }
};
