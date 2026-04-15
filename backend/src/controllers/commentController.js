const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.body.post);
    if (!blog) { const e = new Error('Blog post not found'); e.statusCode = 404; return next(e); }
    const comment = await Comment.create(req.body);
    // Notify blog author
    await Notification.create({
      title: 'New Comment',
      message: `${comment.guestName} commented on "${blog.title}"`,
      type: 'comment',
      recipient: blog.author,
      link: `/blogs/${blog.slug}`,
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) { next(error); }
};

exports.getComments = async (req, res, next) => {
  try {
    const { status, post, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (post) filter.post = post;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Comment.countDocuments(filter);
    const comments = await Comment.find(filter)
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).json({ success: true, count: comments.length, total, data: comments });
  } catch (error) { next(error); }
};

exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post', 'title slug');
    if (!comment) { const e = new Error('Comment not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: comment });
  } catch (error) { next(error); }
};

exports.updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      const e = new Error('Invalid status'); e.statusCode = 400; return next(e);
    }
    const comment = await Comment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!comment) { const e = new Error('Comment not found'); e.statusCode = 404; return next(e); }
    // If approved, add to blog's comments array
    if (status === 'approved') {
      await Blog.findByIdAndUpdate(comment.post, { $addToSet: { comments: comment._id } });
    } else {
      await Blog.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    }
    res.status(200).json({ success: true, data: comment });
  } catch (error) { next(error); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) { const e = new Error('Comment not found'); e.statusCode = 404; return next(e); }
    await Blog.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) { next(error); }
};

exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id, { $inc: { likes: 1 } }, { new: true }
    );
    if (!comment) { const e = new Error('Comment not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: comment });
  } catch (error) { next(error); }
};
