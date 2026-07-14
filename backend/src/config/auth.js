const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const authConfig = {
  cookieName: process.env.AUTH_COOKIE_NAME || "fruit_store_auth",
  secret: process.env.AUTH_SECRET || "change-this-auth-secret",
  tokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7),
  frontendBaseUrl,
  passwordResetTokenTtlMinutes: Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || 30),
  passwordResetFrontendBaseUrl:
    process.env.PASSWORD_RESET_FRONTEND_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000",
  oauthStateCookieName: process.env.OAUTH_STATE_COOKIE_NAME || "fruit_store_oauth_state",
  appleOauthStateCookieName:
    process.env.APPLE_OAUTH_STATE_COOKIE_NAME || "fruit_store_apple_oauth_state",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback",
  appleClientId: process.env.APPLE_CLIENT_ID || "",
  appleTeamId: process.env.APPLE_TEAM_ID || "",
  appleKeyId: process.env.APPLE_KEY_ID || "",
  applePrivateKey: process.env.APPLE_PRIVATE_KEY || "",
  // Apple JS needs a registered HTTPS page on the frontend origin for its popup flow.
  appleCallbackUrl: process.env.APPLE_CALLBACK_URL || `${frontendBaseUrl}/login`,
};

module.exports = {
  authConfig,
};
