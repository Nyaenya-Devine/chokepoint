# Threat Model — Chokepoint

## Assets
- High-impact operation requests (e.g., wipe fleet, change CA policy)
- Audit ledger (hash-chained, HMAC-signed)
- User roles and approvals
- Session tokens

## Threat Actors
- Compromised IT account trying to wipe fleet
- Malicious insider bypassing 4-eyes
- External attacker tampering audit logs
- AI agent with excessive privileges (OWASP ASI03)

## Attack Vectors & Mitigations

### 1. Self-Approval → Single-Person Abuse
- Vector: User requests and approves own high-impact action
- Impact: Fleet wipe, data loss, compliance violation
- Mitigation: Dual-control (4-eyes) requires different approver, RBAC separation of duties, audit log shows requester vs approver

### 2. Ledger Tampering → Cover Tracks
- Vector: Attacker modifies audit log to hide action
- Impact: No audit trail, compliance fail
- Mitigation: Hash-chained ledger each entry includes prev hash, HMAC-SHA256 signed, Merkle proofs, verify endpoint

### 3. Privilege Escalation → Operator to Admin
- Vector: Low-privilege user tries to approve
- Impact: Unauthorized high-impact action
- Mitigation: RBAC whitelist, role checks in API, fail-closed, audit

### 4. Replay Attack → Reuse Old Approval
- Vector: Capture approval token and replay
- Impact: Unauthorized action with stolen approval
- Mitigation: Nonce, expiry, HMAC binding, jti replay cache

### 5. Brute Force → Password Spray
- Vector: Attack from Brazil IP tries passwords
- Impact: Account takeover
- Mitigation: Rate limiting, account lockout, IP reputation, audit, MFA

### 6. XSS → Steal Session
- Vector: Inject script via ticket title
- Impact: Session hijack
- Mitigation: html.escape, CSP self-only, input sanitization, HttpOnly cookies

### 7. No Break Glass → Lockout
- Vector: Approval policy blocks all including admin
- Impact: Cannot fix P1
- Mitigation: Break Glass excluded from approval, monitored, alert

## Security Controls
- RBAC, 4-eyes, HMAC-signed ledger, hash chaining, rate limiting, CSP, CSRF, audit logs, break glass

## Residual Risks
- File-based HMAC vs KMS (documented limitation)
- In-memory rate limiting vs Redis (documented)
- Simulated, not real KMS

© 2026 Chokepoint • Threat model for training
