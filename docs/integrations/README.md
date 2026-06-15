# KSA Integration Handbooks

| Platform | File | Notes |
|----------|------|------|
| NPHIES (insurance/claims) | [nphies.md](nphies.md) | FHIR R4, mTLS + signed Bundles |
| Wasfaty (e-Rx) | [wasfaty.md](wasfaty.md) | OAuth2 + mTLS + signing |
| Mawid (appointments) + Sehhaty (patient app) + Yaqeen (identity) | [mawid_sehhaty_yaqeen.md](mawid_sehhaty_yaqeen.md) | per-citizen consent |
| ZATCA Phase 2 e-Invoice | [zatca_einvoice.md](zatca_einvoice.md) | UBL 2.1 + ECDSA + clearance/reporting |
| Shahm + 937 (emergency) | [shahm_937_emergency.md](shahm_937_emergency.md) | bidirectional ETA + status |

## Common patterns
- **Auth**: OAuth2 client_credentials + mTLS where mandated.
- **Idempotency**: deterministic payload IDs (RX-, INV-, ICV-, case_id).
- **Retries**: exponential backoff, max 5; explicit dead-letter queue.
- **Audit**: every external call hash-chained.
- **PHI**: redact before logging; full payload only in encrypted blob if needed.
- **Region**: KSA endpoints; never proxy through non-KSA region.
- **Reconciliation**: nightly job to detect drift between local and remote state.

## Onboarding sequence (any KSA integration)
1. Get production credentials from authority.
2. Onboard certificates in Vault + HSM.
3. Run sandbox conformance tests (provided by authority).
4. Engage authority's QA team for go-live approval.
5. Enable feature flag in NamaMedical for the facility.
6. Dual-run (manual + system) for 1 week.
7. Shift to system-only after sign-off.

## Risks
- Vendor downtime (NPHIES has documented planned + unplanned outages).
- Mandatory protocol changes with short notice.
- Cert expiry → rotate proactively (alert 30 d).
- Schema validation strictness → invest in conformance test suites.
