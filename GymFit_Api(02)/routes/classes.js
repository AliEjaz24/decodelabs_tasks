/* ═══════════════════════════════════════════
   GYMFIT API — routes/classes.js

   Endpoints:
   GET /api/classes          → get all classes
   GET /api/classes/today    → get today's schedule
   GET /api/classes/:id      → get one class
   POST /api/classes/book    → book a class spot
═══════════════════════════════════════════ */

const express = require('express');
const router  = express.Router();

/* ── IN-MEMORY DATA ──────────────────────────
   Same classes shown in the GymFit schedule.
────────────────────────────────────────── */
const classes = [
  {
    id         : 1,
    name       : 'HIIT Ignite',
    trainer    : 'Ayesha Khan',
    duration   : 45,
    intensity  : 'High',
    studio     : 'Studio A',
    days       : ['Monday', 'Wednesday', 'Friday'],
    times      : ['07:00', '19:00'],
    capacity   : 20,
    enrolled   : 14,
    icon       : '⚡'
  },
  {
    id         : 2,
    name       : 'Iron Lift',
    trainer    : 'Ayesha Khan',
    duration   : 60,
    intensity  : 'High',
    studio     : 'Weight Room',
    days       : ['Tuesday', 'Thursday', 'Saturday'],
    times      : ['09:00', '17:00'],
    capacity   : 15,
    enrolled   : 10,
    icon       : '🏋️'
  },
  {
    id         : 3,
    name       : 'Flow Yoga',
    trainer    : 'Sara Malik',
    duration   : 60,
    intensity  : 'Low',
    studio     : 'Studio B',
    days       : ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    times      : ['09:00', '17:00'],
    capacity   : 18,
    enrolled   : 16,
    icon       : '🧘'
  },
  {
    id         : 4,
    name       : 'Cycle Rush',
    trainer    : 'Omar Aslam',
    duration   : 45,
    intensity  : 'High',
    studio     : 'Cycle Studio',
    days       : ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    times      : ['12:00', '19:00'],
    capacity   : 25,
    enrolled   : 18,
    icon       : '🚴'
  },
  {
    id         : 5,
    name       : 'BoxFit',
    trainer    : 'Raza Butt',
    duration   : 50,
    intensity  : 'Medium',
    studio     : 'Boxing Ring',
    days       : ['Tuesday', 'Thursday', 'Friday'],
    times      : ['12:00', '17:00', '19:00'],
    capacity   : 12,
    enrolled   : 8,
    icon       : '🥊'
  },
  {
    id         : 6,
    name       : 'Core Pilates',
    trainer    : 'Sara Malik',
    duration   : 50,
    intensity  : 'Low',
    studio     : 'Studio B',
    days       : ['Wednesday', 'Thursday', 'Friday'],
    times      : ['12:00', '17:00'],
    capacity   : 15,
    enrolled   : 11,
    icon       : '🤸'
  }
];

/* ── BOOKINGS DATA STORE ─────────────────────
   Tracks who booked which class.
   Project 3 will store this in a DB table.
────────────────────────────────────────── */
let bookings = [];
let nextBookingId = 1;

/* ════════════════════════════════════════════
   GET /api/classes
   Returns all classes.
   Optional filters via query params:
   ?intensity=high   → filter by intensity level
   ?day=Monday       → filter by day
════════════════════════════════════════════ */
router.get('/', (req, res) => {
  const { intensity, day } = req.query;
  let result = classes;

  if (intensity) {
    result = result.filter(c =>
      c.intensity.toLowerCase() === intensity.toLowerCase()
    );
  }

  if (day) {
    result = result.filter(c =>
      c.days.some(d => d.toLowerCase() === day.toLowerCase())
    );
  }

  // Add available spots to each class
  const withSpots = result.map(c => ({
    ...c,
    availableSpots : c.capacity - c.enrolled
  }));

  res.status(200).json({
    success : true,
    count   : withSpots.length,
    data    : withSpots
  });
});

/* ════════════════════════════════════════════
   GET /api/classes/today
   Returns classes scheduled for today.

   IMPORTANT: This route MUST be defined
   BEFORE /:id — otherwise Express would try
   to match "today" as an ID parameter.
════════════════════════════════════════════ */
router.get('/today', (req, res) => {
  // Get today's day name e.g. "Monday"
  const days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];

  const todaysClasses = classes
    .filter(c => c.days.includes(today))
    .map(c => ({
      ...c,
      availableSpots : c.capacity - c.enrolled
    }));

  res.status(200).json({
    success : true,
    day     : today,
    count   : todaysClasses.length,
    data    : todaysClasses
  });
});

/* ════════════════════════════════════════════
   GET /api/classes/:id
   Returns a single class by ID.
════════════════════════════════════════════ */
router.get('/:id', (req, res) => {
  const id      = parseInt(req.params.id);
  const gymClass = classes.find(c => c.id === id);

  if (!gymClass) {
    return res.status(404).json({
      success : false,
      error   : `Class with ID ${id} not found.`
    });
  }

  res.status(200).json({
    success : true,
    data    : {
      ...gymClass,
      availableSpots : gymClass.capacity - gymClass.enrolled
    }
  });
});

/* ════════════════════════════════════════════
   POST /api/classes/book
   Books a spot in a class for a member.

   Request body (JSON):
   {
     "classId"    : 1,
     "memberName" : "Ali Hassan",
     "email"      : "ali@example.com"
   }

   HTTP 201 = Booking created
   HTTP 400 = Bad data or class is full
   HTTP 404 = Class not found
════════════════════════════════════════════ */
router.post('/book', (req, res) => {
  const { classId, memberName, email } = req.body;

  // ── Validate input ──
  const errors = [];
  if (!classId)                   errors.push('classId is required.');
  if (!memberName || memberName.trim().length < 2)
                                  errors.push('memberName is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                  errors.push('A valid email is required.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // ── Find the class ──
  const gymClass = classes.find(c => c.id === parseInt(classId));
  if (!gymClass) {
    return res.status(404).json({
      success : false,
      error   : `Class with ID ${classId} not found.`
    });
  }

  // ── Check capacity ──
  if (gymClass.enrolled >= gymClass.capacity) {
    return res.status(400).json({
      success : false,
      error   : `Sorry, ${gymClass.name} is fully booked.`
    });
  }

  // ── Check for duplicate booking ──
  const alreadyBooked = bookings.find(
    b => b.classId === parseInt(classId) && b.email.toLowerCase() === email.toLowerCase()
  );
  if (alreadyBooked) {
    return res.status(400).json({
      success : false,
      error   : 'You have already booked this class.'
    });
  }

  // ── Create booking ──
  gymClass.enrolled++;  // increment enrolled count

  const newBooking = {
    id         : nextBookingId++,
    classId    : gymClass.id,
    className  : gymClass.name,
    memberName : memberName.trim(),
    email      : email.toLowerCase().trim(),
    bookedAt   : new Date().toISOString()
  };

  bookings.push(newBooking);

  res.status(201).json({
    success  : true,
    message  : `Spot booked in ${gymClass.name}! See you there 🎉`,
    data     : newBooking
  });
});

module.exports = router;