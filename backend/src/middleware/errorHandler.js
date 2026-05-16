/**
 * Global error handler middleware.
 * Catches any error passed via next(err) from routes.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Default 500
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
};

module.exports = errorHandler;
