import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireRole } from "@/lib/apiauth";
import { simulatePolicy, defaultPolicyTests, type PolicyTest } from "@/lib/policySimulator";
import type { Role } from "@/lib/authz";

const ROLES = new Set<Role>(["viewer", "auditor", "operator", "admin"]);
const EXPECTED = new Set(["allow", "deny"] as const);
const SHORTCUTS = new Set(["privilege_escalation", "dual_approval_bypass", "agent_abuse", "all"]);
const MAX_TESTS = 100;
const MAX_FIELD = 200;

function parseTests(value: unknown): PolicyTest[] {
  if (value === undefined) return defaultPolicyTests;
  if (!Array.isArray(value) || value.length > MAX_TESTS) throw new Error("tests must be an array of at most 100 items");

  if (value.length && value.every((v) => typeof v === "string")) {
    const map: Record<string, typeof defaultPolicyTests> = {
      privilege_escalation: defaultPolicyTests.filter((t) => /grant_role/.test(t.action)),
      dual_approval_bypass: defaultPolicyTests.filter((t) => t.action === "approve"),
      agent_abuse: defaultPolicyTests.filter((t) => t.actor.startsWith("agent")),
      all: defaultPolicyTests,
    };
    const expanded = (value as string[]).filter((s) => SHORTCUTS.has(s)).flatMap((s) => map[s]);
    return expanded.length ? expanded : defaultPolicyTests;
  }

  return value.map((raw): PolicyTest => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Each test must be an object");
    const t = raw as Record<string, unknown>;
    if (
      typeof t.actor !== "string" || t.actor.length > MAX_FIELD ||
      typeof t.actorRole !== "string" || !ROLES.has(t.actorRole as Role) ||
      typeof t.action !== "string" || t.action.length > MAX_FIELD ||
      typeof t.target !== "string" || t.target.length > MAX_FIELD ||
      typeof t.expected !== "string" || !EXPECTED.has(t.expected as "allow" | "deny") ||
      (t.reason !== undefined && (typeof t.reason !== "string" || t.reason.length > MAX_FIELD))
    ) {
      throw new Error("Invalid policy test");
    }
    return {
      actor: t.actor,
      actorRole: t.actorRole as Role,
      action: t.action,
      target: t.target,
      expected: t.expected as "allow" | "deny",
      reason: t.reason as string | undefined,
    };
  });
}

export async function GET() {
  const auth = await requireRole("view_dashboard");
  if (auth instanceof NextResponse) return auth;

  const report = simulatePolicy(store.ledger, defaultPolicyTests);
  return NextResponse.json(
    { ...report, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  const auth = await requireRole("approve");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const tests = parseTests(body?.tests);
    const report = simulatePolicy(store.ledger, tests);
    return NextResponse.json(
      { ...report, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Invalid policy simulation request." }, { status: 400 });
  }
}
