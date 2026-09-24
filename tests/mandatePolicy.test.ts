import { describe, expect, it } from "vitest";
import { evaluateMandate, mandateFingerprint, normalizeTtlMinutes, type MandateContext } from "../lib/mandatePolicy";

function context(overrides: Partial<MandateContext> = {}): MandateContext {
  return {
    action: "rotate_secret",
    target: "agent-billing",
    purpose: "Rotate a suspected exposed workload credential.",
    environment: "production",
    blastRadius: "service",
    requestedBy: "u-op",
    createdAt: "2026-09-25T10:00:00.000Z",
    expiresAt: "2026-09-25T10:15:00.000Z",
    ...overrides,
  };
}

function evaluate(c: MandateContext, overrides: Record<string, unknown> = {}) {
  return evaluateMandate({
    context: c,
    fingerprint: mandateFingerprint(c),
    requesterRole: "operator",
    approverRole: "admin",
    approverId: "u-admin",
    now: Date.parse("2026-09-25T10:05:00.000Z"),
    ...overrides,
  });
}

describe("sealed mandate policy", () => {
  it("allows a bounded operation after a distinct authorized approval", () => {
    const result = evaluate(context());
    expect(result.outcome).toBe("ALLOW");
    expect(result.controls).toContain("separation-of-duties");
  });

  it("denies a mandate whose reviewed context was changed", () => {
    const original = context();
    const changed = { ...original, target: "agent-payments" };
    const result = evaluateMandate({
      context: changed,
      fingerprint: mandateFingerprint(original),
      requesterRole: "operator",
      approverRole: "admin",
      approverId: "u-admin",
      now: Date.parse("2026-09-25T10:05:00.000Z"),
    });
    expect(result.outcome).toBe("DENY");
    expect(result.controls).toContain("tamper-detected");
  });

  it("denies self-approval", () => {
    expect(evaluate(context(), { approverId: "u-op" }).outcome).toBe("DENY");
  });

  it("denies expired authority", () => {
    expect(evaluate(context(), { now: Date.parse("2026-09-25T10:16:00.000Z") }).outcome).toBe("DENY");
  });

  it("escalates tenant-wide production operations to an out-of-band control", () => {
    const result = evaluate(context({ blastRadius: "tenant" }));
    expect(result.outcome).toBe("ESCALATE");
    expect(result.controls).toContain("out-of-band-verification");
    expect(result.controls).toContain("kill-switch");
  });

  it("requires a purpose", () => {
    expect(evaluate(context({ purpose: "" })).outcome).toBe("DENY");
  });

  it("bounds authority lifetime input", () => {
    expect(normalizeTtlMinutes(-5)).toBe(1);
    expect(normalizeTtlMinutes(500)).toBe(30);
    expect(normalizeTtlMinutes("15")).toBe(15);
  });
});
