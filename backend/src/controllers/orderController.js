const { createOrderService, getUserOrdersService } = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const userId = req.user.id; // ከ authenticateToken middleware የሚመጣ
    const { items } = req.body;

    const order = await createOrderService(userId, items);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const orders = await getUserOrdersService(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
};