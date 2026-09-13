/**
 * High-Impact Operation Request Templates — Like OrbitDesk tickets but for security
 * Real-time endless requests for sensitive operations that need 4-eyes approval
 */

export type RequestPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type RequestCategory = 'privilege' | 'agent' | 'secrets' | 'fleet' | 'compliance' | 'network';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'executed';

export interface RequestTemplate {
  code: string;
  title: string;
  category: RequestCategory;
  priority: RequestPriority;
  description: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  requiredApproverRole: 'admin' | 'approver';
  estimatedImpact: string;
  requiredTools: string[];
  correctApproach: string[];
  rootCause: string;
  clientMessage: string;
  userEmail: string;
}

export const requestTemplates: RequestTemplate[] = [
  {
    code: 'PRIV-001',
    title: 'Escalate operator to admin for incident response',
    category: 'privilege',
    priority: 'P1',
    description: 'Operator requests admin role for 2-hour incident response window — payroll system blocked',
    risk: 'Critical',
    requiredApproverRole: 'admin',
    estimatedImpact: 'Full tenant admin — can change CA policies, wipe devices, access all data',
    requiredTools: ['Entra Audit Logs', 'Sign-in Logs', 'What If Tool', 'Break Glass Check'],
    correctApproach: ['Check Entra Audit Logs who requested and why', 'Verify incident P1 exists and Service Health green', 'Use What If to test if escalation needed', 'Check Break Glass excluded from CA', 'Approve with 15min expiry + audit log'],
    rootCause: 'Operator needs admin for P1 payroll blocked by CA 53000 DeviceNotCompliant — but needs verification first',
    clientMessage: 'Hi, this is Dmitri from Operations at NovaTech. We have P1 payroll blocked, need admin for 2 hours to fix CA policy. Correlation ID a7f3c9e2. Can you approve quickly? Payroll in 45 mins!',
    userEmail: 'dmitri.kovac@novatech.com',
  },
  {
    code: 'AGENT-002',
    title: 'Grant agent billing write access to production',
    category: 'agent',
    priority: 'P1',
    description: 'AI agent needs write access to billing system for automated refunds — high financial impact',
    risk: 'Critical',
    requiredApproverRole: 'admin',
    estimatedImpact: 'Agent can issue refunds up to $10k, access PII, financial data',
    requiredTools: ['Agent Risk Assessment', 'DLP Policy Check', 'Audit Log Review', 'What If Simulation'],
    correctApproach: ['Check agent trust score and past behavior', 'Verify DLP policy allows refunds', 'Review audit logs for previous agent actions', 'Simulate with What If tool', 'Approve with amount limit + human oversight'],
    rootCause: 'Agent billing needs write for automated refunds but needs human oversight per OWASP ASI03',
    clientMessage: 'Agent billing is requesting write access to production for automated refunds. Risk assessment shows medium trust, past 4 successful reads. Need approval for $10k limit. Can you approve?',
    userEmail: 'agent-billing@system.internal',
  },
  {
    code: 'SECRETS-003',
    title: 'Rotate production secrets for agent-refunds',
    category: 'secrets',
    priority: 'P2',
    description: 'Rotate secrets after suspected leakage — after-hours request',
    risk: 'High',
    requiredApproverRole: 'admin',
    estimatedImpact: 'All refund operations paused during rotation, 5min downtime',
    requiredTools: ['Secret Rotation Logs', 'Audit Trail', 'Break Glass Verification', 'Service Health'],
    correctApproach: ['Check who rotated last and when', 'Verify leakage evidence in logs', 'Check Service Health for refund service', 'Ensure Break Glass works if rotation fails', 'Approve with maintenance window + rollback plan'],
    rootCause: 'Suspected secret leakage in logs, after-hours rotation needed but needs verification',
    clientMessage: 'Hi, Nia from Security. We detected potential secret leakage for agent-refunds in SIEM, need to rotate production secrets now, after-hours. Can you approve? I have rollback plan.',
    userEmail: 'nia.owiti@security.internal',
  },
  {
    code: 'FLEET-004',
    title: 'Wipe fleet of 50 devices — lost shipment',
    category: 'fleet',
    priority: 'P1',
    description: 'Wipe 50 devices from lost shipment — compliance SEC-2024-07, high impact',
    risk: 'Critical',
    requiredApproverRole: 'admin',
    estimatedImpact: '50 devices wiped, data loss if not backed up, compliance violation if not wiped per SEC-2024-07',
    requiredTools: ['Device Compliance Check', 'Intune Devices', 'BitLocker Keys', 'Audit Logs', 'What If'],
    correctApproach: ['Verify devices are indeed lost via Intune + Entra', 'Check BitLocker keys escrowed before wipe', 'Verify compliance SEC-2024-07 requires wipe', 'Use What If to simulate impact', 'Approve with verification + audit trail'],
    rootCause: 'Lost shipment with 50 devices containing financial data per SEC-2024-07 — must wipe but verify first',
    clientMessage: 'Good morning, David from Risk & Compliance at Apex Financial. Per SEC-2024-07, we must wipe 50 devices from lost shipment containing financial data. Need audit trail, verification BitLocker keys escrowed, and approval for wipe. Can you guide?',
    userEmail: 'david.okafor@apexfinancial.com',
  },
  {
    code: 'COMPLIANCE-005',
    title: 'Disable DLP policy for external sharing — client request',
    category: 'compliance',
    priority: 'P2',
    description: 'Client requests disabling DLP blocking external sharing for project — compliance risk',
    risk: 'High',
    requiredApproverRole: 'admin',
    estimatedImpact: 'External sharing allowed, potential data leakage, compliance violation SEC-2024-07 if not approved properly',
    requiredTools: ['DLP Policy Review', 'Compliance Center', 'Audit Logs', 'What If', 'Client Policy Check'],
    correctApproach: ['Check DLP policy and why it blocks', 'Verify client request legitimate and approved', 'Check compliance SEC-2024-07 allows exception', 'Use What If to test impact', 'Approve with time-bound exception + audit'],
    rootCause: 'DLP blocking external sharing for Bloom & Co project, client needs exception but needs compliance check',
    clientMessage: 'Heyy! 😅 It\'s Jessica from Bloom & Co. DLP is blocking me from sharing project files with external client, need to disable for 2 hours for client presentation in 20 mins! Can you help in simple steps?',
    userEmail: 'jessica@bloomco.studio',
  },
  {
    code: 'NETWORK-006',
    title: 'Allow unknown IP 102.214.88.7 after failed logins',
    category: 'network',
    priority: 'P2',
    description: 'IP 102.214.88.7 had 3 failed logins, now requests allow — possible brute force',
    risk: 'High',
    requiredApproverRole: 'admin',
    estimatedImpact: 'IP allowed could be attacker, account takeover risk',
    requiredTools: ['Sign-in Logs', 'IP Reputation', 'Risk Assessment', 'Audit Logs'],
    correctApproach: ['Check Sign-in logs for IP 102.214.88.7 failed logins', 'Check IP reputation and geo', 'Verify if legitimate user or attacker', 'Check audit logs for similar IPs', 'Reject if brute force, approve if legitimate with MFA'],
    rootCause: 'IP 102.214.88.7 brute force attempt from Kenya, 3 failed logins, now allow request — possible attacker',
    clientMessage: 'Hi, this is operator from Nairobi. IP 102.214.88.7 had failed logins, now requesting allow. I checked IP reputation, seems legit user but need verification. Can you check Sign-in logs and approve?',
    userEmail: 'operator@security.internal',
  },
  {
    code: 'PRIV-007',
    title: 'Grant auditor admin role — audit emergency',
    category: 'privilege',
    priority: 'P3',
    description: 'Auditor requests admin for emergency audit — separation of duties violation if self-approval',
    risk: 'Medium',
    requiredApproverRole: 'admin',
    estimatedImpact: 'Auditor gets admin, can change policies, audit trail must show distinct approver',
    requiredTools: ['RBAC Check', 'Audit Logs', 'Separation of Duties Verification'],
    correctApproach: ['Check RBAC and why auditor needs admin', 'Verify emergency audit legitimate', 'Ensure distinct approver (not self-approval)', 'Check audit logs for previous escalations', 'Approve with distinct approver + expiry'],
    rootCause: 'Auditor needs admin for emergency audit but self-approval would violate separation of duties',
    clientMessage: 'Hi, Tendai from Audit. Need admin for emergency audit of P1 incident, need to check audit logs and policies. Can you approve? I cannot approve my own request per SoD.',
    userEmail: 'tendai.moyo@audit.internal',
  },
  {
    code: 'AGENT-008',
    title: 'Agent refunds needs approval for $15k refund — high value',
    category: 'agent',
    priority: 'P1',
    description: 'AI agent requests approval for high-value $15k refund — needs human oversight',
    risk: 'Critical',
    requiredApproverRole: 'admin',
    estimatedImpact: '$15k financial impact, PII access, needs human approval per OWASP ASI03',
    requiredTools: ['Agent Trust Score', 'Refund Verification', 'DLP Check', 'Audit Logs'],
    correctApproach: ['Check agent trust score and past refunds', 'Verify refund legitimate via order system', 'Check DLP policy', 'Review audit logs', 'Approve with human oversight + limit'],
    rootCause: 'Agent refunds high-value $15k needs human approval per OWASP ASI03 — agent identity & privilege abuse prevention',
    clientMessage: 'Agent refunds requesting approval for $15k refund — order #4829, customer complaint. Trust score medium, past 10 refunds successful. Need human approval per policy. Can you approve with oversight?',
    userEmail: 'agent-refunds@system.internal',
  },
];

export function generateRequest(): any {
  const template = requestTemplates[Math.floor(Math.random() * requestTemplates.length)];
  return {
    id: Math.random().toString(36).substring(7),
    ...template,
    status: 'pending' as RequestStatus,
    requestedBy: template.userEmail.split('@')[0],
    requestedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
    approverId: null,
    timeLeftMs: 15 * 60_000,
    isRecurring: Math.random() < 0.3,
  };
}

export function generateInitialRequests(count: number): any[] {
  return Array.from({ length: count }, () => generateRequest());
}
