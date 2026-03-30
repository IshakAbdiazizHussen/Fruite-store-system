const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "Administrator", trim: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
