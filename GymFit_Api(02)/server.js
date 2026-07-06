/* ═══════════════════════════════════════════
   GYMFIT API — server.js
   Entry point. Starts the Express server.
   DecodeLabs Full Stack Internship 2026
═══════════════════════════════════════════ */

const express = require('express');
const cors    = require('cors');

// Import route files
const memberRoutes  = require('./routes/members');
const trainerRoutes = require('./routes/trainers');
const classRoutes   = require('./routes/classes');
const planRoutes    = require('./routes/plans');

// Create the Express app
const app = express();
const PORT = 3000;

/* ── MIDDLEWARE ──────────────────────────────
   Middleware runs on EVERY request before
   it reaches a route handler.
────────────────────────────────────────── */

// Allows frontend (Project 1) to call this API
// without getting blocked by the browser (CORS policy)
app.use(cors());

// Tells Express to parse incoming JSON bodies
// so we can read req.body in POST routes
app.use(express.json());

/* ── ROUTES ──────────────────────────────────
   Each route file handles a specific resource.
   RESTful rule: resources are NOUNS, not verbs.
   ✓ /api/members   (correct)
   ✗ /api/getMembers (wrong)
────────────────────────────────────────── */
app.use('/api/members',  memberRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/classes',  classRoutes);
app.use('/api/plans',    planRoutes);

/* ── ROOT ROUTE ──────────────────────────────
   A simple health-check route.
   Visit http://localhost:3000 to confirm
   the server is running.
────────────────────────────────────────── */
app.get('/', (req, res) => {
  res.json({
    message : '💪 GymFit API is running!',
    version : '1.0.0',
    project : 'DecodeLabs Full Stack Internship 2026',
    routes  : {
      members  : 'GET /api/members | POST /api/members',
      trainers : 'GET /api/trainers | GET /api/trainers/:id',
      classes  : 'GET /api/classes  | GET /api/classes/today',
      plans    : 'GET /api/plans    | GET /api/plans/:id',
    }
  });
});

/* ── 404 HANDLER ─────────────────────────────
   If no route matched, send a 404 response.
   This MUST come after all routes.
────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    success : false,
    error   : `Route '${req.originalUrl}' not found on this server.`
  });
});

/* ── GLOBAL ERROR HANDLER ────────────────────
   If any route throws an error, it lands here.
   500 = Internal Server Error (our fault, not client's)
────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    success : false,
    error   : 'Something went wrong on the server.'
  });
});

/* ── START SERVER ────────────────────────────
   Listen on PORT 3000.
   Open http://localhost:3000 in your browser
   or Postman to test.
────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✅ GymFit API running at http://localhost:${PORT}`);
  console.log(`📋 Test it: http://localhost:${PORT}/api/members`);
});