import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/crypto";
import { store } from "@/lib/store";
import { setSessionCookie } from "@/lib/session";
import { consumeRateLimit } from "@/lib/rateLimit";

function requestIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password || username.length > 100 || password.length > 1000) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const ip = requestIp(req);
  const ipLimit = consumeRateLimit(`login:ip:${ip}`, 30);
  const userLimit = consumeRateLimit(`login:user:${username}`, 10);
  if (!ipLimit.allowed || !userLimit.allowed) {
    const retry = Math.max(ipLimit.retryAfterSeconds, userLimit.retryAfterSeconds);
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retry), "Cache-Control": "no-store" } }
    );
  }

  const user = store.getUserByUsername(username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    store.append({
      actor: username || "unknown",
      actorRole: "viewer",
      action: "login_failed",
      target: "session",
      meta: { method: "password", ok: false, ip },
    });
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  if (!user.active) return NextResponse.json({ error: "Account is disabled." }, { status: 403 });

  await setSessionCookie(user.id);
  store.append({ actor: user.username, actorRole: user.role, action: "login", target: "session", meta: { method: "password", ok: true, ip } });
  return NextResponse.json({ ok: true, user: store.toPublic(user) }, { headers: { "Cache-Control": "no-store" } });
}
