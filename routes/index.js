const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/books', require('./books'));
router.use('/reviews', require('./reviews'));

// Optional: Add a simple base route to confirm the API is running
router.get('/', (req, res) => {
    res.send('Book Review API is running. Go to /api-docs for documentation.');
});

module.exports = router;
