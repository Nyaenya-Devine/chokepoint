import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireRole } from "@/lib/apiauth";
import { can, isAction, type Action } from "@/lib/authz";

const DIRECT_ACCESS_ACTIONS = new Set<Action>([
  "run_scan",
  "request_agent_action",
]);

export async function GET() {
  const auth = await requireRole("view_dashboard");
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json(
    { users: store.publicUsers(), mandates: store.mandates },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Record an operational access event. Privileged/dual-control actions must
 * flow through /api/mandates so the ledger cannot be used to forge a
 * successful grant/elevation/revocation/secret-rotation event.
 */
export async function POST(req: Request) {
  const auth = await requireRole("run_scan");
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  if (
    !body ||
    !isAction(body.action) ||
    !DIRECT_ACCESS_ACTIONS.has(body.action) ||
    typeof body.target !== "string" ||
    !body.target.trim()
  ) {
    return NextResponse.json({ error: "Only valid direct operational actions are accepted." }, { status: 400 });
  }

  if (!can(auth.role, body.action)) {
    return NextResponse.json({ error: `Insufficient privileges for '${body.action}'.` }, { status: 403 });
  }

  const meta = body.meta && typeof body.meta === "object" && !Array.isArray(body.meta)
    ? body.meta
    : {};

  const entry = store.append({
    actor: auth.user.username,
    actorRole: auth.role,
    action: body.action,
    target: body.target.trim().slice(0, 200),
    meta: { ...meta, dualControl: false },
  });

  return NextResponse.json({ entry }, { headers: { "Cache-Control": "no-store" } });
}
