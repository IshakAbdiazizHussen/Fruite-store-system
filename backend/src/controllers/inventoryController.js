const { createCrudController } = require("./resourceController");
const {
  createInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
  updateInventoryItem,
} = require("../services/inventoryService");

module.exports = createCrudController({
  list: listInventoryItems,
  create: createInventoryItem,
  update: updateInventoryItem,
  remove: deleteInventoryItem,
});
