const Order = require('../models/orderModel');
const Book = require('../models/bookModel');
const { createError } = require('../utils/errors');
async function createOrderService(userId, items) {
  let totalAmount = 0;
  const orderItems = [];

  // 1. መጽሐፍቱ በስቶክ ውስጥ መኖራቸውን ማረጋገጥ እና ዋጋ ማስላት
  for (const item of items) {
    const book = await Book.findById(item.book);
    if (!book) {
      throw createError(`Book not found with ID: ${item.book}`, 404);
    }

    if (book.stock < item.quantity) {
      throw createError(`Insufficient stock for book: ${book.title}`, 400);
    }

    // የጠቅላላ ዋጋ ስሌት
    totalAmount += book.price * item.quantity;

    orderItems.push({
      book: book._id,
      quantity: item.quantity,
      price: book.price,
    });

    // 2. የስቶክ መጠን መቀነስ (Stock Reduction)
    book.stock -= item.quantity;
    await book.save();
  }

  // 3. ትዕዛዙን በዳታቤዝ ውስጥ ማስቀመጥ
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
  });

  return order;
}

async function getUserOrdersService(userId) {
  return await Order.find({ user: userId }).populate('items.book', 'title price author');
}

module.exports = {
  createOrderService,
  getUserOrdersService,
};