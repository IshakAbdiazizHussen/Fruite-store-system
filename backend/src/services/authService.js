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

function buildSession(user) {
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

function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function createPasswordResetUrl(token) {
  const baseUrl = String(authConfig.passwordResetFrontendBaseUrl || "http://localhost:3000").replace(/\/+$/, "");
  return `${baseUrl}/reset-password/${encodeURIComponent(token)}`;
}

function createOauthState({ provider, nextPath = "/dashboard" }) {
  return Buffer.from(
    JSON.stringify({
      provider,
      nextPath: String(nextPath || "/dashboard"),
      nonce: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
    }),
    "utf8"
  ).toString("base64url");
}

function parseOauthState(state) {
  try {
    const parsed = JSON.parse(Buffer.from(String(state || ""), "base64url").toString("utf8"));
    return {
      provider: parsed?.provider || "",
      nextPath: parsed?.nextPath || "/dashboard",
      nonce: parsed?.nonce || "",
      createdAt: Number(parsed?.createdAt || 0),
    };
  } catch {
    return null;
  }
}

function createGoogleOauthUrl(state) {
  if (!authConfig.googleClientId || !authConfig.googleCallbackUrl) {
    throw createHttpError("Google OAuth is not configured.", 500);
  }

  const params = new URLSearchParams({
    client_id: authConfig.googleClientId,
    redirect_uri: authConfig.googleCallbackUrl,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function createAppleClientSecret() {
  if (
    !authConfig.appleClientId ||
    !authConfig.appleTeamId ||
    !authConfig.appleKeyId ||
    !authConfig.applePrivateKey
  ) {
    throw createHttpError("Apple OAuth is not configured.", 500);
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({
      alg: "ES256",
      kid: authConfig.appleKeyId,
      typ: "JWT",
    })
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: authConfig.appleTeamId,
      iat: now,
      exp: now + 60 * 60,
      aud: "https://appleid.apple.com",
      sub: authConfig.appleClientId,
    })
  ).toString("base64url");
  const unsignedToken = `${header}.${payload}`;
  const signer = crypto.createSign("SHA256");
  signer.update(unsignedToken);
  signer.end();

  const privateKey = authConfig.applePrivateKey.replace(/\\n/g, "\n");
  const signature = signer.sign(privateKey).toString("base64url");
  return `${unsignedToken}.${signature}`;
}

function createAppleOauthUrl(state) {
  if (!authConfig.appleClientId || !authConfig.appleCallbackUrl) {
    throw createHttpError("Apple OAuth is not configured.", 500);
  }

  const params = new URLSearchParams({
    client_id: authConfig.appleClientId,
    redirect_uri: authConfig.appleCallbackUrl,
    response_type: "code",
    response_mode: "query",
    scope: "name email",
    state,
  });

  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

async function exchangeGoogleCode(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: authConfig.googleClientId,
      client_secret: authConfig.googleClientSecret,
      redirect_uri: authConfig.googleCallbackUrl,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw createHttpError("Google sign-in could not be completed.", 400);
  }

  const tokenPayload = await response.json();
  const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    throw createHttpError("Google user profile could not be loaded.", 400);
  }

  const profile = await userInfoResponse.json();
  return {
    provider: "google",
    providerId: profile.sub,
    email: normalizeEmail(profile.email),
    name: profile.name || profile.given_name || "Google User",
  };
}

function decodeJwtPayload(token) {
  const parts = String(token || "").split(".");
  if (parts.length < 2) {
    throw createHttpError("OAuth token is invalid.", 400);
  }

  return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
}

async function exchangeAppleCode(code) {
  const clientSecret = createAppleClientSecret();
  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: authConfig.appleClientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: authConfig.appleCallbackUrl,
    }),
  });

  if (!response.ok) {
    throw createHttpError("Apple sign-in could not be completed.", 400);
  }

  const tokenPayload = await response.json();
  const idTokenPayload = decodeJwtPayload(tokenPayload.id_token);

  if (idTokenPayload.aud !== authConfig.appleClientId) {
    throw createHttpError("Apple sign-in audience is invalid.", 400);
  }

  if (idTokenPayload.iss !== "https://appleid.apple.com") {
    throw createHttpError("Apple sign-in issuer is invalid.", 400);
  }

  return {
    provider: "apple",
    providerId: idTokenPayload.sub,
    email: normalizeEmail(idTokenPayload.email),
    name: idTokenPayload.email || "Apple User",
  };
}

async function findOrCreateOauthUser({ provider, providerId, email, name }) {
  if (!providerId) {
    throw createHttpError("OAuth provider identifier is missing.", 400);
  }

  if (!email) {
    throw createHttpError("OAuth provider did not return an email address.", 400);
  }

  let user = await AdminUser.findOne({ provider, providerId });
  if (!user) {
    user = await AdminUser.findOne({ email });
  }

  if (user) {
    user.name = user.name || name;
    user.provider = provider;
    user.providerId = providerId;
    user.isActive = true;
    user.lastLoginAt = new Date();
    if (!user.passwordHash) {
      user.passwordHash = null;
    }
    await user.save();
    return user;
  }

  return AdminUser.create({
    name,
    email,
    passwordHash: null,
    provider,
    providerId,
    role: "Administrator",
    isActive: true,
    lastLoginAt: new Date(),
  });
}

async function completeOauthLogin({ provider, code }) {
  if (!code) {
    throw createHttpError("OAuth authorization code is missing.", 400);
  }

  const profile =
    provider === "google" ? await exchangeGoogleCode(code) : await exchangeAppleCode(code);
  const user = await findOrCreateOauthUser(profile);
  return buildSession(user);
}

async function loginAdmin({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const user = await AdminUser.findOne({ email: normalizedEmail });

  if (!user || !user.isActive || !user.passwordHash || !verifyPassword(password || "", user.passwordHash)) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return buildSession(user);
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
    provider: "password",
    providerId: null,
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

  if (user.passwordHash && verifyPassword(password, user.passwordHash)) {
    throw createHttpError("New password must be different from the current password.", 400);
  }

  user.passwordHash = hashPassword(password);
  user.provider = user.provider || "password";
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpiresAt = null;
  user.passwordResetRequestedAt = null;
  await user.save();

  return {
    message: "Your password has been reset successfully.",
  };
}

module.exports = {
  completeOauthLogin,
  createAppleOauthUrl,
  createGoogleOauthUrl,
  createOauthState,
  loginAdmin,
  parseOauthState,
  registerAdmin,
  requestPasswordReset,
  resetPassword,
  toSafeUser,
  validatePasswordResetToken,
};
