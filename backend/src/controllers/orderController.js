const { createCrudController } = require("./resourceController");
const {
  createOrder,
  deleteOrder,
  listOrders,
  updateOrder,
} = require("../services/orderService");

module.exports = createCrudController({
  list: listOrders,
  create: createOrder,
  update: updateOrder,
  remove: deleteOrder,
});
