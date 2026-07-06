const crypto = require("crypto");

const AdminUser = require("../models/AdminUser");
const { authConfig } = require("../config/auth");
const { createToken, hashPassword, verifyPassword } = require("../utils/password");
const { createHttpError } = require("../utils/httpError");
const { toSafeUser } = require("../utils/userView");
const { sendPasswordResetEmail } = require("./emailService");

const GENERIC_FORGOT_PASSWORD_MESSAGE =
  "If an account exists for this email, a reset link or OTP has been sent.";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function createPasswordResetUrl(token) {
  const baseUrl = String(authConfig.passwordResetFrontendBaseUrl || "http://localhost:3000").replace(/\/+$/, "");
  return `${baseUrl}/reset-password/${encodeURIComponent(token)}`;
}

async function loginAdmin({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const user = await AdminUser.findOne({ email: normalizedEmail });

  if (!user || !user.isActive || !verifyPassword(password || "", user.passwordHash)) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const safeUser = toSafeUser(user);
  const token = createToken(
    {
      sub: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    },
    authConfig.secret,
    authConfig.tokenTtlSeconds
  );

  return {
    token,
    user: safeUser,
  };
}

async function registerAdmin({ fullName, email, password }) {
  const normalizedName = String(fullName || "").trim();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "");

  if (!normalizedName) {
    throw createHttpError("Full name is required.", 400);
  }

  if (!normalizedEmail) {
    throw createHttpError("Email is required.", 400);
  }

  if (!normalizedPassword) {
    throw createHttpError("Password is required.", 400);
  }

  if (normalizedPassword.length < 8) {
    throw createHttpError("Password must be at least 8 characters.", 400);
  }

  const existingUser = await AdminUser.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw createHttpError("Email already exists.", 409);
  }

  const user = await AdminUser.create({
    name: normalizedName,
    email: normalizedEmail,
    passwordHash: hashPassword(normalizedPassword),
    role: "Administrator",
    isActive: true,
  });

  return {
    message: "Account created successfully. Please sign in.",
    user: toSafeUser(user),
  };
}

async function requestPasswordReset({ email }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { message: GENERIC_FORGOT_PASSWORD_MESSAGE };
  }

  const user = await AdminUser.findOne({ email: normalizedEmail, isActive: true });
  if (!user) {
    return { message: GENERIC_FORGOT_PASSWORD_MESSAGE };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = hashResetToken(rawToken);
  user.passwordResetTokenExpiresAt = new Date(
    Date.now() + authConfig.passwordResetTokenTtlMinutes * 60 * 1000
  );
  user.passwordResetRequestedAt = new Date();
  await user.save();

  await sendPasswordResetEmail({
    to: user.email,
    resetUrl: createPasswordResetUrl(rawToken),
    expiresInMinutes: authConfig.passwordResetTokenTtlMinutes,
  });

  return {
    message: GENERIC_FORGOT_PASSWORD_MESSAGE,
  };
}

async function validatePasswordResetToken(token) {
  const user = await AdminUser.findOne({
    passwordResetTokenHash: hashResetToken(token),
    passwordResetTokenExpiresAt: { $gt: new Date() },
    isActive: true,
  });

  if (!user) {
    throw createHttpError("This password reset link is invalid or has expired.", 400);
  }

  return {
    valid: true,
    expiresAt: user.passwordResetTokenExpiresAt,
  };
}

async function resetPassword({ token, password, confirmPassword }) {
  if (!password || !confirmPassword) {
    throw createHttpError("Both password fields are required.", 400);
  }

  if (password !== confirmPassword) {
    throw createHttpError("New password and confirm password do not match.", 400);
  }

  if (String(password).length < 8) {
    throw createHttpError("Password must be at least 8 characters.", 400);
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw createHttpError("Password must include at least one letter and one number.", 400);
  }

  const user = await AdminUser.findOne({
    passwordResetTokenHash: hashResetToken(token),
    passwordResetTokenExpiresAt: { $gt: new Date() },
    isActive: true,
  });

  if (!user) {
    throw createHttpError("This password reset link is invalid or has expired.", 400);
  }

  if (verifyPassword(password, user.passwordHash)) {
    throw createHttpError("New password must be different from the current password.", 400);
  }

  user.passwordHash = hashPassword(password);
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpiresAt = null;
  user.passwordResetRequestedAt = null;
  await user.save();

  return {
    message: "Your password has been reset successfully.",
  };
}

module.exports = {
  loginAdmin,
  registerAdmin,
  requestPasswordReset,
  resetPassword,
  toSafeUser,
  validatePasswordResetToken,
};
