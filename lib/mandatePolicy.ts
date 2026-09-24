import type { Action, Role } from "./authz";
import { can, enforceDualControl, requiresDualControl } from "./authz";
import { sha256Hex } from "./crypto";

export type MandateEnvironment = "development" | "staging" | "production";
export type BlastRadius = "single-resource" | "service" | "tenant";
export type PolicyOutcome = "ALLOW" | "DENY" | "ESCALATE";

export interface MandateContext {
  action: Action;
  target: string;
  purpose: string;
  environment: MandateEnvironment;
  blastRadius: BlastRadius;
  requestedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface MandateEvaluation {
  outcome: PolicyOutcome;
  reason: string;
  controls: string[];
}

const MAX_TTL_MINUTES = 30;

export function normalizeTtlMinutes(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 15;
  return Math.min(MAX_TTL_MINUTES, Math.max(1, Math.floor(value)));
}

export function isMandateEnvironment(value: unknown): value is MandateEnvironment {
  return value === "development" || value === "staging" || value === "production";
}

export function isBlastRadius(value: unknown): value is BlastRadius {
  return value === "single-resource" || value === "service" || value === "tenant";
}

/** Stable serialization prevents a mandate's authorization envelope being changed after review. */
export function mandateFingerprint(context: MandateContext): string {
  return sha256Hex(JSON.stringify({
    action: context.action,
    target: context.target,
    purpose: context.purpose,
    environment: context.environment,
    blastRadius: context.blastRadius,
    requestedBy: context.requestedBy,
    createdAt: context.createdAt,
    expiresAt: context.expiresAt,
  }));
}

export function evaluateMandate(params: {
  context: MandateContext;
  fingerprint: string;
  requesterRole: Role;
  approverRole?: Role;
  approverId?: string;
  now?: number;
}): MandateEvaluation {
  const { context, fingerprint, requesterRole, approverRole, approverId } = params;
  const now = params.now ?? Date.now();
  const controls: string[] = ["default-deny", "context-bound", "time-bound"];

  if (mandateFingerprint(context) !== fingerprint) {
    return { outcome: "DENY", reason: "Mandate context fingerprint mismatch.", controls: [...controls, "tamper-detected"] };
  }
  if (!context.purpose.trim()) {
    return { outcome: "DENY", reason: "A business or incident purpose is required.", controls };
  }
  if (now >= Date.parse(context.expiresAt)) {
    return { outcome: "DENY", reason: "Mandate has expired.", controls: [...controls, "expired"] };
  }
  if (!requiresDualControl(context.action)) {
    return can(requesterRole, context.action)
      ? { outcome: "ALLOW", reason: "Requester is authorized for this non-mandated operation.", controls: [...controls, "rbac"] }
      : { outcome: "DENY", reason: "Requester is not authorized for this operation.", controls: [...controls, "rbac"] };
  }
  if (!approverRole || !approverId) {
    return {
      outcome: "ESCALATE",
      reason: "A distinct authorized approver must review the sealed mandate.",
      controls: [...controls, "dual-control", "separation-of-duties"],
    };
  }

  const dual = enforceDualControl({
    action: context.action,
    requesterRole,
    approverRole,
    requesterId: context.requestedBy,
    approverId,
  });
  if (!dual.allowed) {
    return { outcome: "DENY", reason: dual.reason, controls: [...controls, "dual-control", "separation-of-duties"] };
  }

  if (context.environment === "production" && context.blastRadius === "tenant") {
    return {
      outcome: "ESCALATE",
      reason: "Tenant-wide production operations require an additional out-of-band control.",
      controls: [...controls, "dual-control", "out-of-band-verification", "kill-switch"],
    };
  }

  return {
    outcome: "ALLOW",
    reason: "RBAC, context integrity, expiry, and distinct-approver controls are satisfied.",
    controls: [...controls, "rbac", "dual-control", "separation-of-duties"],
  };
}
