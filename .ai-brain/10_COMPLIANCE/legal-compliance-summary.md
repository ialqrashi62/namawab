# Legal & Compliance Documentation — NamaMedical ERP
# Filepath: .ai-brain/10_COMPLIANCE/legal-compliance-summary.md
# Generated: 2026-08-08

# Legal & Compliance Documentation Summary

> **Scope:** All 60 departments + operational modules
> **Frameworks:** JCI + CBAHI + NPHIES + SFDA + PDPL + ZATCA + HIPAA
> **Owner:** Compliance Team + Legal Counsel

---

## 1. Per-Dept Legal Docs (60 × `34_legal_compliance.md`)

Each department has a dedicated legal compliance document covering:

### 1.1 Licenses Required
- Hospital operating license (Saudi MoH)
- Department-specific accreditation (CBAHI)
- Specialist board certification (SCFHS)

### 1.2 Patient Rights
- Right to informed consent (bilingual)
- Right to privacy (PDPL)
- Right to second opinion
- Right to access own records (request within 30 days)

### 1.3 Data Protection (PDPL)
- All PHI encrypted at rest (crypto_envelope.js)
- Audit log retention: 7+ years
- Patient consent for data sharing
- Breach notification within 72 hours

### 1.4 NPHIES Compliance
- Eligibility check before admission
- Pre-authorization for procedures
- Claim submission within 30 days
- Denial appeal within 60 days

### 1.5 CBAHI Standards (per dept)
- CARE (Care of Patients)
- EM (Emergency Management)
- MM (Medication Management)
- PR (Patient Rights)
- RC (Responsibilities of Clinical Staff)

### 1.6 JCI Standards (per dept)
- IPSG (International Patient Safety Goals)
- ACC (Access to Care & Continuity)
- MMU (Medication Management & Use)
- COP (Care of Patients)
- QPS (Quality & Patient Safety)

### 1.7 SFDA Drug Reporting
- Adverse Drug Reaction (ADR) reporting within 15 days
- Batch recall protocol
- Pharmacovigilance contact

### 1.8 ZATCA Phase 2 (if revenue)
- VAT-inclusive pricing
- UBL 2.1 invoices
- XAdES-BES digital signature
- Clearance with ZATCA portal

### 1.9 Insurance Contracts
- Network status per payer
- Tariff negotiations
- Pre-auth requirements
- Co-pay calculations

### 1.10 Liability
- Malpractice insurance (min SAR 1M)
- Incident reporting protocol
- Root cause analysis (RCA)
- Family communication guidelines

---

## 2. Cross-Department Compliance Mappings

### 2.1 IPSG (International Patient Safety Goals) Coverage

| IPSG | Owner Dept | Compliance |
|---|---|---|
| IPSG.1 — Patient Identification | All clinical | ✅ MRN + photo + 2 identifiers |
| IPSG.2 — Effective Communication | Nursing, Pharmacy | ✅ Read-back, barcode |
| IPSG.3 — High-Alert Medications | Pharmacy, ICU | ✅ Double-check protocol |
| IPSG.4 — Site Surgery | Surgery | ✅ Time-out, site mark |
| IPSG.5 — Hand Hygiene | Infection Control | ✅ WHO 5 moments |
| IPSG.6 — Fall Reduction | All inpatient | ✅ Risk assessment + reassessment |

### 2.2 CBAHI Standards Map

| CBAHI | Owner Dept | Compliance |
|---|---|---|
| CARE.1 — Care planning | All clinical | ✅ |
| CARE.2 — Care delivery | All clinical | ✅ |
| CARE.3 — Care continuity | Nursing, Discharge | ✅ |
| EM.1 — Emergency planning | Emergency | ✅ |
| EM.2 — Disaster response | All | ✅ |
| MM.1 — Medication storage | Pharmacy | ✅ |
| MM.2 — Medication prescribing | All prescribers | ✅ |
| MM.3 — Medication administration | Nursing, Pharmacy | ✅ BCMA |
| MM.4 — Medication reconciliation | Pharmacy | ✅ |
| MM.5 — Adverse drug reaction | Pharmacy | ✅ |
| PR.1 — Patient rights | All | ✅ |
| PR.2 — Patient education | Nursing | ✅ |
| PR.3 — Informed consent | All surgical | ✅ |
| RC.1 — Staff qualifications | HR | ✅ SCFHS |
| SS.1 — Patient safety | Quality | ✅ |
| SS.2 — Incident reporting | Quality | ✅ |
| SS.3 — Sentinel events | Quality | ✅ RCA |

---

## 3. Privacy Impact Assessment (DPIA) — Per Dept

For each of 60 departments, a DPIA exists at:
`.ai-brain/02_MODULES/<DEP>/34_legal_compliance.md` (PDPL section)

**DPIA contents:**
1. Description of processing
2. Necessity & proportionality
3. Risks to data subjects
4. Mitigations
5. Data subject rights
6. DPO consultation
7. Approval status

---

## 4. Data Processing Agreement (DPA) — Template

```markdown
# Data Processing Agreement — NamaMedical

Between: [HOSPITAL] (Controller) and NamaMedical (Processor)

## Article 1 — Subject Matter
NamaMedical processes patient data on behalf of Hospital,
as necessary to provide the HIS service.

## Article 2 — Nature & Purpose
- Patient registration
- Clinical encounters
- Lab/imaging results
- Medications + allergies
- Billing/insurance claims
- Quality measures

## Article 3 — Data Categories
- PHI: name, MRN, DOB, demographics, clinical data
- Special categories: health, biometric (none stored)

## Article 4 — Data Subjects
- Patients of Hospital
- Hospital staff (limited)

## Article 5 — Duration
- Active: term of contract
- Retention: 7 years post last encounter (PDPL)
- After termination: secure deletion within 30 days

## Article 6 — Security Measures
- Encryption at rest (DPAPI KEK)
- TLS 1.2+ in transit
- Tenant isolation (RLS)
- Audit log (hash-chained)
- MFA for admin access

## Article 7 — Sub-processors
- Hetzner (hosting, Germany)
- OpenAI (LLM, US — data processing addendum)
- LangFuse (tracing, EU)

## Article 8 — Data Subject Rights
NamaMedical supports Hospital in responding to:
- Access requests (within 30 days)
- Correction requests
- Erasure requests (subject to legal retention)
- Portability (FHIR export)

## Article 9 — Breach Notification
- Within 24 hours: NamaMedical → Hospital
- Within 72 hours: Hospital → PDPL + patients (if high risk)

## Article 10 — Audit Rights
Hospital may audit NamaMedical's compliance annually with
30 days notice.

## Article 11 — Liability
Each party liable per applicable law; capped at fees paid
in last 12 months unless gross negligence.
```

---

## 5. Saudi Compliance Certificates (Roadmap)

| Certificate | Status | Timeline |
|---|---|---|
| **CBAHI Accreditation** | In progress | Q4 2026 |
| **NPHIES Certification** | Pending (requires CBAHI first) | Q1 2027 |
| **SFDA Drug DB Integration** | ✅ Live | Now |
| **ZATCA Phase 2** | ⚠️ Blocked on CSID | Q2 2027 |
| **PDPL Compliance Audit** | Annual | Q3 2026 + annually |
| **ISO 27001 (InfoSec)** | Plan | Q4 2027 |
| **HIPAA Alignment** | ✅ Mapped | Now |

---

## 6. SLA & Liability Caps

| Tier | Max Liability | SLA Uptime |
|---|---|---|
| Community | $0 (as-is) | None |
| Professional | $5,000/year | 99.0% |
| Enterprise | $50,000/year | 99.9% |
| Sovereign | $200,000/year | 99.95% |

---

## 7. Insurance

| Coverage | Limit |
|---|---|
| **Cyber liability** | $5M |
| **Professional indemnity** | $2M |
| **General liability** | $2M |
| **Data breach response** | $1M |

---

**Generated:** 2026-08-08 · **Owner:** Compliance + Legal
