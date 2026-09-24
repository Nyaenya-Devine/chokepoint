import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireRole } from "@/lib/apiauth";
import { can, isAction, requiresDualControl, type Action } from "@/lib/authz";
import { isBlastRadius, isMandateEnvironment, normalizeTtlMinutes } from "@/lib/mandatePolicy";

export async function GET() {
  const auth = await requireRole("view_log");
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ mandates: store.mandates }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const auth = await requireRole("run_scan");
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  if (!body || !isAction(body.action) || typeof body.target !== "string" || !body.target.trim()) {
    return NextResponse.json({ error: "A valid action and target are required." }, { status: 400 });
  }
  const action: Action = body.action;

  if (!requiresDualControl(action)) {
    if (!can(auth.role, action)) {
      return NextResponse.json({ error: `'${action}' is not permitted for '${auth.role}'.` }, { status: 403 });
    }
    store.append({ actor: auth.user.username, actorRole: auth.role, action, target: body.target.trim().slice(0, 200), meta: { dualControl: false } });
    return NextResponse.json({ status: "executed", action }, { status: 200 });
  }

  if (!["operator", "admin"].includes(auth.role)) {
    return NextResponse.json({ error: "Only operators or admins may request privileged mandates." }, { status: 403 });
  }
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : "";
  const purpose = typeof body.purpose === "string" ? body.purpose.trim().slice(0, 500) : reason;
  if (!purpose) {
    return NextResponse.json({ error: "A business or incident purpose is required." }, { status: 400 });
  }
  const environment = isMandateEnvironment(body.environment) ? body.environment : "production";
  const blastRadius = isBlastRadius(body.blastRadius) ? body.blastRadius : "single-resource";
  const mandate = store.createMandate({
    action,
    target: body.target.trim().slice(0, 200),
    requestedBy: auth.user.id,
    reason,
    purpose,
    environment,
    blastRadius,
    ttlMinutes: normalizeTtlMinutes(body.ttlMinutes),
  });
  store.append({
    actor: auth.user.username,
    actorRole: auth.role,
    action: "request_mandate",
    target: mandate.target,
    meta: {
      mandated: true,
      mandateId: mandate.id,
      environment: mandate.environment,
      blastRadius: mandate.blastRadius,
      contextFingerprint: mandate.contextFingerprint,
    },
  });
  return NextResponse.json({ mandate, status: "pending" }, { status: 201 });
}
