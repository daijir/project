const passport = require('passport');

// @desc    Auth with Google
// @route   GET /auth/google
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// @desc    Google auth callback
// @route   GET /auth/google/callback
exports.googleCallback = passport.authenticate('google', {
  failureRedirect: '/', // or a dedicated failure page
  successRedirect: '/api-docs' // Redirect to docs or a dashboard on success
});

// @desc    Logout user
// @route   GET /auth/logout
exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/'); // Redirect to homepage
  });
};

// @desc    Get current user
// @route   GET /auth/user
exports.getCurrentUser = (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};
