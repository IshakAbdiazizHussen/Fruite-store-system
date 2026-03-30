const AdminUser = require("../models/AdminUser");
const { authConfig } = require("../config/auth");
const { createToken, verifyPassword } = require("../utils/password");

function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
  };
}

async function loginAdmin({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
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

module.exports = {
  loginAdmin,
};
