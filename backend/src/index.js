const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./routes/jobs');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/jobs', jobRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use(errorHandler);

// ── Database + Server ──────────────────────────────────────────────────────────
// Only connect and start the HTTP server when run directly (not during tests)
if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app; // exported for Jest/Supertest
