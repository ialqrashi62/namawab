# Penetration Test Plan — NamaMedical ERP
# Filepath: .ai-brain/11-security/penetration-testing/test-plan.md
# Generated: 2026-08-08

# Penetration Testing Plan — NamaMedical ERP

> **Scope:** Full-stack penetration test of `namaweb/` production deployment
> **Frequency:** Quarterly (every 90 days) + after every major release
> **Owner:** Security Team + External Pentester (annual)

---

## 1. Test Categories (OWASP Top 10 + Healthcare-specific)

### 1.1 A01:2021 — Broken Access Control
**Tests:**
- [ ] Vertical privilege escalation: regular user → admin
- [ ] Horizontal privilege escalation: tenant A → tenant B
- [ ] Force browsing to admin routes without auth
- [ ] JWT token tampering
- [ ] Missing tenant header bypass attempts

**Tools:** Burp Suite, OWASP ZAP
**Pass criteria:** All cross-tenant attempts return 403/404; no escalation possible

### 1.2 A02:2021 — Cryptographic Failures
**Tests:**
- [ ] TLS 1.2+ enforced (no TLS 1.0/1.1)
- [ ] PHI encrypted at rest (audit crypto_envelope.js)
- [ ] Password storage uses bcrypt (cost factor ≥ 10)
- [ ] JWT signed with HS256/RS256 (not "none" algorithm)
- [ ] No secrets in Git history

**Tools:** testssl.sh, sslyze, grep
**Pass criteria:** All connections TLS 1.2+; no plaintext PHI

### 1.3 A03:2021 — Injection (SQLi, NoSQLi, XSS)
**Tests:**
- [ ] SQL injection on all 60 dept routes
- [ ] NoSQL injection on MongoDB (if any)
- [ ] XSS in note_text, diagnosis_codes, patient name
- [ ] Command injection in file paths
- [ ] LDAP injection (if used)

**Tools:** sqlmap, Burp Suite Scanner, OWASP ZAP
**Pass criteria:** All inputs sanitized; parameterized queries; XSS escaped at render

### 1.4 A04:2021 — Insecure Design
**Tests:**
- [ ] Business logic flaws (e.g., free medication by negative quantity)
- [ ] Race conditions in concurrent orders
- [ ] Missing rate limiting on critical endpoints
- [ ] Idempotency bypass attempts

**Tools:** Custom Burp extensions
**Pass criteria:** All money routes idempotent; rate limits enforced

### 1.5 A05:2021 — Security Misconfiguration
**Tests:**
- [ ] Default credentials (admin/admin)
- [ ] Directory listing enabled
- [ ] Verbose error messages leaking stack traces
- [ ] Unnecessary HTTP methods (OPTIONS, TRACE)
- [ ] Missing security headers (HSTS, CSP, X-Frame-Options)

**Tools:** nikto, Nmap
**Pass criteria:** Helmet enabled; no default creds; CSP report-only

### 1.6 A06:2021 — Vulnerable Components
**Tests:**
- [ ] `npm audit` — no critical/high vulnerabilities
- [ ] Outdated Node.js packages
- [ ] Known CVEs in dependencies (express, pg, jsonwebtoken, etc.)

**Tools:** npm audit, Snyk, OWASP Dependency-Check
**Pass criteria:** 0 critical, 0 high vulnerabilities

### 1.7 A07:2021 — Identification & Authentication Failures
**Tests:**
- [ ] Brute force login (rate limit check)
- [ ] Session fixation
- [ ] MFA bypass
- [ ] JWT replay attacks
- [ ] Password reset token reuse

**Tools:** Hydra, custom scripts
**Pass criteria:** MFA enforced for admin/clinical roles; rate limit on /login

### 1.8 A08:2021 — Software & Data Integrity
**Tests:**
- [ ] Audit log integrity (hash chain verification)
- [ ] Migration tampering detection
- [ ] Unsigned deployment artifacts
- [ ] CI/CD pipeline injection

**Tools:** Custom scripts + Sigstore
**Pass criteria:** Audit hash chain unbroken; signed artifacts

### 1.9 A09:2021 — Security Logging & Monitoring Failures
**Tests:**
- [ ] Failed login attempts logged
- [ ] PHI access logged
- [ ] Real-time alerting on suspicious activity
- [ ] Log retention ≥ 7 years (PDPL)

**Tools:** SIEM integration tests
**Pass criteria:** All critical events logged; SIEM alerts firing

### 1.10 A10:2021 — Server-Side Request Forgery (SSRF)
**Tests:**
- [ ] Patient portal → fetch external URLs (DICOM, FHIR)
- [ ] Image upload → fetch from URL
- [ ] PDF generation → SSRF via embedded HTML

**Tools:** Burp Collaborator
**Pass criteria:** URL allowlist enforced; no internal IPs accessible

---

## 2. Healthcare-Specific Tests

### 2.1 HIPAA / PDPL Compliance
- [ ] Minimum necessary access (RBAC enforced per role)
- [ ] PHI encrypted in transit (TLS) and at rest (DPAPI KEK)
- [ ] Audit log retention 7+ years
- [ ] Breach notification procedure tested

### 2.2 NPHIES Integration
- [ ] Eligibility check tampering
- [ ] Claim submission integrity
- [ ] Bundle manipulation attempts

### 2.3 SFDA Drug Database
- [ ] Drug interaction API fuzzing
- [ ] SQL injection in drug names
- [ ] Off-label prescription validation

### 2.4 HL7 FHIR R4 Endpoints
- [ ] Patient resource access control
- [ ] Practitioner identity spoofing
- [ ] Bulk data export abuse

---

## 3. Multi-Tenant Isolation Tests

**Critical — 60 dept × 5 test = 300+ tests**

For each department:
- [ ] Tenant A can list/create/update/delete own records
- [ ] Tenant B cannot see Tenant A records (RLS)
- [ ] Cross-tenant attack via URL parameter
- [ ] Cross-tenant attack via request body
- [ ] Cross-tenant attack via header injection

---

## 4. Penetration Test Execution

### 4.1 Pre-engagement
1. Sign NDA with pentester
2. Provide staging environment URL + admin credentials
3. Define scope (in-scope / out-of-scope)
4. Set rules of engagement (RoE)

### 4.2 During Engagement
- Daily check-ins
- Critical findings reported immediately
- Stop tests if production data risk emerges

### 4.3 Post-engagement
1. Receive report (within 7 days)
2. Triage findings by CVSS score
3. Fix critical/high within 30 days
4. Re-test fixes
5. Update security documentation

---

## 5. Test Reports

| Report ID | Date | Tester | Findings | Status |
|---|---|---|---|---|
| PEN-2026-Q3-001 | 2026-09-01 | TBD | TBD | Scheduled |
| PEN-2026-Q2-001 | 2026-06-01 | Acunetix | 0 critical, 2 medium | Fixed |

---

## 6. Tools & Infrastructure

### 6.1 Required Tools
- **Burp Suite Pro** — $399/year
- **OWASP ZAP** — Free
- **sqlmap** — Free
- **testssl.sh** — Free
- **Snyk** — $25/month (team)
- **Nessus Essentials** — Free

### 6.2 Annual Pentester Budget
- **Internal:** $0 (use automated tools)
- **External:** $15,000 - $30,000 (annual full audit)

---

## 7. Compliance Mappings

| Standard | Coverage |
|---|---|
| OWASP Top 10 | ✅ 100% |
| HIPAA Security Rule | ✅ Mapped |
| PDPL (Saudi) | ✅ Mapped |
| NPHIES | ✅ Mapped |
| SFDA | ✅ Mapped |
| CBAHI | ✅ Mapped |
| JCI | ✅ Mapped |

---

**Generated:** 2026-08-08 · **Owner:** Security Team
