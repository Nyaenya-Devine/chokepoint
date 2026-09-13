/**
 * Tenants — Per-tenant policies like OrbitDesk clients
 * Each tenant has different approval policies, compliance, expectations
 */

export interface Tenant {
  id: string;
  name: string;
  type: 'enterprise' | 'smb' | 'regulated';
  description: string;
  approvalPolicies: {
    name: string;
    description: string;
    requires: string[];
    mode: 'ON' | 'Report-Only' | 'OFF';
    risk: 'High' | 'Medium' | 'Low';
    lastModified: string;
    modifiedBy?: string;
    nonCompliant: number;
  }[];
  compliance: {
    name: string;
    required: boolean;
    status: 'Compliant' | 'Not Compliant' | 'Partial';
    details: string;
  }[];
  expectations: {
    comms: string;
    approval: string;
    audit: string;
    language: string;
  };
  sla: string;
  color: string;
}

export const tenants: Tenant[] = [
  {
    id: 'novatech',
    name: 'NovaTech Enterprises',
    type: 'enterprise',
    description: 'Enterprise Tech 24/7 — Strict approval policies, high security, fast incident response',
    approvalPolicies: [
      {
        name: 'Require dual-control for privilege escalation',
        description: 'All privilege escalations (operator → admin) require distinct approver + audit log',
        requires: ['RBAC Check', 'Audit Logs', 'What If Tool', 'Break Glass Check'],
        mode: 'ON',
        risk: 'High',
        lastModified: '2026-09-13 08:02 by john.admin (without Report-Only → caused P1!)',
        nonCompliant: 2,
      },
      {
        name: 'Require human oversight for agent actions >$10k',
        description: 'AI agents need human approval for high-value financial actions per OWASP ASI03',
        requires: ['Agent Trust Score', 'DLP Check', 'Audit Logs', 'What If Simulation'],
        mode: 'ON',
        risk: 'High',
        lastModified: '2026-09-12 14:30 by nia.owiti',
        nonCompliant: 1,
      },
      {
        name: 'Block legacy auth + require MFA',
        description: 'Block legacy authentication, require MFA for all users',
        requires: ['Sign-in Logs', 'MFA Status', 'Conditional Access'],
        mode: 'ON',
        risk: 'High',
        lastModified: '2026-09-10 09:15 by priya.nair',
        nonCompliant: 0,
      },
    ],
    compliance: [
      { name: 'BitLocker Key Escrow', required: true, status: 'Partial', details: '12 devices not escrowed, 2 non-compliant' },
      { name: 'Defender Tamper Protection', required: true, status: 'Compliant', details: 'All devices compliant' },
      { name: 'Break Glass Excluded from CA', required: true, status: 'Compliant', details: 'Break Glass account excluded from all CA policies' },
      { name: 'Audit Log Retention 1 Year', required: true, status: 'Compliant', details: 'Logs retained, HMAC-signed, hash-chained' },
    ],
    expectations: {
      comms: 'Technical, concise, Correlation IDs, formal: "Error 53000 DeviceNotCompliant, Correlation ID: a1b2c3..., checked Service Health green"',
      approval: 'Share Correlation ID, CA tab, technical RCA, update every 30min for P1, audit trail with who what when',
      audit: 'Provide audit trail with who changed policy, when, RCA, remediation steps, confirmation',
      language: 'Technical formal — knows Entra ID, Intune, logs, What If, dsregcmd',
    },
    sla: 'P1 60min, P2 4h, 24/7',
    color: 'violet',
  },
  {
    id: 'bloom',
    name: 'Bloom & Co Studio',
    type: 'smb',
    description: 'SMB 9-5 — Relaxed policies, simple language, friendly, visual learner',
    approvalPolicies: [
      {
        name: 'Require dual-control for high-impact only',
        description: 'Only critical actions (fleet wipe, privilege escalation) need dual-control, others auto-approved',
        requires: ['Basic RBAC'],
        mode: 'Report-Only',
        risk: 'Low',
        lastModified: '2026-09-11 10:20 by lisa.chen',
        nonCompliant: 0,
      },
      {
        name: 'Allow external sharing with approval',
        description: 'External sharing allowed with time-bound approval for client presentations',
        requires: ['DLP Check', 'Client Approval'],
        mode: 'Report-Only',
        risk: 'Low',
        lastModified: '2026-09-09 15:00 by jessica',
        nonCompliant: 1,
      },
    ],
    compliance: [
      { name: 'MFA Required', required: true, status: 'Compliant', details: 'All users MFA enabled' },
      { name: 'BitLocker Optional', required: false, status: 'Compliant', details: 'Optional for SMB, 1 device not compliant but okay' },
      { name: 'Break Glass', required: false, status: 'Compliant', details: 'Break Glass exists but not required for SMB' },
    ],
    expectations: {
      comms: 'Casual, friendly, emojis, simple: "Heyy! 😅 My shared mailbox not showing? Simple steps?"',
      approval: 'Simple language, no jargon, emojis, step-by-step, visual guide: "Blue icon with shopping bag = Company Portal"',
      audit: 'Simple confirmation, no need for formal RCA, just "It works now! Thank you!"',
      language: 'Non-technical — needs "Click Start → Settings → ..." not "Run dsregcmd", visual learner, friendly',
    },
    sla: 'P2 8h, P3 24h, 9-5',
    color: 'pink',
  },
  {
    id: 'apex',
    name: 'Apex Financial Group',
    type: 'regulated',
    description: 'Regulated — SEC-2024-07 Strict, DLP, Defender Tamper, audit trail, compliance proof',
    approvalPolicies: [
      {
        name: 'SEC-2024-07 Strict — Require dual-control for ALL high-impact',
        description: 'Per SEC-2024-07, ALL high-impact operations (privilege escalation, agent actions >$1k, fleet wipe, DLP disable, secret rotation) require dual-control + audit trail + compliance proof',
        requires: ['RBAC Check', 'Audit Logs', 'Compliance Center', 'DLP Policy', 'What If', 'Break Glass Check', 'Key Escrow Verification'],
        mode: 'ON',
        risk: 'High',
        lastModified: '2026-09-12 16:45 by david.okafor (SEC-2024-07 audit)',
        nonCompliant: 3,
      },
      {
        name: 'Require key escrow verification before fleet wipe',
        description: 'Before wiping devices containing financial data, verify BitLocker keys escrowed to Entra ID and Intune for audit',
        requires: ['BitLocker Keys', 'Intune Devices', 'Entra Devices', 'Audit Logs'],
        mode: 'ON',
        risk: 'High',
        lastModified: '2026-09-11 11:30 by compliance team',
        nonCompliant: 2,
      },
      {
        name: 'DLP blocking external sharing — strict',
        description: 'DLP blocks external sharing of financial data, requires time-bound exception with approval + audit',
        requires: ['DLP Policy Review', 'Compliance Center', 'Client Policy Check', 'What If'],
        mode: 'ON',
        risk: 'High',
        lastModified: '2026-09-10 14:00 by david.okafor',
        nonCompliant: 1,
      },
    ],
    compliance: [
      { name: 'SEC-2024-07 — BitLocker + Key Escrowed', required: true, status: 'Partial', details: '8 devices not compliant, 3 non-compliant policies' },
      { name: 'Defender Tamper Protection', required: true, status: 'Compliant', details: 'All devices compliant, tamper protection ON' },
      { name: 'DLP Blocking External Sharing', required: true, status: 'Compliant', details: 'DLP ON, blocking external sharing of financial data' },
      { name: 'Break Glass Excluded from CA + Monitored', required: true, status: 'Compliant', details: 'Break Glass excluded from all CA, monitored, alert on use, password in vault' },
      { name: 'Audit Log Retention 7 Years', required: true, status: 'Compliant', details: 'Logs retained 7 years, HMAC-signed, hash-chained, Merkle proofs' },
    ],
    expectations: {
      comms: 'Formal, compliance-focused, policy refs: "Per policy SEC-2024-07, require BitLocker compliance, need audit trail + RCA"',
      approval: 'Formal, audit trail, policy reference, compliance proof, RCA with timeline, who what when, confirmation',
      audit: 'Provide audit trail: who changed policy, when, RCA, remediation steps, confirmation of key escrow per SEC-2024-07 for compliance review',
      language: 'Formal compliance — knows SEC-2024-07, audit trail, policy reference, risk-aware, needs documentation',
    },
    sla: 'P1 30min, P2 2h, 24/7 + compliance',
    color: 'emerald',
  },
];

export const getTenant = (id: string) => tenants.find(t => t.id === id);
