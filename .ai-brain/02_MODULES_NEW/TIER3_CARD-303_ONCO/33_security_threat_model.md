# CARD-303_ONCO — Security Threat Model (STRIDE)

## Spoofing
- Fake oncologist → bcrypt + MFA + session
- Spoofed chemo dose → audit + integrity
- Forged consent → witness + timestamp

## Tampering
- Modify EF value → audit log + hash
- Change ICI myocarditis severity → 2nd clinician verify
- Alter VTE treatment → append-only

## Repudiation
- Oncologist denies dose change → all logged
- Patient denies consent → witness + timestamp
- Disputed cardiotoxicity → audit chain

## Information Disclosure
- PHI in logs → rails #12
- Cross-tenant → RLS + tenant_id
- Vector leak → tenant-scoped
- Snapshot → at-rest encryption

## Denial of Service
- Mass HFA-ICOS → rate limit
- Vector DB DoS → connection limit
- API flood → express-rate-limit

## Elevation of Privilege
- Nurse orders chemo → role check
- Patient edits record → no write
- Tenant A → Tenant B → RLS

## Compliance

| Standard | Status |
|---|---|
| PDPL | ✅ |
| CBAHI | ✅ |
| NPHIES | ✅ |
| SFDA | ✅ |
| ESC | ✅ |
| AHA/ACC | ✅ |
| IC-OS | ✅ |
| ASCO | ✅ |
| NCCN | ✅ |

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
