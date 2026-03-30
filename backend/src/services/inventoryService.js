const InventoryItem = require("../models/InventoryItem");
const { createHttpError, normalizeDatabaseError } = require("../utils/httpError");

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
  try {
    if (!String(payload?.name || "").trim()) {
      throw createHttpError("Item name is required.", 400);
    }

    const item = await InventoryItem.create(normalizeInventoryItem(payload));
    return item.toObject();
  } catch (error) {
    throw normalizeDatabaseError(error, "Unable to create inventory item.");
  }
}

async function updateInventoryItem(name, payload) {
  try {
    const item = await InventoryItem.findOneAndUpdate(
      { name },
      normalizeInventoryItem(payload),
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      throw createHttpError(`Inventory item ${name} not found.`, 404);
    }

    return item;
  } catch (error) {
    throw normalizeDatabaseError(error, "Unable to update inventory item.");
  }
}

async function deleteInventoryItem(name) {
  const item = await InventoryItem.findOneAndDelete({ name });
  if (!item) {
    throw createHttpError(`Inventory item ${name} not found.`, 404);
  }
}

module.exports = {
  createInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
  updateInventoryItem,
};
