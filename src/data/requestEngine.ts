/**
 * Real-Time Request Engine — Like OrbitDesk ticketEngine but for security operations
 * Endless high-impact requests that need 4-eyes approval, with per-tenant policies
 */

import { requestTemplates, generateRequest, type RequestTemplate } from './requestTemplates';
import { tenants } from './tenants';

export interface LiveRequest {
  id: string;
  code: string;
  title: string;
  category: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'executed' | 'in_review';
  description: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  expiresAt: string;
  timeLeftMs: number;
  tenantId: string;
  tenantName: string;
  userEmail: string;
  clientMessage: string;
  requiredTools: string[];
  correctApproach: string[];
  rootCause: string;
  estimatedImpact: string;
  requiredApproverRole: string;
  isRecurring: boolean;
  assignedTo?: string;
  actions: string[];
  notes: string[];
  auditTrail: { who: string; action: string; when: string; details: string }[];
}

const tenantNames: Record<string, string> = {
  novatech: 'NovaTech Enterprises',
  bloom: 'Bloom & Co Studio',
  apex: 'Apex Financial Group',
};

const requesterNames: Record<string, string> = {
  'dmitri.kovac': 'Dmitri Kovac',
  'agent-billing': 'Agent Billing',
  'nia.owiti': 'Nia Owiti',
  'david.okafor': 'David Okafor',
  'jessica': 'Jessica',
  'operator': 'Security Operator',
  'tendai.moyo': 'Tendai Moyo',
  'agent-refunds': 'Agent Refunds',
};

function getTenantIdFromEmail(email: string): string {
  if (email.includes('novatech')) return 'novatech';
  if (email.includes('bloomco')) return 'bloom';
  if (email.includes('apexfinancial')) return 'apex';
  if (email.includes('agent-')) return Math.random() < 0.5 ? 'novatech' : 'apex';
  return ['novatech', 'bloom', 'apex'][Math.floor(Math.random() * 3)];
}

export function generateLiveRequest(): LiveRequest {
  const template = requestTemplates[Math.floor(Math.random() * requestTemplates.length)];
  const tenantId = getTenantIdFromEmail(template.userEmail);
  const requestedBy = template.userEmail.split('@')[0];
  
  return {
    id: Math.random().toString(36).substring(7),
    code: template.code,
    title: template.title,
    category: template.category,
    priority: template.priority as any,
    status: 'pending',
    description: template.description,
    risk: template.risk as any,
    requestedBy,
    requestedByName: requesterNames[requestedBy] || requestedBy,
    requestedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (5 + Math.random() * 20) * 60_000).toISOString(),
    timeLeftMs: (5 + Math.random() * 20) * 60_000,
    tenantId,
    tenantName: tenantNames[tenantId],
    userEmail: template.userEmail,
    clientMessage: template.clientMessage,
    requiredTools: template.requiredTools,
    correctApproach: template.correctApproach,
    rootCause: template.rootCause,
    estimatedImpact: template.estimatedImpact,
    requiredApproverRole: template.requiredApproverRole,
    isRecurring: Math.random() < 0.3,
    actions: [],
    notes: [],
    auditTrail: [
      { who: requestedBy, action: 'requested', when: new Date().toISOString(), details: template.description }
    ],
  };
}

export function generateInitialLiveRequests(count: number): LiveRequest[] {
  return Array.from({ length: count }, () => generateLiveRequest());
}

// Real-time engine with endless generation
export class RequestEngine {
  private requests: LiveRequest[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((requests: LiveRequest[]) => void)[] = [];
  private requestCounter = 0;

  constructor(initialCount = 8) {
    this.requests = generateInitialLiveRequests(initialCount);
  }

  subscribe(listener: (requests: LiveRequest[]) => void) {
    this.listeners.push(listener);
    listener(this.requests);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.requests]));
  }

  start() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      // Decrement timers
      this.requests = this.requests.map(r => {
        if (r.status === 'pending' || r.status === 'in_review') {
          const newTimeLeft = r.timeLeftMs - 1000;
          if (newTimeLeft <= 0) {
            return { ...r, status: 'expired' as const, timeLeftMs: 0 };
          }
          return { ...r, timeLeftMs: newTimeLeft };
        }
        return r;
      });

      // Generate new requests randomly (30% chance every 3 sec)
      if (Math.random() < 0.3) {
        const newRequest = generateLiveRequest();
        this.requests.unshift(newRequest);
        this.requestCounter++;
        
        // Keep max 20 requests
        if (this.requests.length > 20) {
          this.requests = this.requests.slice(0, 20);
        }
      }

      // Auto-approve some low-risk for realism
      if (Math.random() < 0.1) {
        const pending = this.requests.filter(r => r.status === 'pending' && r.risk === 'Low');
        if (pending.length > 0) {
          const toApprove = pending[Math.floor(Math.random() * pending.length)];
          this.requests = this.requests.map(r => 
            r.id === toApprove.id ? { ...r, status: 'approved' as const, assignedTo: 'auto-system' } : r
          );
        }
      }

      this.notify();
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getRequests() {
    return [...this.requests];
  }

  approveRequest(id: string, approver: string, note?: string) {
    this.requests = this.requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'approved' as const,
          assignedTo: approver,
          notes: note ? [...r.notes, note] : r.notes,
          auditTrail: [...r.auditTrail, { who: approver, action: 'approved', when: new Date().toISOString(), details: note || 'Approved via dashboard' }],
        };
      }
      return r;
    });
    this.notify();
  }

  rejectRequest(id: string, approver: string, reason: string) {
    this.requests = this.requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected' as const,
          assignedTo: approver,
          notes: [...r.notes, `Rejected: ${reason}`],
          auditTrail: [...r.auditTrail, { who: approver, action: 'rejected', when: new Date().toISOString(), details: reason }],
        };
      }
      return r;
    });
    this.notify();
  }

  assignRequest(id: string, assignee: string) {
    this.requests = this.requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'in_review' as const,
          assignedTo: assignee,
          auditTrail: [...r.auditTrail, { who: assignee, action: 'assigned', when: new Date().toISOString(), details: `Assigned to ${assignee}` }],
        };
      }
      return r;
    });
    this.notify();
  }

  executeRequest(id: string, executor: string) {
    this.requests = this.requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'executed' as const,
          actions: [...r.actions, `Executed by ${executor} at ${new Date().toISOString()}`],
          auditTrail: [...r.auditTrail, { who: executor, action: 'executed', when: new Date().toISOString(), details: 'Operation executed, audit trail HMAC-signed' }],
        };
      }
      return r;
    });
    this.notify();
  }
}

// Singleton for demo
export const requestEngine = new RequestEngine(8);
