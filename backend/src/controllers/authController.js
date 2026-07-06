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

function buildFrontendRedirectUrl(pathname, message) {
  const url = new URL(pathname, authConfig.frontendBaseUrl);
  if (message) {
    url.searchParams.set("error", message);
  }
  return url.toString();
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
  const state = createOauthState({
    provider: "google",
    nextPath: getSafeRedirectPath(req.query?.next),
  });
  const authorizationUrl = createGoogleOauthUrl(state);

  res.cookie(authConfig.oauthStateCookieName, state, oauthStateCookieOptions);
  res.redirect(302, authorizationUrl);
});

const googleOauthCallback = asyncHandler(async (req, res) => {
  const requestState = String(req.query?.state || "");
  const storedState = req.cookies?.[authConfig.oauthStateCookieName];
  const parsedState = validateOauthState(requestState, storedState, "google");

  res.clearCookie(authConfig.oauthStateCookieName, oauthStateCookieOptions);

  if (!parsedState) {
    return res.redirect(
      302,
      buildFrontendRedirectUrl("/login", "Google sign-in could not be verified.")
    );
  }

  try {
    const result = await completeOauthLogin({
      provider: "google",
      code: req.query?.code,
    });

    res.cookie(authConfig.cookieName, result.token, cookieOptions);
    return res.redirect(302, buildFrontendRedirectUrl(parsedState.nextPath));
  } catch (error) {
    return res.redirect(
      302,
      buildFrontendRedirectUrl("/login", error.message || "Google sign-in failed.")
    );
  }
});

const startAppleOauth = asyncHandler(async (req, res) => {
  const state = createOauthState({
    provider: "apple",
    nextPath: getSafeRedirectPath(req.query?.next),
  });
  const authorizationUrl = createAppleOauthUrl(state);

  res.cookie(authConfig.oauthStateCookieName, state, oauthStateCookieOptions);
  res.redirect(302, authorizationUrl);
});

const appleOauthCallback = asyncHandler(async (req, res) => {
  const requestState = String(req.query?.state || req.body?.state || "");
  const storedState = req.cookies?.[authConfig.oauthStateCookieName];
  const parsedState = validateOauthState(requestState, storedState, "apple");

  res.clearCookie(authConfig.oauthStateCookieName, oauthStateCookieOptions);

  if (!parsedState) {
    return res.redirect(
      302,
      buildFrontendRedirectUrl("/login", "Apple sign-in could not be verified.")
    );
  }

  try {
    const result = await completeOauthLogin({
      provider: "apple",
      code: req.query?.code || req.body?.code,
    });

    res.cookie(authConfig.cookieName, result.token, cookieOptions);
    return res.redirect(302, buildFrontendRedirectUrl(parsedState.nextPath));
  } catch (error) {
    return res.redirect(
      302,
      buildFrontendRedirectUrl("/login", error.message || "Apple sign-in failed.")
    );
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
