const express = require('express');
const router = express.Router();
const Class = require('../models/class');

// CREATE — POST /api/classes
// Body must include a valid trainer _id in the "trainer" field
router.post('/', async (req, res) => {
  try {
    const gymClass = new Class(req.body);
    const savedClass = await gymClass.save();

    // .populate() replaces the trainer ObjectId with the full trainer document
    // This shows the relationship working in real time
    await savedClass.populate('trainer', 'name specialization email');

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: savedClass
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ ALL — GET /api/classes
// .populate() fills in the trainer's details automatically
// Supports filters: ?category=yoga  ?day=monday
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.day) filter['schedule.day'] = req.query.day;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';

    const classes = await Class.find(filter)
      .populate('trainer', 'name specialization rating') // brings in trainer info
      .sort({ 'schedule.day': 1 });

    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ ONE — GET /api/classes/:id
router.get('/:id', async (req, res) => {
  try {
    const gymClass = await Class.findById(req.params.id)
      .populate('trainer', 'name specialization email rating bio');

    if (!gymClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    res.json({ success: true, data: gymClass });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid class ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// UPDATE — PUT /api/classes/:id
router.put('/:id', async (req, res) => {
  try {
    const gymClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainer', 'name specialization');

    if (!gymClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    res.json({
      success: true,
      message: 'Class updated successfully',
      data: gymClass
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE — DELETE /api/classes/:id
router.delete('/:id', async (req, res) => {
  try {
    const gymClass = await Class.findByIdAndDelete(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    res.json({
      success: true,
      message: `Class "${gymClass.name}" deleted successfully`
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid class ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;