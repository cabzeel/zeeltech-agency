const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, getProjectBySlug, updateProject, deleteProject, reorderProjects } = require('../controllers/projectController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.get('/', getProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProject);

// Protected
router.post('/', verifyToken, authorize('projects', 'create'), createProject);
router.put('/reorder', verifyToken, authorize('projects', 'update'), reorderProjects);
router.put('/:id', verifyToken, authorize('projects', 'update'), updateProject);
router.delete('/:id', verifyToken, authorize('projects', 'delete'), deleteProject);

module.exports = router;
