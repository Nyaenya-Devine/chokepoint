/** Secure signed session-cookie handling for chokepoint. */

import { cookies } from "next/headers";
import { b64urlDecode, b64url, hmacSign, safeEqual } from "./crypto";

const SESSION_COOKIE = "chokepoint_session";
const SESSION_MAX_AGE = 60 * 60;

function requiredSecret(): string {
  const secret = process.env.CHOKEPOINT_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CHOKEPOINT_SESSION_SECRET must be set to a random value of at least 32 characters in production");
  }
  return "local-development-only-session-secret-change-me";
}

export interface SessionPayload {
  uid: string;
  exp: number;
}

function sign(uid: string, exp: number): string {
  return hmacSign(requiredSecret(), `${uid}.${exp}`);
}

function makeToken(payload: SessionPayload): string {
  const body = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${body}.${sign(payload.uid, payload.exp)}`;
}

function parseToken(token: string): SessionPayload | null {
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const body = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  let payload: SessionPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString("utf8"));
  } catch {
    return null;
  }
  if (!payload || typeof payload.uid !== "string" || !payload.uid || !Number.isSafeInteger(payload.exp)) return null;
  const expected = sign(payload.uid, payload.exp);
  if (!safeEqual(sig, expected) || Date.now() > payload.exp) return null;
  return payload;
}

export async function setSessionCookie(uid: string): Promise<void> {
  const payload: SessionPayload = { uid, exp: Date.now() + SESSION_MAX_AGE * 1000 };
  const store = await cookies();
  store.set(SESSION_COOKIE, makeToken(payload), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUid(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return parseToken(token)?.uid ?? null;
  } catch {
    return null;
  }
}
