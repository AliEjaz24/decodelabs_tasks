/* ═══════════════════════════════════════════
   GYMFIT API — routes/trainers.js

   Endpoints:
   GET /api/trainers       → get all trainers
   GET /api/trainers/:id   → get one trainer
═══════════════════════════════════════════ */

const express = require('express');
const router  = express.Router();

/* ── IN-MEMORY DATA ──────────────────────────
   Same trainers shown on the GymFit frontend.
   In Project 3, this comes from a DB table.
────────────────────────────────────────── */
const trainers = [
  {
    id         : 1,
    name       : 'Ayesha Khan',
    role       : 'HIIT & Strength',
    bio        : 'Former national-level sprinter with 8 years of coaching experience.',
    classes    : ['HIIT Ignite', 'Iron Lift'],
    experience : 8,
    avatar     : 'AK'
  },
  {
    id         : 2,
    name       : 'Raza Butt',
    role       : 'Boxing & Conditioning',
    bio        : 'Pro-level boxing coach with a decade in combat sports.',
    classes    : ['BoxFit', 'Cycle Rush'],
    experience : 10,
    avatar     : 'RB'
  },
  {
    id         : 3,
    name       : 'Sara Malik',
    role       : 'Yoga & Pilates',
    bio        : 'Registered yoga instructor and movement therapist.',
    classes    : ['Flow Yoga', 'Core Pilates'],
    experience : 6,
    avatar     : 'SM'
  },
  {
    id         : 4,
    name       : 'Omar Aslam',
    role       : 'Cycling & Endurance',
    bio        : 'Competitive cyclist and endurance coach.',
    classes    : ['Cycle Rush', 'HIIT Ignite'],
    experience : 5,
    avatar     : 'OA'
  }
];

/* ════════════════════════════════════════════
   GET /api/trainers
   Returns all trainers.
   Supports optional query filter: ?role=yoga

   Example:
   /api/trainers              → all trainers
   /api/trainers?role=boxing  → filtered by role
════════════════════════════════════════════ */
router.get('/', (req, res) => {
  // req.query holds URL query parameters (?key=value)
  const { role } = req.query;

  let result = trainers;

  // If ?role=something is provided, filter the list
  if (role) {
    result = trainers.filter(t =>
      t.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  res.status(200).json({
    success : true,
    count   : result.length,
    data    : result
  });
});

/* ════════════════════════════════════════════
   GET /api/trainers/:id
   Returns a single trainer by ID.
   HTTP 200 = found
   HTTP 404 = not found
════════════════════════════════════════════ */
router.get('/:id', (req, res) => {
  const id      = parseInt(req.params.id);
  const trainer = trainers.find(t => t.id === id);

  if (!trainer) {
    return res.status(404).json({
      success : false,
      error   : `Trainer with ID ${id} not found.`
    });
  }

  res.status(200).json({
    success : true,
    data    : trainer
  });
});

module.exports = router;