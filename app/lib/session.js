import crypto from "node:crypto";

export const SESSION_COOKIE = "bot_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set to a value of at least 32 characters"
    );
  }
  return secret;
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload) {
  return b64url(
    crypto.createHmac("sha256", getSecret()).update(payload).digest()
  );
}

export function createSessionCookieValue() {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionCookieValue(value) {
  if (typeof value !== "string") return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const payload = value.slice(0, dot);
  const provided = value.slice(dot + 1);
  let expected;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return true;
}

export function passwordsMatch(provided, expected) {
  if (typeof provided !== "string" || typeof expected !== "string") return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function sessionCookieAttrs() {
  const isProd = process.env.NODE_ENV === "production";
  return [
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    isProd ? `Secure` : null,
    `Max-Age=${MAX_AGE_SECONDS}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearedCookieAttrs() {
  const isProd = process.env.NODE_ENV === "production";
  return [
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    isProd ? `Secure` : null,
    `Max-Age=0`,
  ]
    .filter(Boolean)
    .join("; ");
}
