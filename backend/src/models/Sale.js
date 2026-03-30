const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    saleId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    units: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    date: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
