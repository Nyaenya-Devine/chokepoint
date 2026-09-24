/**
 * chokepoint — in-memory application store (server-only).
 * Production requires a strong ledger secret and explicit deployment credentials.
 */

import "server-only";
import { hashPassword, randomToken, randomUUIDv4 } from "./crypto";
import { appendEntry, verifyChain, type LedgerEntry } from "./ledger";
import { assessLedger } from "./anomaly";
import type { AppState, Mandate, PublicUser, User } from "./types";
import type { Action, Role } from "./authz";
import { mandateFingerprint, type BlastRadius, type MandateEnvironment } from "./mandatePolicy";

function requiredLedgerSecret(): string {
  const secret = process.env.CHOKEPOINT_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("CHOKEPOINT_SECRET must be set to a random value of at least 32 characters in production");
  return "local-development-only-ledger-secret-change-me";
}

const LEDGER_SECRET = requiredLedgerSecret();

function requiredSeedPassword(name: string, fallback: string): string {
  const value = process.env[name];
  if (process.env.NODE_ENV === "production") {
    if (!value || value.length < 12 || value.length > 256) throw new Error(`${name} must be set to a unique password of 12-256 characters in production`);
    return value;
  }
  return value || fallback;
}

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString(); }

function seedUsers(): User[] {
  return [
    { id: "u-admin", username: "admin", displayName: "Nia Owiti", role: "admin", passwordHash: hashPassword(requiredSeedPassword("CHOKEPOINT_ADMIN_PASSWORD", "admin1234")), active: true, createdAt: hoursAgo(24 * 60), lastLoginAt: hoursAgo(1) },
    { id: "u-op", username: "operator", displayName: "Dmitri Kovac", role: "operator", passwordHash: hashPassword(requiredSeedPassword("CHOKEPOINT_OPERATOR_PASSWORD", "operator1234")), active: true, createdAt: hoursAgo(24 * 40), lastLoginAt: hoursAgo(3) },
    { id: "u-auditor", username: "auditor", displayName: "Tendai Moyo", role: "auditor", passwordHash: hashPassword(requiredSeedPassword("CHOKEPOINT_AUDITOR_PASSWORD", "auditor1234")), active: true, createdAt: hoursAgo(24 * 30), lastLoginAt: hoursAgo(20) },
    { id: "u-viewer", username: "viewer", displayName: "Samir Patel", role: "viewer", passwordHash: hashPassword(requiredSeedPassword("CHOKEPOINT_VIEWER_PASSWORD", "viewer1234")), active: true, createdAt: hoursAgo(24 * 10), lastLoginAt: hoursAgo(5) },
  ];
}

interface SeedEvent { ts: string; actor: string; actorRole: Role; action: string; target: string; meta: Record<string, unknown>; }
function seedEvents(): SeedEvent[] {
  const now = Date.now(); const at = (mins: number) => new Date(now - mins * 60_000).toISOString();
  return [
    { ts: at(180), actor: "admin", actorRole: "admin", action: "login", target: "session", meta: { method: "password", ok: true } },
    { ts: at(178), actor: "operator", actorRole: "operator", action: "login", target: "session", meta: { method: "password", ok: true } },
    { ts: at(170), actor: "operator", actorRole: "operator", action: "run_scan", target: "agent-billing", meta: { scope: "read", results: 4 } },
    { ts: at(150), actor: "operator", actorRole: "operator", action: "request_agent_action", target: "agent-refunds", meta: { scope: "approve" } },
    { ts: at(120), actor: "admin", actorRole: "admin", action: "approve", target: "agent-refunds", meta: { mandate: "pending" } },
    { ts: at(95), actor: "operator", actorRole: "operator", action: "grant_role", target: "operator", meta: { role: "admin", requester: "operator" } },
    { ts: at(93), actor: "operator", actorRole: "operator", action: "grant_role", target: "auditor", meta: { role: "admin", requester: "operator" } },
    { ts: at(92), actor: "operator", actorRole: "operator", action: "grant_role", target: "unknown-user", meta: { role: "admin" } },
    { ts: at(70), actor: "unknown-agent", actorRole: "viewer", action: "login_failed", target: "session", meta: { ip: "196.201.214.12" } },
    { ts: at(68), actor: "unknown-agent", actorRole: "viewer", action: "login_failed", target: "session", meta: { ip: "102.214.88.7" } },
    { ts: at(66), actor: "operator", actorRole: "operator", action: "login_failed", target: "session", meta: { ip: "102.214.88.7" } },
    { ts: at(20), actor: "admin", actorRole: "admin", action: "rotate_secret", target: "agent-billing", meta: { scope: "critical" } },
    { ts: at(12), actor: "admin", actorRole: "admin", action: "grant_agent", target: "agent-refunds", meta: { scope: "write", hours: "after" } },
    { ts: at(8), actor: "auditor", actorRole: "auditor", action: "export_log", target: "audit", meta: { format: "json" } },
    { ts: at(4), actor: "viewer", actorRole: "viewer", action: "login", target: "session", meta: { method: "password", ok: true } },
    { ts: at(2), actor: "viewer", actorRole: "viewer", action: "view_log", target: "audit", meta: {} },
  ];
}

class Store {
  users: User[] = []; ledger: LedgerEntry[] = []; mandates: Mandate[] = []; private initialized = false;
  constructor() { this.init(); }
  private init(): void {
    if (this.initialized) return; this.initialized = true; this.users = seedUsers(); const pendingMandate = this.seedMandates();
    let prev: LedgerEntry | null = null;
    for (const e of seedEvents()) { const entry = appendEntry(prev, { ...e, id: randomUUIDv4() }, LEDGER_SECRET); this.ledger.push(entry); prev = entry; }
    this.mandates = pendingMandate;
  }
  private seedMandates(): Mandate[] {
    const context = {
      action: "grant_role" as const,
      target: "operator",
      requestedBy: "u-op",
      createdAt: hoursAgo(0.2),
      expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
      purpose: "Restore incident-response administration during a bounded response window.",
      environment: "production" as const,
      blastRadius: "single-resource" as const,
    };
    return [{
      id: randomUUIDv4(),
      ...context,
      approverId: null,
      state: "pending",
      reason: "Escalate operator to admin for incident response window.",
      contextFingerprint: mandateFingerprint(context),
    }];
  }
  getUserByUsername(username: string): User | undefined { return this.users.find((u) => u.username === username); }
  getUserById(id: string): User | undefined { return this.users.find((u) => u.id === id); }
  toPublic(u: User): PublicUser { const { passwordHash: _drop, ...pub } = u; return pub; }
  publicUsers(): PublicUser[] { return this.users.map((u) => this.toPublic(u)); }
  append(event: { actor: string; actorRole: Role; action: string; target: string; meta: Record<string, unknown>; }): LedgerEntry { const prev = this.ledger[this.ledger.length - 1] ?? null; const entry = appendEntry(prev, { id: randomUUIDv4(), ts: new Date().toISOString(), ...event }, LEDGER_SECRET); this.ledger.push(entry); return entry; }
  verify() { return verifyChain(this.ledger, LEDGER_SECRET); }
  recent(n: number): LedgerEntry[] { return [...this.ledger].slice(-n).reverse(); }
  risks() { return assessLedger(this.ledger).reverse(); }
  riskSummary() { const risks = this.risks(); const counts: Record<string, number> = {}; for (const r of risks) counts[r.severity] = (counts[r.severity] ?? 0) + 1; return { total: risks.length, critical: counts.CRITICAL ?? 0, high: counts.HIGH ?? 0, medium: counts.MEDIUM ?? 0, low: counts.LOW ?? 0, riskIndex: Math.round((risks.reduce((s, r) => s + r.score, 0) / Math.max(1, risks.length)) * 100) }; }
  dashboard() { const ordered = [...this.ledger].sort((a, b) => a.index - b.index); const risks = assessLedger(this.ledger); const trend = risks.map((r) => ({ index: r.entryIndex, score: r.score, severity: r.severity })); const actions: Record<string, number> = {}; for (const e of ordered) { const key = actionCategory(e.action); actions[key] = (actions[key] ?? 0) + 1; } const actionBreakdown = Object.entries(actions).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count); const buckets = 6; const bucketMs = 10 * 60_000; const now = Date.now(); const activity: { label: string; count: number; risky: number }[] = []; for (let i = buckets - 1; i >= 0; i--) { const start = now - (i + 1) * bucketMs; const end = start + bucketMs; let count = 0; let risky = 0; for (const e of ordered) { const t = new Date(e.ts).getTime(); if (t >= start && t < end) { count++; if (/login_failed|grant_role|rotate_secret|revoke|delete|elevate/.test(e.action)) risky++; } } activity.push({ label: `${-i * 10}m`, count, risky }); } const topAlerts = this.risks().filter((r) => r.severity === "CRITICAL" || r.severity === "HIGH" || r.severity === "MEDIUM").slice(0, 6); return { trend, actionBreakdown, activity, topAlerts, totals: { events: ordered.length, logins: actionBreakdown.find((a) => a.label === "Auth")?.count ?? 0, privileged: actionBreakdown.filter((a) => ["Privilege", "Dual-control"].includes(a.label)).reduce((s, a) => s + a.count, 0) } }; }
  createMandate(params: {
    action: Action;
    target: string;
    requestedBy: string;
    reason: string;
    purpose: string;
    environment: MandateEnvironment;
    blastRadius: BlastRadius;
    ttlMinutes: number;
  }): Mandate {
    const context = {
      action: params.action,
      target: params.target,
      requestedBy: params.requestedBy,
      purpose: params.purpose,
      environment: params.environment,
      blastRadius: params.blastRadius,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + params.ttlMinutes * 60_000).toISOString(),
    };
    const mandate: Mandate = {
      id: randomUUIDv4(),
      ...context,
      approverId: null,
      state: "pending",
      reason: params.reason,
      contextFingerprint: mandateFingerprint(context),
    };
    this.mandates.unshift(mandate);
    return mandate;
  }
  decideMandate(id: string, approverId: string, decision: "approved" | "rejected"): Mandate | undefined { const m = this.mandates.find((x) => x.id === id); if (m) { m.state = decision; m.approverId = approverId; } return m; }
  createSession(userId: string): { token: string; expiresAt: string } { const token = randomToken(); return { token, expiresAt: new Date(Date.now() + 60 * 60_000).toISOString() }; }
  reset(): void { this.initialized = false; this.users = []; this.ledger = []; this.mandates = []; this.init(); }
}
function actionCategory(action: string): string { if (/login_failed|auth_failed/.test(action)) return "Failed auth"; if (/login/.test(action)) return "Auth"; if (/grant_agent|request_agent_action/.test(action)) return "Agent"; if (/grant_role|elevate|revoke|rotate|delete/.test(action)) return "Privilege"; if (/approve|reject|request_mandate|approve_blocked/.test(action)) return "Dual-control"; if (/scan/.test(action)) return "Scan"; if (/verify_integrity/.test(action)) return "Verify"; if (/export/.test(action)) return "Export"; if (/view_log/.test(action)) return "View"; return "Other"; }
const globalAny = globalThis as unknown as { __chokepointStore?: Store };
export const store: Store = globalAny.__chokepointStore ?? new Store();
globalAny.__chokepointStore = store;
export { LEDGER_SECRET };
