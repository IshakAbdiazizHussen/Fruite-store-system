const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    expiry: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.InventoryItem || mongoose.model("InventoryItem", inventoryItemSchema);
