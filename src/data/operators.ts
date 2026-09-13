/**
 * Operators — Simulated security operators with conflicts, skills, workload — Like OrbitDesk agents
 * Each operator has personality, skills 1-10, 44h/week compliance, SLA/CSAT/QA/FRT/MTTR, mood, conflicts
 */

export interface Operator {
  id: string;
  name: string;
  displayName: string;
  role: 'admin' | 'operator' | 'auditor' | 'viewer' | 'approver';
  avatar: string;
  skills: Record<string, number>; // skill name → 1-10
  status: 'available' | 'busy' | 'offline' | 'on-call';
  mood: 'neutral' | 'frustrated' | 'calm' | 'happy' | 'stressed';
  workload: number; // current requests assigned
  maxWorkload: number;
  hoursThisWeek: number;
  slaCompliance: number;
  csat: number;
  qa: number;
  frt: number; // minutes
  mttr: number; // minutes
  conflictWith?: string;
  conflictReason?: string;
  learningGap?: string;
  coachingNotes?: string;
  traits: string[];
  canApprove: string[];
}

export const operators: Operator[] = [
  {
    id: 'u-admin',
    name: 'Nia Owiti',
    displayName: 'Nia Owiti',
    role: 'admin',
    avatar: 'N',
    skills: { 'Entra ID': 10, 'Conditional Access': 10, 'RBAC': 9, 'Audit Logs': 10, 'Break Glass': 9, 'What If': 10 },
    status: 'available',
    mood: 'calm',
    workload: 2,
    maxWorkload: 10,
    hoursThisWeek: 38,
    slaCompliance: 98,
    csat: 4.8,
    qa: 92,
    frt: 8,
    mttr: 25,
    traits: ['Calm under pressure', 'Security-focused', 'Audit trail mindset', 'Mentor', 'Direct'],
    canApprove: ['privilege escalation', 'agent actions >$10k', 'fleet wipe', 'DLP disable', 'secret rotation', 'all high-impact'],
  },
  {
    id: 'u-op',
    name: 'Dmitri Kovac',
    displayName: 'Dmitri Kovac',
    role: 'operator',
    avatar: 'D',
    skills: { 'M365': 7, 'Intune': 6, 'Exchange': 8, 'Entra ID': 5, 'Troubleshooting': 8 },
    status: 'busy',
    mood: 'frustrated',
    workload: 5,
    maxWorkload: 5,
    hoursThisWeek: 44,
    slaCompliance: 92,
    csat: 4.2,
    qa: 75,
    frt: 18,
    mttr: 45,
    conflictWith: 'u-admin',
    conflictReason: 'Alex said Dmitri wastes time escalating easy tickets without checking logs — public shaming in #team-internal',
    learningGap: 'Escalates easy M365 tickets without checking Sign-in logs CA tab / Message Trace first',
    coachingNotes: 'Needs escalation checklist: Service Health → Logs → KB → What tried. Pair with Nia for mentoring on Message Trace. Shadowing 2 tickets/day.',
    traits: ['Eager', 'Fast', 'Needs logs first', 'Technical but rushes', 'High workload 44h/week'],
    canApprove: ['low-impact only', 'requires senior for privilege'],
  },
  {
    id: 'u-approver',
    name: 'Alex Rivera',
    displayName: 'Alex Rivera',
    role: 'approver',
    avatar: 'A',
    skills: { 'Entra ID': 10, 'Conditional Access': 10, 'What If': 10, 'Report-Only': 9, 'Audit Logs': 9, 'Break Glass': 8 },
    status: 'available',
    mood: 'neutral',
    workload: 3,
    maxWorkload: 5,
    hoursThisWeek: 40,
    slaCompliance: 96,
    csat: 4.6,
    qa: 88,
    frt: 12,
    mttr: 30,
    conflictWith: 'u-op',
    conflictReason: 'Said Dmitri wastes time in public — needs coaching on coaching (SBI)',
    learningGap: 'Needs to coach juniors privately, not public shaming',
    coachingNotes: 'Private 1:1 with Dmitri — SBI feedback + coach on coaching. Pair them: Alex mentors Dmitri on Message Trace. Follow-up in 1 week.',
    traits: ['Direct', 'Technical', 'Says Correlation ID', 'Checks audit logs first', 'Conflicted with Dmitri'],
    canApprove: ['privilege escalation', 'CA policies', 'Entra ID', 'What If', 'Report-Only'],
  },
  {
    id: 'u-priya',
    name: 'Priya Nair',
    displayName: 'Priya Nair',
    role: 'approver',
    avatar: 'P',
    skills: { 'Intune': 10, 'Device Compliance': 10, 'dsregcmd': 10, 'BitLocker': 9, 'Autopilot': 9, 'Company Portal': 9 },
    status: 'available',
    mood: 'calm',
    workload: 2,
    maxWorkload: 5,
    hoursThisWeek: 36,
    slaCompliance: 99,
    csat: 4.9,
    qa: 94,
    frt: 10,
    mttr: 28,
    traits: ['Patient mentor', 'Explains step-by-step', 'Pairs with juniors', 'Calm', 'Excellent mentor'],
    canApprove: ['Intune', 'Compliance', 'BitLocker', 'Autopilot', 'Device enrollment', '0x80180024'],
  },
  {
    id: 'u-david',
    name: 'David Okafor',
    displayName: 'David Okafor',
    role: 'approver',
    avatar: 'D',
    skills: { 'Exchange': 10, 'Message Trace': 10, 'Quarantine': 10, 'Defender': 9, 'DLP': 9, 'Compliance': 8 },
    status: 'available',
    mood: 'calm',
    workload: 2,
    maxWorkload: 5,
    hoursThisWeek: 38,
    slaCompliance: 97,
    csat: 4.7,
    qa: 90,
    frt: 11,
    mttr: 32,
    traits: ['Calm under pressure', 'Security-focused', 'Audit trail mindset', 'Formal', 'Compliance proof'],
    canApprove: ['Exchange', 'Quarantine', 'Defender', 'DLP', 'SEC-2024-07'],
  },
  {
    id: 'u-auditor',
    name: 'Tendai Moyo',
    displayName: 'Tendai Moyo',
    role: 'auditor',
    avatar: 'T',
    skills: { 'Audit Logs': 10, 'Compliance': 9, 'Threat Model': 8, 'Verification': 10, 'SIEM': 8 },
    status: 'available',
    mood: 'neutral',
    workload: 1,
    maxWorkload: 3,
    hoursThisWeek: 32,
    slaCompliance: 100,
    csat: 4.8,
    qa: 95,
    frt: 15,
    mttr: 20,
    traits: ['Detail-oriented', 'Compliance-focused', 'Verification expert', 'Audit trail'],
    canApprove: ['audit verification', 'log export', 'compliance review'],
  },
  {
    id: 'u-viewer',
    name: 'Samir Patel',
    displayName: 'Samir Patel',
    role: 'viewer',
    avatar: 'S',
    skills: { 'Viewing': 5, 'Dashboard': 6 },
    status: 'offline',
    mood: 'neutral',
    workload: 0,
    maxWorkload: 2,
    hoursThisWeek: 20,
    slaCompliance: 100,
    csat: 4.5,
    qa: 80,
    frt: 20,
    mttr: 15,
    traits: ['Read-only', 'Learning', 'Observer'],
    canApprove: ['none — viewer only'],
  },
  {
    id: 'u-lisa',
    name: 'Lisa Chen',
    displayName: 'Lisa Chen',
    role: 'operator',
    avatar: 'L',
    skills: { 'Teams': 8, 'M365 Groups': 7, 'SharePoint': 6, 'Non-Technical Language': 10, 'Empathy': 10 },
    status: 'on-call',
    mood: 'happy',
    workload: 3,
    maxWorkload: 5,
    hoursThisWeek: 42,
    slaCompliance: 94,
    csat: 4.7,
    qa: 82,
    frt: 25,
    mttr: 38,
    learningGap: 'High CSAT 4.7 but slow FRT 25m — needs time management',
    coachingNotes: 'Time management coaching, prioritize P1 first, use templates for common responses',
    traits: ['Empathetic', 'Non-technical language expert', 'Great with SMB', 'High CSAT', 'Slow FRT'],
    canApprove: ['low-impact', 'Teams', 'M365'],
  },
];

export const getOperator = (id: string) => operators.find(o => o.id === id);
