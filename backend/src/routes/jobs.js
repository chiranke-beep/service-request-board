const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const JobRequest = require('../models/JobRequest');
const { validateJob, validateStatus } = require('../middleware/validate');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all jobs. You can filter by category, status, or search by keyword.
router.get('/', async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// Get a single job by its ID.
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
});

// Create a new job request.
router.post('/', validateJob, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// Update the status of a job (Open, In Progress, Closed).
router.patch('/:id', validateStatus, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
});

// Delete a job by ID.
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
