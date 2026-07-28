# 44 — PDPL DPIA (CARD-001)

> Owner: CQO · Tier 1

## Data Protection Impact Assessment (DPIA) — Cardiology

### 1. Description of processing

**Nature:**
- Collection of patient demographics, clinical history, vital signs, ECG, echo, stress, holter, cath, device data
- Storage in PostgreSQL (RLS) + phi_vault (DICOM/ECG/cath files)
- Processing for: diagnosis, treatment, billing (NPHIES), follow-up, research (de-identified)
- Sharing with: NPHIES payer, MOH (mandatory), SFDA (device), patient portal (own data)
- Retention: 7+ years per Saudi MOH / CBAHI
- AI processing: LLM co-pilot (PHI-redacted only)

**Scope:**
- All cardiology patients (inpatient + outpatient)
- All cardiology staff (cardiologists, nurses, techs)
- All encounters (visit, procedure, follow-up)

**Context:**
- Healthcare, sensitive data (PHI)
- Multi-tenant SaaS
- International data transfer (LLM to OpenAI/Anthropic — PHI-redacted)

### 2. Necessity & proportionality

- Necessary for: patient care, billing, quality, legal compliance
- Proportional: only collect needed data, RLS enforced
- Alternative considered: paper records (rejected for safety + access)

### 3. Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Unauthorized access | Low | High | RLS + FORCE RLS + role-based + audit + MFA |
| Data leak (cross-tenant) | Low | Critical | RLS + cross-tenant tests + alert |
| Data leak (LLM) | Low | High | PHI redaction + no tenant data in LLM + langfuse trace redact |
| Data leak (logs) | Low | High | PHI redaction in logs + log review |
| Data tampering | Low | High | Hash-chained audit + 7y retention |
| Unauthorized sharing | Low | High | NPHIES only + MOH only + patient consent for portal |
| Insufficient consent | Low | High | Informed consent (snippet:consent-forms) |
| Data retention violation | Low | Medium | Auto-purge policy (7y) |
| Cross-border transfer | Medium | High | PHI-redacted only + tenant-controlled |
| Insider threat | Low | Critical | Audit + 2-person rule for admin actions |
| Ransomware | Low | Critical | Offsite backup + immutable + DR drill |

### 4. Measures to address risks

- **Technical:**
  - RLS + FORCE RLS on all tenant-scoped tables
  - TLS 1.2+ for transit
  - AES-256 at rest (selective PHI columns)
  - MFA for clinical roles
  - Hash-chained audit log
  - PHI redaction in LLM + logs
  - Quarterly pen test
  - Continuous monitoring + alerts
  - Offsite encrypted backup (7y retention)
  - DR drill quarterly

- **Organizational:**
  - P&Ps (P&P-PRIV-001, P&P-PRIV-002, etc.)
  - Training: PDPL, PHI handling, security
  - Incident response plan
  - DPO appointed
  - Annual review

- **Legal:**
  - PDPL-compliant consent forms
  - Data Processing Agreement (DPA) with vendors
  - Patient rights policy
  - Breach notification within 72h

### 5. Patient rights (PDPL)

- Right to be informed (privacy notice at registration)
- Right to access (portal + request workflow)
- Right to rectification (correction request)
- Right to erasure (per retention policy + legal hold)
- Right to restrict processing (where applicable)
- Right to data portability (FHIR export)
- Right to object (research only)
- Right to lodge complaint (PDPL authority)

### 6. DPO and contact

- DPO: appointed, contact dpo@nama-medical
- Privacy team: privacy@nama-medical
- Compliance: compliance@nama-medical

### 7. International transfer

- LLM (OpenAI, Anthropic): tenant-controlled, PHI-redacted only
- No raw patient data leaves KSA without explicit tenant opt-in
- DPA in place with each vendor
- Standard Contractual Clauses (SCCs) where applicable

### 8. Consent

- General: at registration (P&P-FORM-001)
- Procedure: per procedure (cath, device, surgery)
- Research: separate consent (de-identified)
- LLM co-pilot: opt-in (default off for patients)

### 9. Review

- Annual DPIA review
- Ad-hoc on major change
- On incident: post-incident DPIA update

### 10. Sign-off

- DPO: ___________ Date: ___________
- Privacy committee: ___________ Date: ___________
- Owner: ___________ Date: ___________
