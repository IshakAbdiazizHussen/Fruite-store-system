const { authConfig } = require("../config/auth");
const { createHttpError } = require("../utils/httpError");
const { asyncHandler } = require("./resourceController");
const {
  completeOauthLogin,
  createAppleOauthSession,
  createGoogleOauthUrl,
  createOauthState,
  loginAdmin,
  parseOauthState,
  registerAdmin,
  requestPasswordReset,
  resetPassword,
  validatePasswordResetToken,
} = require("../services/authService");
const {
  getCurrentUserProfile,
  uploadProfileImage,
  removeProfileImage,
} = require("../services/userProfileService");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: authConfig.frontendBaseUrl.startsWith("https://"),
  maxAge: authConfig.tokenTtlSeconds * 1000,
};

const oauthStateCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: authConfig.frontendBaseUrl.startsWith("https://"),
  maxAge: 10 * 60 * 1000,
};

function getSafeRedirectPath(value) {
  const rawValue = String(value || "/dashboard").trim();
  if (!rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return "/dashboard";
  }
  return rawValue;
}

function buildFrontendRedirectUrl(pathname, message, extraParams = {}) {
  const url = new URL(pathname, authConfig.frontendBaseUrl);
  if (message) {
    url.searchParams.set("error", message);
  }
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function isOauthSetupError(error) {
  const message = String(error?.message || "");
  return (
    message.includes("OAuth is not configured") ||
    message.includes("GOOGLE_CLIENT_ID") ||
    message.includes("GOOGLE_CLIENT_SECRET") ||
    message.includes("GOOGLE_CALLBACK_URL") ||
    message.includes("APPLE_CLIENT_ID") ||
    message.includes("APPLE_TEAM_ID") ||
    message.includes("APPLE_KEY_ID") ||
    message.includes("APPLE_PRIVATE_KEY") ||
    message.includes("APPLE_CALLBACK_URL")
  );
}

function logOauthDebug(label, payload) {
  console.info(`[auth][oauth] ${label}`, payload);
}

function getGoogleOauthConfigStatus() {
  return {
    googleClientIdExists: Boolean(String(authConfig.googleClientId || "").trim()),
    googleClientSecretExists: Boolean(String(authConfig.googleClientSecret || "").trim()),
    googleCallbackUrlExists: Boolean(String(authConfig.googleCallbackUrl || "").trim()),
  };
}

function buildOauthSuccessRedirectUrl(result, nextPath) {
  const url = new URL("/oauth/callback", authConfig.frontendBaseUrl);
  url.searchParams.set("token", result.token);
  url.searchParams.set(
    "user",
    Buffer.from(JSON.stringify(result.user || {}), "utf8").toString("base64url")
  );
  url.searchParams.set("next", getSafeRedirectPath(nextPath));
  return url.toString();
}

function parseAppleProfileName(userPayload) {
  if (!userPayload) {
    return "";
  }

  try {
    const parsed =
      typeof userPayload === "string" ? JSON.parse(userPayload) : userPayload;
    const firstName = String(parsed?.name?.firstName || "").trim();
    const lastName = String(parsed?.name?.lastName || "").trim();
    return [firstName, lastName].filter(Boolean).join(" ").trim();
  } catch {
    return "";
  }
}

function validateOauthState(requestState, storedState, provider) {
  if (!requestState || !storedState) {
    return null;
  }

  const requestBuffer = Buffer.from(requestState);
  const storedBuffer = Buffer.from(storedState);
  if (
    requestBuffer.length !== storedBuffer.length ||
    !require("crypto").timingSafeEqual(requestBuffer, storedBuffer)
  ) return null;

  const parsedState = parseOauthState(requestState);
  if (!parsedState || parsedState.provider !== provider) {
    return null;
  }

  if (!parsedState.createdAt || Date.now() - parsedState.createdAt > 10 * 60 * 1000) {
    return null;
  }

  return parsedState;
}

const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.body || {});

  res.cookie(authConfig.cookieName, result.token, cookieOptions);
  res.status(200).json(result);
});

const register = asyncHandler(async (req, res) => {
  const result = await registerAdmin(req.body || {});
  res.status(201).json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await requestPasswordReset(req.body || {});
  res.status(200).json(result);
});

const startGoogleOauth = asyncHandler(async (req, res) => {
  logOauthDebug("google:start:request", {
    method: req.method,
    url: req.originalUrl,
    query: req.query || {},
  });
  logOauthDebug("google:start:config-status", getGoogleOauthConfigStatus());

  try {
    const state = createOauthState({
      provider: "google",
      nextPath: getSafeRedirectPath(req.query?.next),
    });
    const authorizationUrl = createGoogleOauthUrl(state);
    logOauthDebug("google:start:redirect", {
      redirectUrl: authorizationUrl,
    });

    res.cookie(authConfig.oauthStateCookieName, state, oauthStateCookieOptions);
    res.redirect(302, authorizationUrl);
  } catch (error) {
    console.error("[auth] Google OAuth start failed:", error.message);
    const failureRedirectUrl = isOauthSetupError(error)
      ? buildFrontendRedirectUrl("/login", "oauth_not_configured", { provider: "google" })
      : buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("google:start:error", {
      error: error.message,
      redirectUrl: failureRedirectUrl,
    });
    res.redirect(302, failureRedirectUrl);
  }
});

const googleOauthCallback = asyncHandler(async (req, res) => {
  logOauthDebug("google:callback:request", {
    method: req.method,
    url: req.originalUrl,
    query: req.query || {},
    body: req.body || {},
  });

  if (req.query?.error) {
    const providerMessage = req.query?.error_description || "Google sign-in was cancelled.";
    const failureRedirectUrl = buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("google:callback:provider-error", {
      providerError: providerMessage,
      redirectUrl: failureRedirectUrl,
    });
    return res.redirect(302, failureRedirectUrl);
  }

  const requestState = String(req.query?.state || "");
  const storedState = req.cookies?.[authConfig.oauthStateCookieName];
  const parsedState = validateOauthState(requestState, storedState, "google");

  res.clearCookie(authConfig.oauthStateCookieName, oauthStateCookieOptions);

  if (!parsedState) {
    const failureRedirectUrl = buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("google:callback:state-invalid", {
      redirectUrl: failureRedirectUrl,
    });
    return res.redirect(302, failureRedirectUrl);
  }

  try {
    const result = await completeOauthLogin({
      provider: "google",
      code: req.query?.code,
    });

    res.cookie(authConfig.cookieName, result.token, cookieOptions);
    const successRedirectUrl = buildOauthSuccessRedirectUrl(result, parsedState.nextPath);
    logOauthDebug("google:callback:success", {
      userId: result.user?.id,
      email: result.user?.email,
      role: result.user?.role,
      redirectUrl: successRedirectUrl,
    });
    return res.redirect(302, successRedirectUrl);
  } catch (error) {
    console.error("[auth] Google OAuth callback failed:", error.message);
    const failureRedirectUrl = isOauthSetupError(error)
      ? buildFrontendRedirectUrl("/login", "oauth_not_configured", { provider: "google" })
      : buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("google:callback:error", {
      error: error.message,
      redirectUrl: failureRedirectUrl,
    });
    return res.redirect(302, failureRedirectUrl);
  }
});

// Apple JS receives the authorization response in the browser. This endpoint
// creates a server-bound state/nonce pair before the browser calls Apple.
const createAppleOauthConfiguration = asyncHandler(async (_req, res) => {
  const config = createAppleOauthSession();
  res.cookie(authConfig.appleOauthStateCookieName, config.state, oauthStateCookieOptions);
  res.status(200).json(config);
});

const completeAppleOauth = asyncHandler(async (req, res) => {
  const state = String(req.body?.state || "");
  const storedState = req.cookies?.[authConfig.appleOauthStateCookieName];
  const parsedState = validateOauthState(state, storedState, "apple");
  res.clearCookie(authConfig.appleOauthStateCookieName, oauthStateCookieOptions);

  if (!parsedState) {
    throw createHttpError("Apple sign-in session expired or could not be verified.", 401);
  }

  const result = await completeOauthLogin({
    provider: "apple",
    code: req.body?.code,
    identityToken: req.body?.idToken,
    profileName: parseAppleProfileName(req.body?.user),
    nonce: parsedState.nonce,
  });
  res.cookie(authConfig.cookieName, result.token, cookieOptions);
  res.status(200).json(result);
});

const validateResetToken = asyncHandler(async (req, res) => {
  const result = await validatePasswordResetToken(req.params.token);
  res.status(200).json(result);
});

const resetPasswordWithToken = asyncHandler(async (req, res) => {
  const result = await resetPassword({
    token: req.params.token,
    password: req.body?.password,
    confirmPassword: req.body?.confirmPassword,
  });
  res.status(200).json(result);
});

const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUserProfile(req.auth.user.id);
  res.status(200).json({ user });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(authConfig.cookieName, cookieOptions);
  res.status(200).json({
    ok: true,
  });
});

const uploadImage = asyncHandler(async (req, res) => {
  const user = await uploadProfileImage(req.auth.user.id, req.file, { replaceExisting: false });
  res.status(200).json({ user });
});

const replaceImage = asyncHandler(async (req, res) => {
  const user = await uploadProfileImage(req.auth.user.id, req.file, { replaceExisting: true });
  res.status(200).json({ user });
});

const removeImage = asyncHandler(async (req, res) => {
  const user = await removeProfileImage(req.auth.user.id);
  res.status(200).json({ user });
});

module.exports = {
  completeAppleOauth,
  createAppleOauthConfiguration,
  forgotPassword,
  googleOauthCallback,
  login,
  logout,
  me,
  removeImage,
  replaceImage,
  register,
  resetPasswordWithToken,
  startGoogleOauth,
  uploadImage,
  validateResetToken,
};
