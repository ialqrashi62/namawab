# CARD-304_ROBOTIC — Security Threat Model (STRIDE)

## Spoofing
- Fake surgeon → bcrypt + MFA + session
- Spoofed device data → signed telemetry
- Forged consent → witness + timestamp

## Tampering
- Modify STS score → append-only audit, hash
- Change procedure outcome → 2nd clinician verify
- Alter device serial → SFDA cross-check

## Repudiation
- Surgeon denies decision → all logged
- Patient denies consent → witness + timestamp
- Disputed outcome → audit chain

## Information Disclosure
- PHI in logs → rails #12
- Cross-tenant → RLS + tenant_id
- Vector leak → tenant-scoped
- Device leak → at-rest encryption

## Denial of Service
- Mass eligibility checks → rate limit
- Vector DB DoS → connection limit
- API flood → express-rate-limit

## Elevation of Privilege
- Nurse orders device → role check
- Patient edits record → no write
- Tenant A → Tenant B → RLS

## Compliance

| Standard | Status |
|---|---|
| PDPL | ✅ |
| CBAHI | ✅ |
| NPHIES | ✅ |
| SFDA | ✅ |
| STS | ✅ |
| ESC | ✅ |
| ACC/AHA | ✅ |
| SCFHS | ✅ |

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
