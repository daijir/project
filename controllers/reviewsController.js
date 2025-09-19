const Review = require('../models/review');
const Book = require('../models/book');

// @desc    Create a new review for a book
// @route   POST /books/:id/reviews
exports.createReview = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const { rating, comment } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const newReview = new Review({
            bookId,
            userId: req.user.id, // Comes from isAuthenticated middleware
            rating,
            comment
        });

        const savedReview = await newReview.save();

        // After saving, update the book's average rating
        await updateAverageRating(bookId);

        res.status(201).json(savedReview);
    } catch (err) {
        next(err);
    }
};

// @desc    Update a review
// @route   PUT /reviews/:id
exports.updateReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;

        let review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user owns the review
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();

        // After updating, update the book's average rating
        await updateAverageRating(review.bookId);

        res.status(200).json(updatedReview);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a review
// @route   DELETE /reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user owns the review
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this review' });
        }

        const bookId = review.bookId;
        await review.remove();

        // After deleting, update the book's average rating
        await updateAverageRating(bookId);

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// Helper function to calculate and update the average rating of a book
const updateAverageRating = async (bookId) => {
    const reviews = await Review.find({ bookId });
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const avg = totalRating / reviews.length;
        await Book.findByIdAndUpdate(bookId, { averageRating: avg.toFixed(1) });
    } else {
        // If no reviews, reset to 0
        await Book.findByIdAndUpdate(bookId, { averageRating: 0 });
    }
};
