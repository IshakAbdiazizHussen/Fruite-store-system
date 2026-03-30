const authConfig = {
  cookieName: process.env.AUTH_COOKIE_NAME || "fruit_store_auth",
  secret: process.env.AUTH_SECRET || "change-this-auth-secret",
  tokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7),
};

module.exports = {
  authConfig,
};
