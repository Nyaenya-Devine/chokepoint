/** Production-safe in-memory demo store. */
import "server-only";
import { hashPassword, randomToken, randomUUIDv4 } from "./crypto";
import { appendEntry, verifyChain, type LedgerEntry } from "./ledger";
import { assessLedger } from "./anomaly";
import type { Mandate, PublicUser, User } from "./types";
import type { Role } from "./authz";

function requiredLedgerSecret(): string {
  const secret = process.env.CHOKEPOINT_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("CHOKEPOINT_SECRET must be set to a random value of at least 32 characters in production");
  return "local-development-only-ledger-secret-change-me";
}
const LEDGER_SECRET = requiredLedgerSecret();
function hoursAgo(h: number): string { return new Date(Date.now() - h * 3_600_000).toISOString(); }

function seedUsers(): User[] {
  if (process.env.NODE_ENV === "production") return [];
  return [
    { id: "u-admin", username: "admin", displayName: "Nia Owiti", role: "admin", passwordHash: hashPassword("admin1234"), active: true, createdAt: hoursAgo(1440), lastLoginAt: hoursAgo(1) },
    { id: "u-op", username: "operator", displayName: "Dmitri Kovac", role: "operator", passwordHash: hashPassword("operator1234"), active: true, createdAt: hoursAgo(960), lastLoginAt: hoursAgo(3) },
    { id: "u-auditor", username: "auditor", displayName: "Tendai Moyo", role: "auditor", passwordHash: hashPassword("auditor1234"), active: true, createdAt: hoursAgo(720), lastLoginAt: hoursAgo(20) },
    { id: "u-viewer", username: "viewer", displayName: "Samir Patel", role: "viewer", passwordHash: hashPassword("viewer1234"), active: true, createdAt: hoursAgo(240), lastLoginAt: hoursAgo(5) },
  ];
}
interface SeedEvent { ts: string; actor: string; actorRole: Role; action: string; target: string; meta: Record<string, unknown>; }
function seedEvents(): SeedEvent[] { const now = Date.now(); const at = (m: number) => new Date(now - m * 60_000).toISOString(); return [
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
]; }

class Store {
  users: User[] = []; ledger: LedgerEntry[] = []; mandates: Mandate[] = []; private initialized = false;
  constructor() { this.init(); }
  private init(): void { if (this.initialized) return; this.initialized = true; this.users = seedUsers(); const pending = this.seedMandates(); let prev: LedgerEntry | null = null; for (const e of seedEvents()) { const entry = appendEntry(prev, { ...e, id: randomUUIDv4() }, LEDGER_SECRET); this.ledger.push(entry); prev = entry; } this.mandates = pending; }
  private seedMandates(): Mandate[] { if (process.env.NODE_ENV === "production") return []; return [{ id: randomUUIDv4(), action: "grant_role", target: "operator", requestedBy: "u-op", approverId: null, state: "pending", createdAt: hoursAgo(.2), expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(), reason: "Escalate operator to admin for incident response window." }]; }
  getUserByUsername(username: string) { return this.users.find(u => u.username === username); }
  getUserById(id: string) { return this.users.find(u => u.id === id); }
  toPublic(u: User): PublicUser { const { passwordHash: _drop, ...pub } = u; return pub; }
  publicUsers() { return this.users.map(u => this.toPublic(u)); }
  append(event: { actor: string; actorRole: Role; action: string; target: string; meta: Record<string, unknown> }): LedgerEntry { const prev = this.ledger.at(-1) ?? null; const entry = appendEntry(prev, { id: randomUUIDv4(), ts: new Date().toISOString(), ...event }, LEDGER_SECRET); this.ledger.push(entry); return entry; }
  verify() { return verifyChain(this.ledger, LEDGER_SECRET); }
  recent(n: number) { return [...this.ledger].slice(-n).reverse(); }
  risks() { return assessLedger(this.ledger).reverse(); }
  riskSummary() { const risks = this.risks(); const counts: Record<string, number> = {}; for (const r of risks) counts[r.severity] = (counts[r.severity] ?? 0) + 1; return { total: risks.length, critical: counts.CRITICAL ?? 0, high: counts.HIGH ?? 0, medium: counts.MEDIUM ?? 0, low: counts.LOW ?? 0, riskIndex: Math.round((risks.reduce((s,r)=>s+r.score,0)/Math.max(1,risks.length))*100) }; }
  dashboard() { const ordered=[...this.ledger].sort((a,b)=>a.index-b.index); const risks=assessLedger(this.ledger); const trend=risks.map(r=>({index:r.entryIndex,score:r.score,severity:r.severity})); const actions:Record<string,number>={}; for(const e of ordered){const k=actionCategory(e.action);actions[k]=(actions[k]??0)+1;} const actionBreakdown=Object.entries(actions).map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count); const topAlerts=this.risks().filter(r=>["CRITICAL","HIGH","MEDIUM"].includes(r.severity)).slice(0,6); return {trend,actionBreakdown,activity:[],topAlerts,totals:{events:ordered.length,logins:actionBreakdown.find(a=>a.label==="Auth")?.count??0,privileged:actionBreakdown.filter(a=>["Privilege","Dual-control"].includes(a.label)).reduce((s,a)=>s+a.count,0)}}; }
  createMandate(p:{action:string;target:string;requestedBy:string;reason:string}):Mandate { const m:Mandate={id:randomUUIDv4(),action:p.action,target:p.target,requestedBy:p.requestedBy,approverId:null,state:"pending",createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+15*60_000).toISOString(),reason:p.reason};this.mandates.unshift(m);return m; }
  decideMandate(id:string,approverId:string,decision:"approved"|"rejected") { const m=this.mandates.find(x=>x.id===id);if(m){m.state=decision;m.approverId=approverId;}return m; }
  createSession(userId:string){return {token:randomToken(),expiresAt:new Date(Date.now()+60*60_000).toISOString()};}
  reset(){this.initialized=false;this.users=[];this.ledger=[];this.mandates=[];this.init();}
}
function actionCategory(a:string){if(/login_failed|auth_failed/.test(a))return"Failed auth";if(/login/.test(a))return"Auth";if(/grant_agent|request_agent_action/.test(a))return"Agent";if(/grant_role|elevate|revoke|rotate|delete/.test(a))return"Privilege";if(/approve|reject|request_mandate|approve_blocked/.test(a))return"Dual-control";if(/scan/.test(a))return"Scan";if(/verify_integrity/.test(a))return"Verify";if(/export/.test(a))return"Export";if(/view_log/.test(a))return"View";return"Other";}
const globalAny=globalThis as unknown as {__chokepointStore?:Store};export const store:Store=globalAny.__chokepointStore??new Store();globalAny.__chokepointStore=store;export {LEDGER_SECRET};
