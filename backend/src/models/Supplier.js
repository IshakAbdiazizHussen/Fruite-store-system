const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    products: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5 },
    orders: { type: Number, default: 0 },
    color: { type: String, default: "bg-orange-500" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
