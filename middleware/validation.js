const { body, validationResult } = require('express-validator');

// Book validation rules
exports.validateBook = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('author').trim().notEmpty().withMessage('Author is required.'),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Invalid year.'),
  body('isbn').optional().isISBN().withMessage('Invalid ISBN format.')
];

// Review validation rules
exports.validateReview = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('comment').optional().trim()
];


// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
