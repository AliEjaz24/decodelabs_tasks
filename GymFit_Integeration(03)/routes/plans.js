const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');

// CREATE — POST /api/plans
router.post('/', async (req, res) => {
  try {
    const plan = new Plan(req.body);
    const savedPlan = await plan.save();
    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: savedPlan
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A plan with this name already exists'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ ALL — GET /api/plans
// Supports filter: ?duration=monthly  ?isActive=true
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.duration) filter.duration = req.query.duration;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';

    const plans = await Plan.find(filter).sort({ price: 1 }); // sorted cheapest first
    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ ONE — GET /api/plans/:id
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid plan ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// UPDATE — PUT /api/plans/:id
router.put('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }
    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Plan name already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE — DELETE /api/plans/:id
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }
    res.json({
      success: true,
      message: `Plan "${plan.name}" deleted successfully`
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid plan ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;