const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { checkResult } = require('../middleware/validate');

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  checkResult,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ error: 'Email already registered' });

      const user = await User.create({ name, email, password });
      const token = signToken(user._id);
      res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  checkResult,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = signToken(user._id);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
