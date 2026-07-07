const { authConfig } = require("../config/auth");
const { asyncHandler } = require("./resourceController");
const {
  completeOauthLogin,  
  createAppleOauthUrl,
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
  secure: false,
  maxAge: authConfig.tokenTtlSeconds * 1000,
};

const oauthStateCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
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

function getOauthUserErrorMessage(error) {
  if (isOauthSetupError(error)) {
    return "Social login is not configured yet. Please contact the administrator.";
  }

  return "OAuth login failed. Please try again.";
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
  if (!requestState || !storedState || requestState !== storedState) {
    return null;
  }

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

const startAppleOauth = asyncHandler(async (req, res) => {
  logOauthDebug("apple:start:request", {
    method: req.method,
    url: req.originalUrl,
    query: req.query || {},
  });

  try {
    const state = createOauthState({
      provider: "apple",
      nextPath: getSafeRedirectPath(req.query?.next),
    });
    const authorizationUrl = createAppleOauthUrl(state);
    logOauthDebug("apple:start:redirect", {
      redirectUrl: authorizationUrl,
    });

    res.cookie(authConfig.oauthStateCookieName, state, oauthStateCookieOptions);
    res.redirect(302, authorizationUrl);
  } catch (error) {
    console.error("[auth] Apple OAuth start failed:", error.message);
    const failureRedirectUrl = isOauthSetupError(error)
      ? buildFrontendRedirectUrl("/login", "oauth_not_configured", { provider: "apple" })
      : buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("apple:start:error", {
      error: error.message,
      redirectUrl: failureRedirectUrl,
    });
    res.redirect(302, failureRedirectUrl);
  }
});

const appleOauthCallback = asyncHandler(async (req, res) => {
  logOauthDebug("apple:callback:request", {
    method: req.method,
    url: req.originalUrl,
    query: req.query || {},
    body: req.body || {},
  });

  if (req.query?.error || req.body?.error) {
    const providerMessage =
      req.query?.error_description ||
      req.body?.error_description ||
      "Apple sign-in was cancelled.";
    const failureRedirectUrl = buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("apple:callback:provider-error", {
      providerError: providerMessage,
      redirectUrl: failureRedirectUrl,
    });
    return res.redirect(302, failureRedirectUrl);
  }

  const requestState = String(req.query?.state || req.body?.state || "");
  const storedState = req.cookies?.[authConfig.oauthStateCookieName];
  const parsedState = validateOauthState(requestState, storedState, "apple");

  res.clearCookie(authConfig.oauthStateCookieName, oauthStateCookieOptions);

  if (!parsedState) {
    const failureRedirectUrl = buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("apple:callback:state-invalid", {
      redirectUrl: failureRedirectUrl,
    });
    return res.redirect(302, failureRedirectUrl);
  }

  try {
    const result = await completeOauthLogin({
      provider: "apple",
      code: req.query?.code || req.body?.code,
      identityToken: req.query?.id_token || req.body?.id_token,
      profileName: parseAppleProfileName(req.body?.user),
    });

    res.cookie(authConfig.cookieName, result.token, cookieOptions);
    const successRedirectUrl = buildOauthSuccessRedirectUrl(result, parsedState.nextPath);
    logOauthDebug("apple:callback:success", {
      userId: result.user?.id,
      email: result.user?.email,
      role: result.user?.role,
      redirectUrl: successRedirectUrl,
    });
    return res.redirect(302, successRedirectUrl);
  } catch (error) {
    console.error("[auth] Apple OAuth callback failed:", error.message);
    const failureRedirectUrl = isOauthSetupError(error)
      ? buildFrontendRedirectUrl("/login", "oauth_not_configured", { provider: "apple" })
      : buildFrontendRedirectUrl("/login", "oauth_failed");
    logOauthDebug("apple:callback:error", {
      error: error.message,
      redirectUrl: failureRedirectUrl,
    });
    return res.redirect(302, failureRedirectUrl);
  }
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
  appleOauthCallback,
  forgotPassword,
  googleOauthCallback,
  login,
  logout,
  me,
  removeImage,
  replaceImage,
  register,
  resetPasswordWithToken,
  startAppleOauth,
  startGoogleOauth,
  uploadImage,
  validateResetToken,
};
