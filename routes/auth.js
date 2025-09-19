const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', authController.googleAuth);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', authController.googleCallback);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', authController.logout);

// @desc    Get current user data
// @route   GET /auth/user
router.get('/user', isAuthenticated, authController.getCurrentUser);

module.exports = router;
