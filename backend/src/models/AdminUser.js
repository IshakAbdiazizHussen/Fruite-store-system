const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Apple can legitimately omit email for managed Apple Accounts. Apple subject is the
    // durable identity, so email must be optional and must not be the Apple lookup key.
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true, default: undefined },
    passwordHash: { type: String, default: null },
    provider: { type: String, default: "password", trim: true },
    providerId: { type: String, default: null, trim: true },
    appleUserId: { type: String, unique: true, sparse: true, trim: true, default: undefined },
    role: { type: String, default: "Administrator", trim: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    profile_image_url: { type: String, default: null, trim: true },
    passwordResetTokenHash: { type: String, default: null },
    passwordResetTokenExpiresAt: { type: Date, default: null },
    passwordResetRequestedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
