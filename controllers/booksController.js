const Book = require('../models/book');
const Review = require('../models/review');

// @desc    Get all books
// @route   GET /books
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single book by ID
// @route   GET /books/:id
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new book
// @route   POST /books
exports.createBook = async (req, res, next) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A book with this ISBN already exists.' });
    }
    next(err);
  }
};

// @desc    Update a book
// @route   PUT /books/:id
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
     if (err.code === 11000) {
      return res.status(409).json({ message: 'A book with this ISBN already exists.' });
    }
    next(err);
  }
};

// @desc    Delete a book
// @route   DELETE /books/:id
exports.deleteBook = async (req, res, next) => {
  try {
    // Find the book by its ID and delete it in one atomic operation
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Also delete all reviews associated with the book
    await Review.deleteMany({ bookId: req.params.id });

    res.status(200).json({ message: 'Book and associated reviews deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for a specific book
// @route   GET /books/:id/reviews
exports.getReviewsForBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const reviews = await Review.find({ bookId: req.params.id }).populate('userId', 'displayName');
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};
