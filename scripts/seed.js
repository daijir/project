const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/book');
const Review = require('../models/review');
const User = require('../models/user');

// Load env vars
dotenv.config({ path: './.env' });

const connectDB = require('../config/db');
connectDB();

const sampleBooks = [
  { title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', genre: 'Sci-Fi', publishedYear: 1979, isbn: '978-0345391803', summary: 'A hilarious sci-fi adventure.' },
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', publishedYear: 1949, isbn: '978-0451524935', summary: 'A chilling vision of a totalitarian future.' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', publishedYear: 1813, isbn: '978-1503290563', summary: 'A classic romance novel.' }
];

const importData = async () => {
  try {
    // Clear existing data
    await Book.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();

    console.log('Data cleared...');

    // Insert new data
    await Book.insertMany(sampleBooks);

    console.log('Sample books imported!');
    console.log('NOTE: Reviews and Users are not seeded by default.');
    
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
        await Book.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
