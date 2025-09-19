const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  publishedYear: { type: Number },
  isbn: { type: String, unique: true, sparse: true }, // sparse: true allows null values not to be unique
  summary: { type: String },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
