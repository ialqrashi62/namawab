# 35 — Security Plan (CARD-001)

> Owner: DSL · Snippet: snippet:phi-vault, snippet:golden-access · Tier 1

## Threats & Mitigations

| ID | Threat | Likelihood | Impact | Mitigation |
|----|--------|------------|--------|------------|
| T1 | SQL Injection | Low | Critical | Parameterized queries + zod validation + RLS |
| T2 | XSS | Low | High | escapeHTML, SafeHtml, CSP report-only |
| T3 | CSRF | Low | High | SameSite=Lax + CSRF token + CORS allowlist |
| T4 | Cross-tenant data leak | Low | Critical | RLS + FORCE RLS + requireTenantScope + cross-tenant tests |
| T5 | Cross-specialty write | Medium | High | requireRole + cross_specialty_grants + 4-eye |
| T6 | Money double-billing | Medium | High | Idempotency-Key + server-side money + audit |
| T7 | PHI leak in logs | Medium | Critical | PHI redaction + log sanitization + log review |
| T8 | LLM prompt injection | Medium | High | System prompt hardening + reviewer agent + refusal rules |
| T9 | LLM hallucination | Medium | High | Citation requirement + RAG grounding + reviewer |
| T10 | LLM cost overrun | Low | Medium | Per-tenant cap + alert + throttle |
| T11 | DICOM/PHI file access | Low | Critical | phi_vault + RLS + audit + access logging |
| T12 | Audit log tampering | Low | Critical | Hash chain + append-only + offsite backup |
| T13 | Session hijacking | Low | Critical | MFA + secure cookies + short TTL + Redis session |
| T14 | Brute force login | Medium | High | Rate limit + lockout + MFA |
| T15 | Insider threat (admin) | Low | Critical | CRITICAL audit on admin actions + 2-person rule |
| T16 | Drug interaction missed | Medium | High | CDS rules + LLM + 4-eye for high-risk meds |
| T17 | Red flag missed | Low | Critical | Engine detection + LLM detection + manual backup |
| T18 | NPHIES claim fraud | Low | High | Idempotency + audit + reconciliation |
| T19 | Backup tampering | Low | Critical | Encrypted backups + offsite + 7y retention |
| T20 | Supply chain (npm) | Medium | High | npm audit + lockfile + signed deps |

## Controls

| ID | Control | Status | Reference |
|----|---------|--------|-----------|
| C1 | Parameterized queries | enforced | all DB calls |
| C2 | zod validation | enforced | all body-bearing routes |
| C3 | requireAuth | enforced | all protected routes |
| C4 | requireTenantScope | enforced | all protected routes |
| C5 | requireRole | enforced | all protected routes |
| C6 | RLS | enforced | all tenant-scoped tables |
| C7 | FORCE RLS | enforced | all tenant-scoped tables |
| C8 | Idempotency-Key | enforced | all money/claim routes |
| C9 | Server-side money | enforced | finance_engine.js |
| C10 | Hash-chained audit | opt-in | audit_middleware.js |
| C11 | MFA | enforced for clinical roles | TOTP |
| C12 | Rate limit | enforced | express-rate-limit |
| C13 | CSP report-only | enforced | helmet |
| C14 | HTTPS | enforced (HTTP only on staging) | Let's Encrypt |
| C15 | HSTS | enforced on HTTPS | Nginx |
| C16 | PHI encryption at rest | enforced (selective) | crypto_envelope.js |
| C17 | PHI vault | enforced | phi_vault/ outside webroot |
| C18 | LLM observability | enforced | Langfuse |
| C19 | Backup nightly | enforced | pg_dump |
| C20 | Backup offsite | enforced | S3-compatible |
| C21 | Pen test | quarterly | OWASP ASVS L2 |
| C22 | Incident response | enforced | runbook |
| C23 | Secrets in vault | enforced (production) | .env (dev) / vault (prod) |
| C24 | npm audit | enforced (CI) | npm audit + lockfile |
| C25 | Cross-tenant tests | enforced (CI) | cross_tenant_*_test.js |

## Secrets management

- **Local dev:** `.env` (gitignored, `__CHANGE_ME__` in `.env.example`)
- **Staging:** `.env.staging` (file mode 600, owner=nama-medical)
- **Production:** HashiCorp Vault or equivalent (planned)
- **No secrets in code, commits, fixtures, or sandbox**
- **Rotation:** every 90 days or on incident

## Incident response (snippet:incident-response)

1. **Detect** — automated alert OR manual report
2. **Contain** — revoke compromised session, block IP, isolate host
3. **Eradicate** — remove malicious code, rotate secrets, patch CVE
4. **Recover** — restore from backup, verify integrity
5. **Post-mortem** — within 48h, root cause, remediation, owner review

## Recovery targets

- **RTO:** 4 hours (cardiology is critical; not a 24h-acceptable system)
- **RPO:** 1 hour (nightly backup + WAL archiving)

## Compliance mapping

- JCI 7th: § 13 (Patient Safety), § 16 (Information Management)
- CBAHI: § 4 (Patient Safety), § 9 (Information Management)
- NPHIES: § 4 (Security), § 7 (Audit)
- PDPL: § 5 (Security), § 6 (Breach notification within 72h)
- SFDA: drug traceability
- HIPAA-aligned: § 164.308 (Administrative), § 164.312 (Technical)
