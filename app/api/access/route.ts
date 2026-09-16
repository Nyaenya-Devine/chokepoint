import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireRole } from "@/lib/apiauth";
import { can, isAction, requiresDualControl, DUAL_CONTROL_ACTIONS } from "@/lib/authz";

export async function GET() {
  const auth = await requireRole("view_dashboard");
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ users: store.publicUsers(), mandates: store.mandates, dualControlActions: [...DUAL_CONTROL_ACTIONS] }, { headers: { "Cache-Control": "no-store" } });
}

/** Record an access-control event only when it is a real action the caller is authorized to perform. */
export async function POST(req: Request) {
  const auth = await requireRole("run_scan");
  if (auth instanceof NextResponse) return auth;
  const body = await req.json().catch(() => null);
  if (!body || !isAction(body.action) || typeof body.target !== "string" || !body.target.trim()) {
    return NextResponse.json({ error: "A valid action and target are required." }, { status: 400 });
  }
  if (!can(auth.role, body.action)) {
    return NextResponse.json({ error: `Insufficient privileges for '${body.action}'.` }, { status: 403 });
  }
  const meta = body.meta && typeof body.meta === "object" && !Array.isArray(body.meta) ? body.meta : {};
  const entry = store.append({
    actor: auth.user.username,
    actorRole: auth.role,
    action: body.action,
    target: body.target.trim().slice(0, 200),
    meta: { ...meta, dualControl: requiresDualControl(body.action) },
  });
  return NextResponse.json({ entry }, { headers: { "Cache-Control": "no-store" } });
}
