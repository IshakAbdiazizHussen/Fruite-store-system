const InventoryItem = require("../models/InventoryItem");

function normalizeInventoryItem(payload) {
  return {
    ...payload,
    stock: Number(payload.stock),
    price: Number(payload.price),
    status: Number(payload.stock) < 50 ? "Low Stock" : "In Stock",
  };
}

async function listInventoryItems() {
  return InventoryItem.find().sort({ createdAt: 1 }).lean();
}

async function createInventoryItem(payload) {
  const item = await InventoryItem.create(normalizeInventoryItem(payload));
  return item.toObject();
}

async function updateInventoryItem(name, payload) {
  const item = await InventoryItem.findOneAndUpdate(
    { name },
    normalizeInventoryItem(payload),
    { new: true, runValidators: true }
  ).lean();

  if (!item) {
    const error = new Error(`Inventory item ${name} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return item;
}

async function deleteInventoryItem(name) {
  const item = await InventoryItem.findOneAndDelete({ name });
  if (!item) {
    const error = new Error(`Inventory item ${name} not found.`);
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
  updateInventoryItem,
};
