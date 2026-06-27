# Integration — NPHIES (National Platform for Health Information Exchange)

> KSA's national insurance/claims/eligibility platform (CCHI/NHIC). FHIR R4-based.
> All licensed Saudi facilities and insurers must integrate.

## What it does
- Eligibility check
- Pre-authorization
- Claims submission
- Communication & status
- Coverage discovery

## NamaMedical scope
- Outbound: eligibility, pre-auth, claim, communication.
- Inbound: claim-response, communication-request, payment-notice.

## Auth
- TLS mutual auth + signed FHIR Bundles (digital signature).
- Certificates issued by NPHIES; rotation per CCHI guidance.
- Stored in HashiCorp Vault `secrets/nphies/cert.p12`; never on disk.

## Base URLs
- Sandbox: `https://nphies.sa/sandbox/...`
- Production: `https://nphies.sa/...`

## Endpoints used
| Operation | FHIR Resource | Method |
|-----------|--------------|--------|
| eligibility-check | `CoverageEligibilityRequest` | POST `$submit` |
| pre-auth | `Claim` (use=preauthorization) | POST `$submit` |
| claim | `Claim` (use=claim) | POST `$submit` |
| status | `CommunicationRequest` | POST `$submit` |
| poll | `Bundle?_id=` | GET |

## Bundle structure (claim example)
```json
{
  "resourceType": "Bundle",
  "type": "message",
  "entry": [
    { "resource": { "resourceType": "MessageHeader", "eventCoding": { "code": "claim-request" } } },
    { "resource": { "resourceType": "Claim", "use": "claim", "patient": {...}, "insurance": [...], "item": [...] } },
    { "resource": { "resourceType": "Patient", ... } },
    { "resource": { "resourceType": "Coverage", ... } }
  ]
}
```

## Mapping NamaMedical → NPHIES
| NamaMedical | NPHIES FHIR |
|-------------|-------------|
| `patients.mrn` | `Patient.identifier` (system: facility-mrn) |
| `patients.national_id` | `Patient.identifier` (system: nph-id) |
| `insurance_policies` | `Coverage` |
| `invoices.items` | `Claim.item` (with KSA codes + RBRVS) |
| `medical_records.diagnoses` | `Claim.diagnosis` (ICD-10-AM) |
| Provider doctor | `Claim.careTeam` (LicenseID = SCFHS) |

## Implementation checklist
- [ ] Onboard with CCHI; obtain endpoint + credentials.
- [ ] Generate + register signing certificate.
- [ ] Build FHIR R4 Bundle builders per use case.
- [ ] Implement eligibility caching (5 min TTL).
- [ ] Implement retry with exponential backoff (idempotency via `Bundle.id`).
- [ ] Validate against NPHIES Implementation Guide schemas.
- [ ] Audit every submission with hash chain.
- [ ] Reconciliation job for pending claims.

## Error taxonomy
| Code | Action |
|------|--------|
| `VALIDATION_ERROR` | Fix Bundle, do NOT retry as-is |
| `BUSINESS_RULE_FAILED` | Surface to user; needs override or correction |
| `AUTH_FAILED` | Rotate cert; alert security |
| `TIMEOUT` | Retry with backoff (max 5) |
| `DUPLICATE` | Mark as already-submitted; reconcile |

## Monitoring
- Metric `nphies_submissions_total{op,status}`
- Alert: `< 95% first-pass success` → Sev2
- Latency: p95 ≤ 8s (NPHIES is slow; budget accordingly)

## Compliance
- CCHI policies; PDPL data minimization.
- Patient consent for claim data sharing implicit in treatment contract.
- Logs retained 10 y.

## References
- NPHIES IG: https://nphies.sa/ig
- CCHI: https://chi.gov.sa
