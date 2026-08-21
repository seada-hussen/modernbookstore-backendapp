const mongoose = require('mongoose');
const Book = require('./models/bookModel'); // የመጽሐፍ ሞዴልሽን አድራሻ አረጋግጪ
require('dotenv').config();

const sampleBooks = Array.from({ length: 50 }, (_, i) => ({
  title: `Islamic Book ${i + 1}`,
  author: `Author ${i + 1}`,
  price: Math.floor(Math.random() * 50) + 10,
  stock: Math.floor(Math.random() * 100) + 10,
  category: "Islamic",
  description: `Detailed information for Islamic Book ${i + 1}`
}));

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstore');
    await Book.deleteMany({}); // የቀደሙትን ያጸዳል
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`✅ ${createdBooks.length} Books successfully added to Local DB!`);
    console.log(`📌 Sample Book ID for Testing Order: ${createdBooks[0]._id}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();