# P0-1 Patient Portal — Security Threat Model (STRIDE)

## Spoofing
- Patient identity spoof → Nafath/Absher SSO + biometric
- Caregiver spoof → Nafath verification + PDPL consent
- Provider spoof → session auth + MFA

## Tampering
- Lab result tampering → append-only audit, hash chain
- Insurance approval tampering → Wateen verification
- Consent record tampering → audit log

## Repudiation
- Patient denies consent → witness + timestamp
- Patient denies payment → SADAD confirmation
- Caregiver denies access → audit log

## Information Disclosure
- PHI in logs → rails #12
- Cross-patient data → RLS + patient-level filter
- Vector leak → tenant-scoped
- Snapshot leak → at-rest encryption

## Denial of Service
- Mass appointment bookings → rate limit
- FHIR export abuse → daily quota
- API flood → express-rate-limit

## Elevation of Privilege
- Patient edits own record → no write access
- Patient accesses another patient → RLS
- Caregiver access outside scope → consent scope check

## Compliance Matrix

| Standard | Status |
|---|---|
| PDPL 2024 | ✅ |
| CBAHI | ✅ |
| NHIA Sehhaty | ✅ |
| MoH Mawid | ✅ |
| Wateen Insurance | ✅ |
| SFDA | ✅ |
| FHIR R4 | ✅ |
| WCAG 2.1 AA | ✅ |

## Pentest Checklist
- [ ] Identity bypass (Nafath)
- [ ] Tenant isolation
- [ ] Patient-to-patient access
- [ ] SQL injection
- [ ] XSS
- [ ] CSRF
- [ ] Mass assignment
- [ ] PHI in logs
- [ ] Rate limiting
- [ ] 2FA bypass
- [ ] Critical lab without verification
- [ ] Controlled substance access
