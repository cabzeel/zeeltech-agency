const express = require('express');
const router = express.Router();
const { createPricing, getPricingPlans, getPricingPlan, updatePricingPlan, deletePricingPlan, reorderPricingPlans } = require('../controllers/pricingController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.get('/', getPricingPlans);
router.get('/:id', getPricingPlan);

// Protected
router.post('/', verifyToken, authorize('services', 'create'), createPricing);
router.put('/reorder', verifyToken, authorize('services', 'update'), reorderPricingPlans);
router.put('/:id', verifyToken, authorize('services', 'update'), updatePricingPlan);
router.delete('/:id', verifyToken, authorize('services', 'delete'), deletePricingPlan);

module.exports = router;
