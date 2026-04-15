const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', verifyToken, authorize('posts', 'create'), createCategory);
router.put('/:id', verifyToken, authorize('posts', 'update'), updateCategory);
router.delete('/:id', verifyToken, authorize('posts', 'delete'), deleteCategory);

module.exports = router;
