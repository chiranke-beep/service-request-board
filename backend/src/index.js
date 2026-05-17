const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const jobRoutes = require('./routes/jobs');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Catch-all for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

// Only start the server when running directly, not during tests
if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
