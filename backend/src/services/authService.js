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

function getMissingConfigValueNames(provider) {
  if (provider === "google") {
    return [
      ["GOOGLE_CLIENT_ID", authConfig.googleClientId],
      ["GOOGLE_CLIENT_SECRET", authConfig.googleClientSecret],
      ["GOOGLE_CALLBACK_URL", authConfig.googleCallbackUrl],
    ]
      .filter(([, value]) => !String(value || "").trim())
      .map(([key]) => key);
  }

  return [
    ["APPLE_CLIENT_ID", authConfig.appleClientId],
    ["APPLE_TEAM_ID", authConfig.appleTeamId],
    ["APPLE_KEY_ID", authConfig.appleKeyId],
    ["APPLE_PRIVATE_KEY", authConfig.applePrivateKey],
    ["APPLE_CALLBACK_URL", authConfig.appleCallbackUrl],
  ]
    .filter(([, value]) => !String(value || "").trim())
    .map(([key]) => key);
}

function ensureOauthConfig(provider) {
  const missingValues = getMissingConfigValueNames(provider);
  if (missingValues.length > 0) {
    const providerLabel = provider === "google" ? "Google" : "Apple";
    throw createHttpError(
      `${providerLabel} OAuth is not configured. Missing: ${missingValues.join(", ")}.`,
      500
    );
  }
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
  ensureOauthConfig("google");

  const params = new URLSearchParams({
    client_id: authConfig.googleClientId,
    redirect_uri: authConfig.googleCallbackUrl,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "offline",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function createAppleClientSecret() {
  ensureOauthConfig("apple");

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
  // JWT ES256 uses the IEEE-P1363 (r || s) form, not OpenSSL's DER default.
  const signature = signer.sign({ key: privateKey, dsaEncoding: "ieee-p1363" }).toString("base64url");
  return `${unsignedToken}.${signature}`;
}

function createAppleOauthSession() {
  ensureOauthConfig("apple");
  const state = createOauthState({ provider: "apple" });
  const parsedState = parseOauthState(state);

  return {
    state,
    nonce: parsedState.nonce,
    clientId: authConfig.appleClientId,
    redirectURI: authConfig.appleCallbackUrl,
  };
}

async function exchangeGoogleCode(code) {
  ensureOauthConfig("google");
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

let appleJwksCache = { keys: [], expiresAt: 0 };

async function getAppleJwks() {
  if (appleJwksCache.expiresAt > Date.now() && appleJwksCache.keys.length) {
    return appleJwksCache.keys;
  }

  const response = await fetch("https://appleid.apple.com/auth/keys");
  if (!response.ok) {
    throw createHttpError("Apple's signing keys could not be loaded.", 502);
  }
  const payload = await response.json();
  if (!Array.isArray(payload?.keys)) {
    throw createHttpError("Apple returned invalid signing keys.", 502);
  }

  // Apple's keys rotate; cache briefly and refresh on an unknown key identifier.
  appleJwksCache = { keys: payload.keys, expiresAt: Date.now() + 60 * 60 * 1000 };
  return appleJwksCache.keys;
}

function parseJwt(token) {
  const [encodedHeader, encodedPayload, encodedSignature] = String(token || "").split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw createHttpError("Apple returned an invalid identity token.", 400);
  }
  try {
    return {
      header: JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8")),
      payload: JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")),
      signingInput: `${encodedHeader}.${encodedPayload}`,
      signature: Buffer.from(encodedSignature, "base64url"),
    };
  } catch {
    throw createHttpError("Apple returned an invalid identity token.", 400);
  }
}

async function verifyAppleIdentityToken(identityToken, expectedNonce) {
  const parsed = parseJwt(identityToken);
  if (parsed.header.alg !== "ES256" || !parsed.header.kid) {
    throw createHttpError("Apple identity token uses an unsupported signing algorithm.", 400);
  }

  let keys = await getAppleJwks();
  let jwk = keys.find(
    (key) => key.kid === parsed.header.kid && key.kty === "EC" && key.crv === "P-256"
  );
  if (!jwk) {
    appleJwksCache.expiresAt = 0;
    keys = await getAppleJwks();
    jwk = keys.find(
      (key) => key.kid === parsed.header.kid && key.kty === "EC" && key.crv === "P-256"
    );
  }
  if (!jwk) {
    throw createHttpError("Apple identity token signing key is unknown.", 400);
  }

  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const isValidSignature = crypto.verify(
    "sha256",
    Buffer.from(parsed.signingInput),
    { key: publicKey, dsaEncoding: "ieee-p1363" },
    parsed.signature
  );
  if (!isValidSignature) {
    throw createHttpError("Apple identity token signature is invalid.", 401);
  }

  const now = Math.floor(Date.now() / 1000);
  const audience = Array.isArray(parsed.payload.aud) ? parsed.payload.aud : [parsed.payload.aud];
  if (
    parsed.payload.iss !== "https://appleid.apple.com" ||
    !audience.includes(authConfig.appleClientId) ||
    !parsed.payload.sub ||
    !parsed.payload.exp ||
    Number(parsed.payload.exp) <= now ||
    (parsed.payload.iat && Number(parsed.payload.iat) > now + 300) ||
    !expectedNonce ||
    parsed.payload.nonce !== expectedNonce
  ) {
    throw createHttpError("Apple identity token validation failed.", 401);
  }

  return parsed.payload;
}

async function exchangeAppleCode(code) {
  ensureOauthConfig("apple");
  const clientSecret = createAppleClientSecret();
  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
  if (!tokenPayload?.id_token) {
    throw createHttpError("Apple did not return an identity token.", 400);
  }
  return tokenPayload;
}

function buildOauthDisplayName({ name, profileName, email, fallback }) {
  const sanitize = (value) => String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 120);

  return sanitize(name) || sanitize(profileName) || sanitize(email) || fallback;
}

async function findOrCreateOauthUser({ provider, providerId, email, name }) {
  if (!providerId) {
    throw createHttpError("OAuth provider identifier is missing.", 400);
  }

  if (provider !== "apple" && !email) {
    throw createHttpError("OAuth provider did not return an email address.", 400);
  }

  let user = provider === "apple"
    ? await AdminUser.findOne({ appleUserId: providerId })
    : await AdminUser.findOne({ provider, providerId });
  // Email is only a one-time linking aid. Apple subject remains the permanent lookup key.
  if (!user && email) {
    user = await AdminUser.findOne({ email });
  }

  if (user) {
    user.name = user.name || name;
    if (provider === "apple") {
      if (user.appleUserId && user.appleUserId !== providerId) {
        throw createHttpError("This email is already linked to a different Apple account.", 409);
      }
      user.appleUserId = providerId;
    } else {
      user.provider = provider;
      user.providerId = providerId;
    }
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
    email: email || undefined,
    passwordHash: null,
    provider,
    providerId,
    appleUserId: provider === "apple" ? providerId : undefined,
    role: "Administrator",
    isActive: true,
    lastLoginAt: new Date(),
  });
}

async function completeOauthLogin({ provider, code, identityToken, profileName, nonce }) {
  if (!code) {
    throw createHttpError("OAuth authorization code is missing.", 400);
  }

  let profile;
  if (provider === "google") {
    profile = await exchangeGoogleCode(code);
  } else {
    // Verify the SDK token and the token returned after server-side code exchange.
    // The code exchange keeps Apple client-secret generation off the browser.
    const sdkClaims = await verifyAppleIdentityToken(identityToken, nonce);
    const tokenPayload = await exchangeAppleCode(code);
    const claims = await verifyAppleIdentityToken(tokenPayload.id_token, nonce);
    if (claims.sub !== sdkClaims.sub) {
      throw createHttpError("Apple identity token does not match the authorization code.", 401);
    }
    profile = {
      provider: "apple",
      providerId: claims.sub,
      email: normalizeEmail(claims.email),
      name: buildOauthDisplayName({
        name: profileName,
        email: claims.email,
        fallback: "Apple User",
      }),
    };
  }

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
  createAppleOauthSession,
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
