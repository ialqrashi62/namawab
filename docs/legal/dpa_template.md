# Data Processing Agreement (DPA) — Template
**Between**: Healthcare Facility ("Controller")
**And**: NamaMedical / Sub-processor ("Processor")
v1.0 — 2026-05-13 — Governing law: KSA PDPL

---

## 1. Definitions
- **PDPL**: KSA Personal Data Protection Law and its Implementing Regulations.
- **Personal Data / PHI**: any information relating to an identified/identifiable
  natural person, including health data.
- **Processing**: any operation performed on Personal Data.
- **Data Subject**: the patient, employee, or other person to whom the data relates.
- **Sub-processor**: any third party engaged by the Processor to process Personal Data.

## 2. Subject Matter & Duration
- Subject: Provision of NamaMedical platform and related services.
- Duration: Co-terminus with the Master Service Agreement.

## 3. Categories of Data Subjects & Data
- Subjects: patients, family contacts, healthcare workforce, vendors.
- Data: identification, contact, sensitive health data, financial, system usage,
  AI input/output (redacted).

## 4. Nature & Purposes of Processing
- Storing, indexing, querying clinical and operational data.
- Analytics, AI co-pilot inference, audit logging.
- Backups, security monitoring, incident response.
- Integration with KSA platforms (NPHIES, Wasfaty, Mawid…).

## 5. Processor Obligations
The Processor will:
1. Process Personal Data **only on documented instructions** from the Controller.
2. Ensure persons with access are bound by **confidentiality**.
3. Implement **technical & organizational measures** at the level set out in
   `security/security_baseline.md`.
4. Notify breaches **without undue delay (≤ 24 hours)**; assist Controller's 72 h
   SDAIA notification.
5. Make available all information necessary to demonstrate compliance and allow audits.
6. Assist with Data Subject requests, DPIAs, and consultations with SDAIA.
7. **Data residency**: process and store Personal Data within the **Kingdom of Saudi Arabia**.
8. Return or delete Personal Data at the end of services per Controller instruction.

## 6. Sub-processors
- Current sub-processors are listed in **Annex A**; any change requires **30-day notice**
  and Controller objection right.
- Each sub-processor is bound by equivalent obligations.

## 7. International Transfers
- Default: **no transfer outside KSA**.
- Exceptions require explicit Controller written authorization + adequate safeguards
  per PDPL (Standard Contractual Clauses-equivalent).

## 8. Security Measures (summary; full list in Annex B)
- Encryption at rest (AES-256/TDE) and in transit (TLS 1.3).
- MFA for all privileged users.
- Hash-chained audit logs.
- PHI redaction before LLM calls.
- Role-based + attribute-based access control.
- Vulnerability management, pen-tests, EDR, SIEM.

## 9. Data Subject Rights
Processor will assist Controller within **5 working days** to respond to:
access, rectification, erasure, restriction, portability, objection, automated-decision
review requests.

## 10. Personal Data Breach
- Notify Controller via dedicated channel **within 24 hours** of awareness.
- Provide: nature of breach, categories/approximate number of subjects,
  likely consequences, mitigation measures.
- Cooperate fully in investigation and remediation.

## 11. Audit Rights
- Controller (or independent auditor) may audit annually with 30-day notice
  (or shorter for cause).
- Processor provides ISO 27001/27799 + SOC 2 Type II reports where applicable.

## 12. AI-Specific Provisions
- AI outputs are **advisory** and produced under the Controller's clinical responsibility.
- Processor shall maintain **model cards** for each AI feature (purpose, limitations,
  data, evaluation).
- Controller may request **opt-out** of specific AI features.

## 13. Liability & Indemnity
- Each party is responsible for the share of damages corresponding to its breach.
- Caps and indemnities per the Master Service Agreement.

## 14. Termination
On termination: Processor will, at Controller's choice, **return** or **delete**
all Personal Data, including backups, within **90 days**, and certify deletion.

## 15. Annexes
- **Annex A** — List of sub-processors with name, country, function.
- **Annex B** — Detailed security measures (cross-reference `security/security_baseline.md`).
- **Annex C** — DPIA reference for high-risk processing activities.
- **Annex D** — Approved data flows and integration endpoints.
