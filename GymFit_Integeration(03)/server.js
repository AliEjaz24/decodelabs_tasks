// Load environment variables FIRST — before anything else
require('dotenv').config();

const express = require('express');
const connectDB = require('./db');

const app = express();

// ─── MIDDLEWARE ───────────────────────────────
app.use(express.json());      // parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ─── DATABASE CONNECTION ──────────────────────
connectDB();

// ─── ROUTES ──────────────────────────────────
app.use('/api/members',  require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/classes',  require('./routes/classes'));
app.use('/api/plans',    require('./routes/plans'));

// ─── ROOT ROUTE ───────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🏋️ GymFit API — Project 3: Database Integration',
    status: 'Running',
    endpoints: {
      members:  '/api/members',
      trainers: '/api/trainers',
      classes:  '/api/classes',
      plans:    '/api/plans'
    }
  });
});

// ─── 404 HANDLER ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong on the server' });
});

// ─── START SERVER ─────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GymFit API running on http://localhost:${PORT}`);
});