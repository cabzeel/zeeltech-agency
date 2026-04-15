const express = require('express');
const router = express.Router();
const { createTestimonial, getTestimonials, getTestimonial, updateTestimonialStatus, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.post('/', createTestimonial);
router.get('/', getTestimonials);

// Protected
router.get('/:id', verifyToken, authorize('testimonials', 'read'), getTestimonial);
router.put('/:id/status', verifyToken, authorize('testimonials', 'update'), updateTestimonialStatus);
router.put('/:id', verifyToken, authorize('testimonials', 'update'), updateTestimonial);
router.delete('/:id', verifyToken, authorize('testimonials', 'delete'), deleteTestimonial);

module.exports = router;
