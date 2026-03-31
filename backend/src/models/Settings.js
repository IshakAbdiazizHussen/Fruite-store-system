const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    profile: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      role: { type: String, required: true, trim: true },
      avatar: { type: String, required: true, trim: true },
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      expiry: { type: Boolean, default: true },
    },
    notificationEmail: { type: String, required: true, trim: true },
    regional: {
      language: { type: String, required: true, trim: true },
      currency: { type: String, required: true, trim: true },
    },
    security: {
      password: { type: String, required: true, trim: true },
      lastChanged: { type: String, default: null },
      loginAlerts: { type: Boolean, default: true },
      rememberDevice: { type: Boolean, default: true },
      twoFactorEnabled: { type: Boolean, default: false },
      sessionTimeoutMinutes: { type: Number, default: 30 },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
