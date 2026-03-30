const Order = require("../models/Order");
const { getNextCode } = require("./idService");

async function listOrders() {
  return Order.find().sort({ createdAt: -1 }).lean();
}

async function createOrder(payload) {
  const orderId = await getNextCode(Order, "orderId", "ORD");
  const order = await Order.create({
    ...payload,
    orderId,
    items: Number(payload.items),
    total: Number(payload.total),
  });

  return order.toObject();
}

async function updateOrder(orderId, payload) {
  const order = await Order.findOneAndUpdate(
    { orderId },
    {
      ...payload,
      items: Number(payload.items),
      total: Number(payload.total),
    },
    { new: true, runValidators: true }
  ).lean();

  if (!order) {
    const error = new Error(`Order ${orderId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return order;
}

async function deleteOrder(orderId) {
  const order = await Order.findOneAndDelete({ orderId });
  if (!order) {
    const error = new Error(`Order ${orderId} not found.`);
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createOrder,
  deleteOrder,
  listOrders,
  updateOrder,
};
