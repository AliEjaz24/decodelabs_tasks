const express = require('express');
const router = express.Router();
const Member = require('../models/member');

// ─────────────────────────────────────────────
// CREATE — POST /api/members
// Adds a new member to the database
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save(); // Mongoose validates BEFORE saving
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: savedMember
    });
  } catch (error) {
    // Duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A member with this email already exists'
      });
    }
    // Validation errors from schema
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// READ ALL — GET /api/members
// Returns all members (supports ?plan=basic filter)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.plan) filter.plan = req.query.plan;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// READ ONE — GET /api/members/:id
// Returns a single member by their MongoDB _id
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid member ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// UPDATE — PUT /api/members/:id
// Updates a member's details
// ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,            // return the UPDATED document (not the old one)
        runValidators: true   // re-run schema rules on update too (SHIELD)
      }
    );
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({
      success: true,
      message: 'Member updated successfully',
      data: member
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

// ─────────────────────────────────────────────
// DELETE — DELETE /api/members/:id
// Permanently removes a member from the database
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({
      success: true,
      message: `Member "${member.name}" deleted successfully`
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid member ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;