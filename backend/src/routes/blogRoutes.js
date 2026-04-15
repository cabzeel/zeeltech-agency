const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlog, getBlogBySlug, updateBlog, deleteBlog } = require('../controllers/blogController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlog);

// Protected
router.post('/', verifyToken, authorize('posts', 'create'), createBlog);
router.put('/:id', verifyToken, authorize('posts', 'update'), updateBlog);
router.delete('/:id', verifyToken, authorize('posts', 'delete'), deleteBlog);

module.exports = router;
