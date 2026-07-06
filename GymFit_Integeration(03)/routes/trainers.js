const express = require('express');
const router = express.Router();
const Trainer = require('../models/trainer');

// CREATE — POST /api/trainers
router.post('/', async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    const savedTrainer = await trainer.save();
    res.status(201).json({
      success: true,
      message: 'Trainer created successfully',
      data: savedTrainer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A trainer with this email already exists'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ ALL — GET /api/trainers
// Supports filters: ?specialization=yoga  ?isAvailable=true
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialization) filter.specialization = req.query.specialization;
    if (req.query.isAvailable) filter.isAvailable = req.query.isAvailable === 'true';

    const trainers = await Trainer.find(filter).sort({ name: 1 });
    res.json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ ONE — GET /api/trainers/:id
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid trainer ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// UPDATE — PUT /api/trainers/:id
router.put('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found' });
    }
    res.json({
      success: true,
      message: 'Trainer updated successfully',
      data: trainer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE — DELETE /api/trainers/:id
router.delete('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found' });
    }
    res.json({
      success: true,
      message: `Trainer "${trainer.name}" deleted successfully`
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid trainer ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;