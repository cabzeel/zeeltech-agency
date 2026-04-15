const express = require('express');
const router = express.Router();
const { createService, getServices, getService, getServiceBySlug, updateService, deleteService, reorderServices } = require('../controllers/serviceController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.get('/', getServices);
router.get('/slug/:slug', getServiceBySlug);
router.get('/:id', getService);

// Protected
router.post('/', verifyToken, authorize('services', 'create'), createService);
router.put('/reorder', verifyToken, authorize('services', 'update'), reorderServices);
router.put('/:id', verifyToken, authorize('services', 'update'), updateService);
router.delete('/:id', verifyToken, authorize('services', 'delete'), deleteService);

module.exports = router;
