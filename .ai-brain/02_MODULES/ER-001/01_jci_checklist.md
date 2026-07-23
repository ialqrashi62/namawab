---
module_id: ER-001
section: 06_compliance
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 JCI / ISO 27001 / HIPAA / NPHIES Mapping

## JCI 7th Edition — ER Module Mapping

| JCI Chapter | Standard | ER-001 Implementation |
|-------------|----------|------------------------|
| **ACC** (Access to Care) | ACC.1 (Triage) | er_triage_decisions table, ESI 1-5 classification |
| | ACC.2 (Wait times) | er_kpi.door_to_provider, monitored + alerted |
| | ACC.3 (Equity) | Multi-tenant, all patients regardless of status |
| **COP** (Care of Patients) | COP.1 (Care plan) | encounter + disposition workflow |
| | COP.3 (Emergency services) | er_codes (blue/stemi/stroke/trauma/sepsis) |
| | COP.4 (Resuscitation) | Code blue activation, ACLS protocol |
| | COP.5 (Medication safety) | 5-rights check, allergy check, interaction check |
| | COP.7 (Pain management) | pain_score vital, opioid stewardship |
| | COP.8 (Patient falls) | Morse Fall Scale integrated, geriatrics |
| | COP.9 (Restraint use) | Restraint order set, time-limited |
| **MMU** (Medication Management) | MMU.1 (Storage) | Pharmacy integration (out of scope for ER) |
| | MMU.2 (Ordering) | CPOE via er_lab_orders, er_medications_admin |
| | MMU.3 (Preparation) | Pharmacy dispenses (out of scope) |
| | MMU.4 (Administration) | 5-rights check, witnessed for high-alert |
| | MMU.5 (Monitoring) | Vitals tracking, side effects documented |
| | MMU.7 (Look-alike/sound-alike) | Tall-man lettering, pharmacy alerts |
| **MOI** (Management of Information) | MOI.1 (Confidentiality) | PHI encrypted, RBAC, audit log |
| | MOI.2 (Integrity) | Hash-chained audit log, RLS |
| | MOI.3 (Completeness) | Required fields enforced at DB level |
| | MOI.4 (Timeliness) | Real-time audit, ED encounter timestamp |
| | MOI.5 (Authenticity) | Digital signatures, MFA for sensitive access |
| | MOI.6 (Reliability) | 99.9% SLO, DR drill quarterly |
| **PCI** (Prevention & Control of Infection) | PCI.7 (Hand hygiene) | Mandatory hand hygiene at encounter start/end |
| | PCI.8 (Isolation) | er_codes for isolation (TB, meningitis, etc.) |
| **PFR** (Patient & Family Rights) | PFR.1 (Informed consent) | Consent_obtained in er_procedures |
| | PFR.5 (Refusal of care) | AMA disposition with witness |
| **QPS** (Quality & Patient Safety) | QPS.1 (Quality measurement) | er_kpi dashboard |
| | QPS.3 (Incident reporting) | er_audit_log, root cause analysis |
| **SQE** (Staff Qualifications) | SQE.1 (License verification) | system_users role + license tracking |
| | SQE.4 (Training) | Required ER certification (BLS, ACLS, PALS) |

## ISO 27001:2022 — ER Module

| Control | ER-001 Implementation |
|---------|------------------------|
| **A.5** (Policies) | Information security policy, ER-specific access |
| **A.8** (Asset Management) | PHI inventory, classification |
| **A.9** (Access Control) | RBAC, JWT + session, MFA for MD |
| **A.10** (Cryptography) | PHI encrypted (DPAPI KEK), TLS 1.3 |
| **A.12.4** (Logging) | er_audit_log (hash-chained) |
| **A.16** (Incident Management) | Security incident response, escalation |
| **A.18** (Compliance) | PDPL, HIPAA, JCI, SFDA compliance |

## HIPAA — ER Module (if US)

| Rule | ER-001 Implementation |
|------|------------------------|
| 164.312(a)(1) Access Control | RBAC, MFA, role-based permissions |
| 164.312(a)(2)(i) Unique User ID | system_users.id, audit per user |
| 164.312(a)(2)(ii) Emergency Access | "Break glass" procedure (audit + alert) |
| 164.312(a)(2)(iii) Auto Logoff | 15 min idle, re-auth required |
| 164.312(a)(2)(iv) Encryption | PHI encrypted at rest + in transit |
| 164.312(b) Audit Controls | er_audit_log, hash-chained, WORM |
| 164.312(c) Integrity | Digital signatures for orders, hash verification |
| 164.312(d) Person Authentication | MFA (TOTP) for MD/RN |
| 164.312(e)(1) Transmission Security | TLS 1.3, mTLS for NPHIES |
| 164.312(e)(2)(i) Integrity Controls | HMAC on all data in transit |
| Breach Notification | Auto-trigger if PHI access outside scope |

## PDPL (Saudi Arabia) — ER Module

| Requirement | ER-001 Implementation |
|-------------|------------------------|
| **Data minimization** | Only collect what's needed for care |
| **Purpose limitation** | Use only for stated purpose (treatment) |
| **Storage limitation** | 10-year retention (clinical), auto-archive |
| **Integrity & confidentiality** | Encryption, RBAC, audit |
| **Patient consent** | General + AI-specific consent |
| **Patient rights** | Access (FHIR), rectification, portability |
| **Data Protection Officer** | DPO appointed, contact in privacy policy |
| **Breach notification** | 72h to authority, immediate to patient if high risk |
| **Cross-border** | Data stays in KSA (SDAIA regulations) |

## NPHIES (KSA Insurance) — ER Module

| Use Case | ER-001 Implementation |
|----------|------------------------|
| Eligibility check | `/api/nphies/eligibility` (real-time) |
| Pre-authorization | Emergency services exempt, post-stabilization auth |
| Claim submission | After discharge, automated |
| Denial management | Workflow for appeal |
| Cross-payer | NPHIES gateway integration |

## ZATCA (KSA e-invoicing) — ER Module

| Use Case | ER-001 Implementation |
|----------|------------------------|
| Outpatient invoice | After ER discharge, automated |
| VAT calculation | 15% VAT (KSA standard) |
| QR code | On printed invoice |
| UBL XML | Generated for ZATCA submission |
| XAdES signature | For ZATCA compliance (when CSID available) |
| Reporting | Daily/real-time |

**Status:** ZATCA integration is ready in code, blocked on real CSID/OTP credentials (GATE 9).

## SFDA (Saudi FDA) — ER Module

| Scope | ER-001 Implementation |
|-------|------------------------|
| Drug registration | National Drug Code (NDC) + SFDA code |
| Medical devices | UDI tracking for devices used in ED |
| Adverse event reporting | Within 24h to SFDA |
| Recall management | Integrated with pharmacy + inventory |

## CBAHI (Saudi Center for Accreditation) — ED Standards

| Standard | ER-001 Implementation |
|----------|------------------------|
| ER.1 (24/7 coverage) | MD coverage 24/7, on-call specialists |
| ER.2 (Triage) | ESI 1-5, documentation |
| ER.3 (Resuscitation) | Code blue, ACLS, equipment standards |
| ER.4 (Disaster plan) | MCI protocol, HICS |
| ER.5 (Documentation) | Standardized ED notes |
| ER.6 (Quality indicators) | KPI monitoring |

## NABIDH (UAE) — Ready

| Use Case | ER-001 Implementation |
|----------|------------------------|
| Patient summary | Real-time FHIR exchange |
| Lab results | NABIDH-compatible |
| Imaging | DICOM exchange |

## Audit Events (Mandatory)

Every one of these MUST be logged to `er_audit_log` (hash-chained):

| Event | Frequency | Compliance |
|-------|-----------|------------|
| Patient arrival | Every encounter | JCI ACC, MOI |
| Triage decision | Every encounter | JCI ACC, COP |
| Vitals recording | 4-12x per encounter | COP, MOI |
| Medication administration | 3-5x per encounter | JCI MMU, HIPAA, PDPL |
| Procedure performed | As needed | CPT, SNOMED |
| Lab order + result | 5-10x per encounter | LOINC, MOI |
| Imaging order + report | 1-2x per encounter | DICOM, MOI |
| Consultation request + response | As needed | MOI |
| Code activation | 5-10% of encounters | JCI COP |
| Red flag detection | Real-time | JCI QPS, MOH |
| Drug safety block | As needed | JCI MMU, FDA |
| Disposition | Once per encounter | JCI ACC, MOI |
| User login/logout | Per session | HIPAA, PDPL |
| Privilege escalation | Per use | HIPAA, PDPL |
| Configuration change | Per change | ISO 27001 |
| PHI export | Per export | HIPAA, PDPL |
| Break-glass access | Per use | HIPAA, ISO 27001 |

## Compliance Documentation

- **Privacy Policy** (AR + EN) — published, in patient portal
- **Consent Forms** (10 types) — digital + paper backup
- **Patient Bill of Rights** — posted in ED, given on admission
- **DPA (Data Processing Agreement)** — for any third-party vendor
- **Records of Processing Activities (ROPA)** — maintained, audited annually
- **DPIA (Data Protection Impact Assessment)** — for AI features
- **Risk Assessment** — STRIDE per asset, updated annually

---
*Section 06 of ER-001. Owner: CQO. L4 validated.*
