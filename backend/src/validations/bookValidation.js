const Joi = require('joi');

const createBookSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required(),
  author: Joi.string().trim().min(2).max(100).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().trim().max(50).optional(),
  stock: Joi.number().integer().min(0).default(0),
});

const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150),
  author: Joi.string().trim().min(2).max(100),
  price: Joi.number().positive(),
  category: Joi.string().trim().max(50),
  stock: Joi.number().integer().min(0),
}).min(1);

module.exports = { createBookSchema, updateBookSchema };