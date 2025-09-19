const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

// Load config
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Connect to Database
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // You might want to use connect-mongo to store sessions in DB for production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Swagger Docs
require('./docs/swagger')(app);

// Routes
app.use('/', require('./routes'));

// --- Error Handling --- //
// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found: The requested URL was not found on this server.' });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred.',
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
