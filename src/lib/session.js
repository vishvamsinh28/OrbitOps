import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "orbitops_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }

  return "orbitops-dev-secret-change-me";
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(userId) {
  const payload = JSON.stringify({
    sub: String(userId),
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
  const encodedPayload = base64url(payload);

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );

    if (!payload.sub || payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function setSession(userId) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);

  return payload?.sub || null;
}
