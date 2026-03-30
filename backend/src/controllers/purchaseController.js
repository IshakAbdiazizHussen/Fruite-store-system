const { createCrudController } = require("./resourceController");
const {
  createPurchase,
  listPurchases,
  updatePurchase,
} = require("../services/purchaseService");

module.exports = createCrudController({
  list: listPurchases,
  create: createPurchase,
  update: updatePurchase,
});
