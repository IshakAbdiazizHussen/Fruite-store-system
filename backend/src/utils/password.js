const crypto = require("crypto");

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash || "").split(":");
  if (!salt || !key) return false;

  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derivedKey, "hex"));
}

function createToken(payload, secret, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac(DIGEST, secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

function verifyToken(token, secret) {
  const [header, body, signature] = String(token || "").split(".");
  if (!header || !body || !signature) {
    throw new Error("Invalid token format.");
  }

  const expectedSignature = crypto
    .createHmac(DIGEST, secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Invalid token signature.");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired.");
  }

  return payload;
}

module.exports = {
  createToken,
  hashPassword,
  verifyPassword,
  verifyToken,
};
