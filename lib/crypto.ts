/**
 * chokepoint — cryptographic primitives.
 *
 * Dependency-free primitives built on node:crypto. Passwords use PBKDF2-SHA256
 * with a per-user random salt; integrity uses HMAC-SHA256; comparisons use
 * constant-time equality.
 */

import {
  createHash,
  createHmac,
  pbkdf2Sync,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

export const PBKDF2_BYTES = 32;
// Increased from 100k to 600k for materially stronger offline resistance.
export const PBKDF2_ROUNDS = 600_000;

export function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

export function b64urlDecode(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

export function safeEqual(a: Buffer | string, b: Buffer | string): boolean {
  const ab = typeof a === "string" ? Buffer.from(a) : a;
  const bb = typeof b === "string" ? Buffer.from(b) : b;
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function randomToken(): string {
  return b64url(randomBytes(32));
}

export function randomUUIDv4(): string {
  return randomUUID();
}

function derive(password: string, salt: Buffer, rounds: number): Buffer {
  if (!Number.isSafeInteger(rounds) || rounds < 100_000 || rounds > 2_000_000) {
    throw new Error("Invalid password-hash work factor");
  }
  return pbkdf2Sync(password, salt, rounds, PBKDF2_BYTES, "sha256");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = derive(password, salt, PBKDF2_ROUNDS);
  return `pbkdf2$${PBKDF2_ROUNDS}$${b64url(salt)}$${b64url(hash)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const rounds = Number(parts[1]);
  if (!Number.isSafeInteger(rounds) || rounds < 100_000 || rounds > 2_000_000) return false;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = b64urlDecode(parts[2]);
    expected = b64urlDecode(parts[3]);
  } catch {
    return false;
  }
  if (salt.length < 16 || expected.length !== PBKDF2_BYTES) return false;
  const actual = derive(password, salt, rounds);
  return timingSafeEqual(expected, actual);
}

export function hmacSign(key: string | Buffer, message: string): string {
  return createHmac("sha256", key).update(message, "utf8").digest("hex");
}

export function sha256Hex(message: string): string {
  return createHash("sha256").update(message, "utf8").digest("hex");
}

export function hexEqual(a: string, b: string): boolean {
  if (a.length !== b.length || !/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b)) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}
