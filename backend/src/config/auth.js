const authConfig = {
  cookieName: process.env.AUTH_COOKIE_NAME || "fruit_store_auth",
  secret: process.env.AUTH_SECRET || "change-this-auth-secret",
  tokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7),
  passwordResetTokenTtlMinutes: Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || 30),
  passwordResetFrontendBaseUrl:
    process.env.PASSWORD_RESET_FRONTEND_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000",
};

module.exports = {
  authConfig,
};
