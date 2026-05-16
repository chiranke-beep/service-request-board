function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Mongoose validation errors (missing required fields, enum mismatches, etc.)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Invalid MongoDB ObjectId (e.g. /api/jobs/not-a-real-id)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
}

module.exports = errorHandler;
