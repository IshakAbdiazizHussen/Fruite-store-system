const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    customer: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    items: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
