const express = require('express');
const router = express.Router();
const { createComment, getComments, getComment, updateCommentStatus, deleteComment, likeComment } = require('../controllers/commentController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.post('/', createComment);
router.put('/:id/like', likeComment);

// Protected
router.get('/', verifyToken, authorize('comments', 'read'), getComments);
router.get('/:id', verifyToken, authorize('comments', 'read'), getComment);
router.put('/:id/status', verifyToken, authorize('comments', 'update'), updateCommentStatus);
router.delete('/:id', verifyToken, authorize('comments', 'delete'), deleteComment);

module.exports = router;
