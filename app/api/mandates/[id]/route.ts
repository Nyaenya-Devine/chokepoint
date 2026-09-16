import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { enforceDualControl, isAction, type Action, type Role } from "@/lib/authz";
import { requireRole } from "@/lib/apiauth";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("approve");
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body || (body.decision !== "approved" && body.decision !== "rejected")) {
    return NextResponse.json({ error: "decision must be 'approved' or 'rejected'." }, { status: 400 });
  }
  const decision: "approved" | "rejected" = body.decision;
  const mandate = store.mandates.find((m) => m.id === id);
  if (!mandate) return NextResponse.json({ error: "Mandate not found." }, { status: 404 });
  if (mandate.state !== "pending") return NextResponse.json({ error: `Mandate is already ${mandate.state}.` }, { status: 409 });
  if (Date.now() >= new Date(mandate.expiresAt).getTime()) return NextResponse.json({ error: "Mandate has expired." }, { status: 409 });
  if (!isAction(mandate.action)) return NextResponse.json({ error: "Mandate contains an invalid action." }, { status: 409 });

  const requester = store.getUserById(mandate.requestedBy);
  const d = enforceDualControl({
    action: mandate.action as Action,
    requesterRole: (requester?.role ?? "viewer") as Role,
    approverRole: auth.role,
    requesterId: mandate.requestedBy,
    approverId: auth.user.id,
  });
  if (!d.allowed) {
    store.append({ actor: auth.user.username, actorRole: auth.role, action: "approve_blocked", target: mandate.target, meta: { reason: d.reason, mandateId: mandate.id } });
    return NextResponse.json({ error: d.reason }, { status: 403 });
  }

  store.decideMandate(mandate.id, auth.user.id, decision);
  store.append({ actor: auth.user.username, actorRole: auth.role, action: decision === "approved" ? "approve" : "reject", target: mandate.action, meta: { mandateId: mandate.id, dualControl: true } });
  return NextResponse.json({ mandate, decision }, { headers: { "Cache-Control": "no-store" } });
}
