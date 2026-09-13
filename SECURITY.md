# Security Policy — Chokepoint

## Overview
Chokepoint is a least-privilege access-control & tamper-evident audit platform for high-impact operations — for both humans and AI agents (OWASP Agentic AI ASI03).

## Security Upgrades Emphasized (Military-Grade)

### 1. Encrypted Sessions & Audit Logs
- All high-impact actions require dual-control (4-eyes) approval
- Every action logged in hash-chained HMAC-SHA256 ledger
- Audit logs include who, what, when, correlation ID, tamper-evident hash

### 2. RBAC & Least Privilege
- Role-based access control: Viewer, Operator, Approver, Admin
- Default-deny, explicit allow only
- Separation of duties: Requester cannot approve own request
- Session TTL + CSRF protection

### 3. Break Glass & Emergency Access
- Break Glass accounts excluded from normal approval flows
- Monitored, alert on use, password in vault
- Documented in runbook, tested quarterly

### 4. Tamper-Evident Audit Ledger
- SHA-256 hash-chained ledger: each entry includes previous hash
- HMAC-SHA256 signed with secret key (not hardcoded, env var)
- Merkle inclusion proofs for verification
- Verification endpoint: `/api/audit/verify`

### 5. Zero Trust & Compliance
- No trust by default, verify every request
- Device trust scoring, IP reputation, time anomaly detection
- Compliance enforcement per operation type
- OWASP Agentic AI ASI03 mapped

### 6. Defender & DLP (Simulated)
- Anomaly detection: impossible travel, privilege escalation, after-hours
- DLP policies for sensitive operations
- Quarantine for suspicious requests

### 7. Security Headers (Military-Grade)
Implemented in `next.config.mjs`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-XSS-Protection: 0` (modern browsers)
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`

### 8. No Real Data & No Secrets
- No hardcoded secrets, PATs, API keys (verified via `grep -r ghp_`)
- All data simulated, no real tenant connections
- No tracking, no credentials stored
- Input sanitization, AST safety checks

### 9. Threat Model
- **Privilege Escalation:** Junior tries to approve own request → Blocked by RBAC + 4-eyes
- **Ledger Tampering:** Attacker modifies audit log → HMAC verification fails, tamper detected
- **Replay Attack:** Reuse old approval → Nonce + expiry + HMAC binding
- **MFA Bypass:** Brute force → Rate limiting + account lockout + audit
- **Self-Approval:** User approves own request → Dual-control blocks, requires different approver
- See `THREAT_MODEL.md` for full model

### 10. Secure Development
- TypeScript strict, no `any`
- PBKDF2/Argon2id + salt for passwords, `hmac.compare_digest` for comparison
- Role whitelist, session TTL + CSRF, IP rate limiting, `html.escape` for XSS
- CI: CodeQL + pip-audit + TruffleHog + npm audit, 0 vulns
- Tests: 26 tests proving security properties

## Reporting
Email: devinenyaenya@gmail.com — Responsible disclosure, 90 days

## Verified
- `grep -r ghp_` clean, no PATs
- `npm audit` 0 vulns
- Security headers in next.config.mjs
- Audit log HMAC-signed, hash-chained, tamper-evident

© 2026 Chokepoint • Security-first • MIT • Educational
