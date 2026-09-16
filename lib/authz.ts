/**
 * chokepoint — authorization policy engine.
 */

export type Role = "viewer" | "auditor" | "operator" | "admin";

export type Action =
  | "view_dashboard" | "view_log" | "verify_integrity" | "export_log"
  | "run_scan" | "request_agent_action" | "grant_role" | "elevate_privilege"
  | "revoke_access" | "rotate_secret" | "delete_record" | "approve";

const ACTIONS: ReadonlySet<Action> = new Set<Action>([
  "view_dashboard", "view_log", "verify_integrity", "export_log", "run_scan",
  "request_agent_action", "grant_role", "elevate_privilege", "revoke_access",
  "rotate_secret", "delete_record", "approve",
]);

/** Runtime validation for untrusted HTTP input before it is treated as Action. */
export function isAction(value: unknown): value is Action {
  return typeof value === "string" && ACTIONS.has(value as Action);
}

export const DUAL_CONTROL_ACTIONS: ReadonlySet<Action> = new Set<Action>([
  "grant_role", "elevate_privilege", "revoke_access", "rotate_secret", "delete_record",
]);

const ADMIN_ONLY: ReadonlySet<Action> = new Set<Action>([
  "grant_role", "elevate_privilege", "revoke_access", "rotate_secret", "delete_record", "approve",
]);
const OPERATOR: ReadonlySet<Action> = new Set<Action>(["run_scan", "request_agent_action"]);
const AUDITOR: ReadonlySet<Action> = new Set<Action>(["verify_integrity", "export_log"]);
const VIEWER: ReadonlySet<Action> = new Set<Action>(["view_dashboard", "view_log"]);

const ROLE_ACTIONS: Record<Role, ReadonlySet<Action>> = {
  viewer: VIEWER,
  auditor: new Set<Action>([...VIEWER, ...AUDITOR]),
  operator: new Set<Action>([...VIEWER, ...AUDITOR, ...OPERATOR]),
  admin: new Set<Action>([...VIEWER, ...AUDITOR, ...OPERATOR, ...ADMIN_ONLY]),
};

export function can(role: Role, action: Action): boolean { return ROLE_ACTIONS[role].has(action); }
export function requiresDualControl(action: Action): boolean { return DUAL_CONTROL_ACTIONS.has(action); }

export function minRoleFor(action: Action): Role | null {
  for (const role of ["viewer", "auditor", "operator", "admin"] as Role[]) {
    if (ROLE_ACTIONS[role].has(action)) return role;
  }
  return null;
}

export interface DualControlDecision { allowed: boolean; reason: string; needsRemoval?: boolean; }

export function enforceDualControl(params: {
  action: Action; requesterRole: Role; approverRole: Role; requesterId: string; approverId: string;
}): DualControlDecision {
  const { action, requesterRole, approverRole, requesterId, approverId } = params;
  if (!requiresDualControl(action)) return { allowed: true, reason: `'${action}' does not require dual control.` };
  if (requesterId === approverId) return { allowed: false, reason: "Dual control requires a distinct approver.", needsRemoval: true };
  if (!can(approverRole, action)) return { allowed: false, reason: `${approverRole} cannot approve '${action}'.` };
  if (!["operator", "admin"].includes(requesterRole)) return { allowed: false, reason: `${requesterRole} is not authorized to propose '${action}'.` };
  return { allowed: true, reason: "Dual-control satisfied." };
}
