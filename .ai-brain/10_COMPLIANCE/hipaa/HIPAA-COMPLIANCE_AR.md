# HIPAA Compliance — NamaMedical

> **Note:** While NamaMedical is deployed in Saudi Arabia (PDPL/CBAHI/NPHIES/ZATCA),
> the platform is **HIPAA-aligned** to support KSA-to-US patient data flows, US
> payer integrations, and future US market expansion.

---

## 1. HIPAA Safeguards Mapping

### Administrative Safeguards (§164.308)

| Rule | Implementation |
|---|---|
| **Security Officer** | `Role: SecurityOfficer` RBAC; mandatory training annually |
| **Workforce Training** | 95 training videos in `11_TRAINING/` catalog |
| **Access Management** | RBAC + tenant scoping; quarterly access reviews |
| **Contingency Plan** | Daily DB backups → S3-compatible; RPO 24h, RTO 1h |
| **Evaluation** | Annual penetration test; bi-annual internal audit |
| **BAA** | BAA template in `10_COMPLIANCE/baa-template.md` |

### Physical Safeguards (§164.310)

| Rule | Implementation |
|---|---|
| **Facility Access** | Hetzner data center (ISO 27001, SOC 2 Type II) |
| **Workstation Use** | Web-based SPA, no local PHI storage; CSP locks outer HTML |
| **Device Controls** | MDM-ready; full-disk encryption required on managed devices |

### Technical Safeguards (§164.312)

| Rule | Implementation | Code Reference |
|---|---|---|
| **Access Control** | Unique user IDs, MFA (TOTP), auto-logout 15min | `auth_mfa.js` |
| **Audit Controls** | Hash-chained audit log; 7+ year retention | `audit_middleware.js` |
| **Integrity** | TLS 1.3 in transit; AES-256-GCM at rest | `crypto_envelope.js` |
| **Transmission Security** | TLS 1.3 only, HSTS, CSP report-only | `helmet` + `cors` allowlist |
| **Encryption** | DPAPI KEK + DEK envelope for PHI | `crypto_envelope.js` |

## 2. PHI Identification & Handling

| Data Class | Storage | Encryption |
|---|---|---|
| Patient name | `patients.name_enc` | Envelope (DEK+KEK) |
| Patient DOB | `patients.dob_enc` | Envelope |
| National ID / Iqama | `patients.national_id_enc` | Envelope |
| Diagnosis | `encounters.dx_encrypted` (optional) | Envelope |
| Lab values | `results.value` (column-level RLS) | TLS at rest |
| Imaging | `phi_vault/` outside webroot | Envelope + filename hash |
| Voice notes | `phi_vault/voice/` | Envelope |

## 3. Breach Notification (§164.404)

- **Internal trigger:** `audit_middleware` detects tamper or unauthorized bulk export
- **Notification path:** `nama_breach_alert` channel → on-call SecurityOfficer + Owner
- **External notification:** within 60 days to affected individuals and HHS
- **Documentation:** `nama_breach_log` table; immutable; 7-year retention

## 4. Right of Access (§164.524)

- **Patient portal:** `/api/patient/export` returns JSON + PDF in 30 days SLA
- **Audit trail:** every export recorded in audit_log
- **Revocation:** patient can request data deletion (subject to legal retention)

## 5. Minimum Necessary (§164.502(b))

- **Per-route scoping:** `rbac_guards.js` enforces field-level filters
- **Specialty-based access:** non-specialty users see only summary fields
- **Reason codes:** every access requires a `reason_code` (clinical / billing / audit)

## 6. De-identification (§164.514)

For research/analytics exports:
- **Safe Harbor:** 18 identifiers removed
- **Expert Determination:** statistical certification by Privacy Officer
- Tool: `nama_deid_engine.js` (HIPAA Safe Harbor + Date shifting)

## 7. Cross-Border Data Flow

| Source | Destination | Approved? |
|---|---|---|
| KSA → US (NPHIES → US payer) | Encrypted B2B, BAA required | ✅ |
| US → KSA (research collaboration) | De-identified only | ✅ |
| US → KSA (PHI for treatment) | BAA + patient consent | ⚠️ Case-by-case |

## 8. Penalties (Mapped to KSA Penalty Regime)

| HIPAA Tier | Fine (USD) | KSA Equivalent (PDPL) |
|---|---|---|
| Unknowing | $1,000 - $50,000/violation | SAR 50K - 500K |
| Reasonable Cause | $1,000 - $50,000 | SAR 100K - 1M |
| Willful Neglect (corrected) | $10,000 - $50,000 | SAR 500K - 5M |
| Willful Neglect (not corrected) | $50,000+ | Up to SAR 10M + criminal |

## 9. Audit Checklist (Quarterly)

- [ ] All access logs reviewed
- [ ] Terminated users removed within 24h
- [ ] Unused roles flagged
- [ ] Encryption key rotation scheduled
- [ ] Backup restore drill executed
- [ ] BAA inventory current
- [ ] Training completion ≥ 95%
- [ ] Vulnerability scan clean (no high)

## 10. References

- 45 CFR Part 164 — HIPAA Security Rule
- 45 CFR Part 160 — HIPAA Privacy Rule
- HHS.gov/hipaa
- NIST 800-66r2 — HIPAA Security Rule Implementation Guide
- KSA PDPL Implementing Regulations
