const Pricing = require('../models/Pricing');

exports.createPricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.create(req.body);
    res.status(201).json({ success: true, data: pricing });
  } catch (error) { next(error); }
};

exports.getPricingPlans = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const plans = await Pricing.find(filter)
      .populate('services', 'title slug')
      .sort('order');
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) { next(error); }
};

exports.getPricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.findById(req.params.id).populate('services', 'title slug');
    if (!plan) { const e = new Error('Pricing plan not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

exports.updatePricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) { const e = new Error('Pricing plan not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

exports.deletePricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.findByIdAndDelete(req.params.id);
    if (!plan) { const e = new Error('Pricing plan not found'); e.statusCode = 404; return next(e); }
    res.status(200).json({ success: true, message: 'Pricing plan deleted successfully' });
  } catch (error) { next(error); }
};

exports.reorderPricingPlans = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) { const e = new Error('Order must be an array'); e.statusCode = 400; return next(e); }
    await Promise.all(order.map(item => Pricing.findByIdAndUpdate(item.id, { order: item.order })));
    res.status(200).json({ success: true, message: 'Pricing plans reordered successfully' });
  } catch (error) { next(error); }
};
