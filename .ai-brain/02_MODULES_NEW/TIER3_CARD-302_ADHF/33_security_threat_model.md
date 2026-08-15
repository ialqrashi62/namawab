# CARD-302_ADHF — Security Threat Model (STRIDE)

## Spoofing
- Fake cardiologist login → bcrypt + MFA + session
- Spoofed LVAD telemetry → device auth + signed data
- Forged transplant listing → SCOT 2FA + audit

## Tampering
- Modify GDMT record → append-only audit, hash chain
- Change INTERMACS profile → second clinician verification
- Alter LVAD parameters → encrypted telemetry

## Repudiation
- Clinician denies therapy decision → all actions logged
- Patient denies consent → witness + timestamp
- Score disputed → audit chain

## Information Disclosure
- PHI in logs → rails #12
- Cross-tenant data → RLS + tenant_id
- Vector leak → tenant-scoped
- Snapshot leak → at-rest encryption

## Denial of Service
- Mass GDMT changes → rate limit
- Vector DB DoS → connection limit
- API flood → express-rate-limit

## Elevation of Privilege
- Nurse prescribes ARNI → role check
- Patient edits own record → no write access
- Tenant A accesses Tenant B → RLS

## Compliance Matrix

| Standard | Status |
|---|---|
| PDPL | ✅ |
| CBAHI | ✅ |
| NPHIES | ✅ |
| SFDA | ✅ |
| AHA/ACC | ✅ |
| ISHLT | ✅ |
| INTERMACS | ✅ |
| SCAI | ✅ |
| SCOT | ✅ |

## Pentest Checklist
- [ ] Auth bypass
- [ ] Tenant isolation
- [ ] SQL injection
- [ ] XSS
- [ ] CSRF
- [ ] Mass assignment
- [ ] Privilege escalation
- [ ] PHI in logs
- [ ] Rate limiting
