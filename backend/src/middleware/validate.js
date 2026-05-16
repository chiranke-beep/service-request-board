const { body, validationResult } = require('express-validator');

/**
 * Validation rules for POST /api/jobs (create a new job)
 */
const validateJob = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('category')
    .optional()
    .isIn(['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'])
    .withMessage('Category must be one of: Plumbing, Electrical, Painting, Joinery, Other'),

  body('contactEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((e) => e.msg),
      });
    }
    next();
  },
];

/**
 * Validation rules for PATCH /api/jobs/:id (update status only)
 */
const validateStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Open', 'In Progress', 'Closed'])
    .withMessage('Status must be one of: Open, In Progress, Closed'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((e) => e.msg),
      });
    }
    next();
  },
];

module.exports = { validateJob, validateStatus };
