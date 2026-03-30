const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: { type: String, required: true, unique: true, trim: true },
    supplier: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    items: { type: mongoose.Schema.Types.Mixed, required: true },
    quantity: { type: mongoose.Schema.Types.Mixed, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
