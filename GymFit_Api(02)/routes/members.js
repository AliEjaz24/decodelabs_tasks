/* ═══════════════════════════════════════════
   GYMFIT API — routes/members.js

   Endpoints:
   GET  /api/members       → get all members
   GET  /api/members/:id   → get one member
   POST /api/members       → register new member
   ═══════════════════════════════════════════

   NOTE: In Project 3 (Database), this in-memory
   array will be replaced by a real database table.
   For now, data lives in memory (resets on restart).
═══════════════════════════════════════════ */

const express = require('express');
const router  = express.Router();

/* ── IN-MEMORY DATA STORE ────────────────────
   Think of this as a temporary database.
   Project 3 will replace this with a real DB.
────────────────────────────────────────── */
let members = [
  {
    id        : 1,
    fullName  : 'Zainab Akhtar',
    email     : 'zainab@example.com',
    phone     : '0300-1234567',
    plan      : 'pro',
    goal      : 'Lose weight and build stamina',
    joinedAt  : '2025-01-10T08:00:00.000Z'
  },
  {
    id        : 2,
    fullName  : 'Hassan Mirza',
    email     : 'hassan@example.com',
    phone     : '0321-9876543',
    plan      : 'elite',
    goal      : 'Build muscle mass',
    joinedAt  : '2024-08-15T09:30:00.000Z'
  }
];

// Auto-incrementing ID counter
let nextId = 3;

/* ────────────────────────────────────────────
   HELPER: validate member data
   Returns an array of error messages.
   Empty array = data is valid.

   The PDF calls this "The Gatekeeper Rule":
   Never trust the client. Always validate
   on the server side too.
────────────────────────────────────────── */
function validateMember(data) {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validPlans   = ['starter', 'pro', 'elite'];

  // Syntactic validation (is the format correct?)
  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.push('fullName is required and must be at least 3 characters.');
  }
  if (!data.email || !emailPattern.test(data.email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!data.plan || !validPlans.includes(data.plan)) {
    errors.push(`plan must be one of: ${validPlans.join(', ')}.`);
  }

  // Semantic validation (is the logic valid?)
  if (data.email) {
    const duplicate = members.find(
      m => m.email.toLowerCase() === data.email.toLowerCase().trim()
    );
    if (duplicate) {
      errors.push('A member with this email already exists.');
    }
  }

  return errors;
}

/* ════════════════════════════════════════════
   GET /api/members
   Returns all members.
   HTTP 200 = OK (success, data returned)
════════════════════════════════════════════ */
router.get('/', (req, res) => {
  res.status(200).json({
    success : true,
    count   : members.length,
    data    : members
  });
});

/* ════════════════════════════════════════════
   GET /api/members/:id
   Returns a single member by ID.
   HTTP 200 = found
   HTTP 404 = not found
════════════════════════════════════════════ */
router.get('/:id', (req, res) => {
  // req.params.id comes from the URL as a STRING
  // We convert it to a number with parseInt
  const id     = parseInt(req.params.id);
  const member = members.find(m => m.id === id);

  if (!member) {
    // 404 = resource not found (client's fault — wrong ID)
    return res.status(404).json({
      success : false,
      error   : `Member with ID ${id} not found.`
    });
  }

  res.status(200).json({
    success : true,
    data    : member
  });
});

/* ════════════════════════════════════════════
   POST /api/members
   Registers a new member.
   This connects to the Join Form in Project 1.

   Request body (JSON):
   {
     "fullName" : "Ali Hassan",
     "email"    : "ali@example.com",
     "phone"    : "0300-1111111",   (optional)
     "plan"     : "pro",
     "goal"     : "Build muscle"    (optional)
   }

   HTTP 201 = Created (success, new resource made)
   HTTP 400 = Bad Request (client sent invalid data)
════════════════════════════════════════════ */
router.post('/', (req, res) => {
  const body   = req.body;
  const errors = validateMember(body);

  if (errors.length > 0) {
    // 400 = Bad Request — the client sent wrong/missing data
    return res.status(400).json({
      success : false,
      errors  : errors
    });
  }

  // Build the new member object
  const newMember = {
    id       : nextId++,
    fullName : body.fullName.trim(),
    email    : body.email.trim().toLowerCase(),
    phone    : body.phone   ? body.phone.trim()  : null,
    plan     : body.plan,
    goal     : body.goal    ? body.goal.trim()   : null,
    joinedAt : new Date().toISOString()
  };

  // Add to our in-memory "database"
  members.push(newMember);

  // 201 = Created — a new resource was successfully created
  res.status(201).json({
    success : true,
    message : `Welcome to GymFit, ${newMember.fullName}! 💪`,
    data    : newMember
  });
});

module.exports = router;