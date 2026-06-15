# NamaMedical — Enterprise Risk Register

> Reviewed quarterly by CMO + CTO + CISO + CFO. Likelihood × Impact = Inherent;
> after controls = Residual. Both 1–5; score = product (1–25).

## Heatmap convention
- 1–5 Low, 6–10 Moderate, 11–15 High, 16–25 Critical.

---

## R1. Patient safety from AI mis-recommendation
- Domain: Clinical / AI
- Likelihood 4 × Impact 5 = **Inherent 20 (Critical)**
- Controls: advisory-only banner, self-critique gate, human-in-loop for safety-critical,
  ≥0.7 confidence threshold, golden-snapshot tests ≥0.92, monthly clinical audit.
- Residual: 2 × 5 = **10 (Moderate)**
- Owner: CMO + AI Lead

## R2. PHI breach via prompt injection / LLM leak
- Domain: Security / Privacy
- Likelihood 3 × Impact 5 = **15 (High)**
- Controls: PHI redactor, DLP gateway, prompt-anchoring, output classifier,
  KSA-region inference, no-PHI cache, 72-h breach playbook.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: CISO + DPO

## R3. Ransomware on hospital infrastructure
- Domain: Security / Operations
- Likelihood 3 × Impact 5 = **15 (High)**
- Controls: immutable backups (30 d), EDR, network segmentation, MFA, IR playbook,
  quarterly tabletop, offline DR copy.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: CISO + COO

## R4. Lab/Pharmacy/Radiology integration failure (HL7/FHIR/DICOM)
- Domain: Integration / Operations
- Likelihood 4 × Impact 4 = **16 (Critical)**
- Controls: contract tests (Pact), IHE conformance suite, dead-letter queues,
  fallback to paper-runner, vendor SLA penalties, chaos drills.
- Residual: 2 × 3 = **6 (Moderate)**
- Owner: Integration Architect

## R5. CBAHI accreditation lapse
- Domain: Compliance / Reputation
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: continuous CBAHI gap scanner, evidence binder, mock surveys quarterly,
  CAPA tracker, leadership KPI.
- Residual: 1 × 4 = **4 (Low)**
- Owner: CMO + Quality Director

## R6. Pediatric/neonatal medication dose error
- Domain: Clinical / Safety
- Likelihood 3 × Impact 5 = **15 (High)**
- Controls: weight-based guard everywhere, max-dose check, pharmacist+nurse 2-witness,
  barcode scan, 100% unit-test coverage on dose-calc paths.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: CNO + Pharmacy Director

## R7. Maternity/IVF reproductive data exposure
- Domain: Privacy / Ethics
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: extra-strict access scopes, separate audit trail, ovum/sperm/embryo
  consent registry, IVF disposition rules per KSA law, encrypted blob store.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: OB-GYN Lead + DPO

## R8. Imaging AI false negative on STEMI / Stroke / LVO / Cancer
- Domain: Clinical / AI
- Likelihood 3 × Impact 5 = **15 (High)**
- Controls: clinician-overread mandatory, dual-read for cancer screening,
  performance monitoring + drift detection, cohort revalidation quarterly.
- Residual: 2 × 4 = **8 (Moderate)**
- Owner: Radiology Lead + AI Lead

## R9. Dialysis/ICU device telemetry tampering
- Domain: Security / Safety
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: signed telemetry, tamper-evident storage, biomed PM schedule,
  segmented OT VLAN, anomaly detection.
- Residual: 1 × 4 = **4 (Low)**
- Owner: CISO + Biomed

## R10. ZATCA e-invoice rejection / billing reconciliation
- Domain: Finance / Compliance
- Likelihood 3 × Impact 4 = **12 (High)**
- Controls: pre-submission validation, sandbox QA, retry queue, daily reconciliation,
  certified solution provider relationship.
- Residual: 1 × 3 = **3 (Low)**
- Owner: CFO

## R11. Saudization / SCFHS license expiry blocks practice
- Domain: HR / Compliance
- Likelihood 3 × Impact 3 = **9 (Moderate)**
- Controls: license expiry tracker (60-day notice), HR/credentialing workflow,
  KPI on Saudization quota.
- Residual: 1 × 3 = **3 (Low)**
- Owner: CHRO + Credentialing

## R12. Pandemic / mass casualty surge overwhelms capacity
- Domain: Operations / Public Health
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: surge plan G34, ICU/ED scalability runbook, mutual aid agreements,
  PPE stockpile, drills.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: COO + ED/ICU leads

## R13. Vendor lock-in (PACS, LIS, LLM provider)
- Domain: Strategy / Architecture
- Likelihood 4 × Impact 3 = **12 (High)**
- Controls: standards (DICOM/FHIR/HL7), abstraction layers, dual-vendor strategy,
  exit clauses in contracts.
- Residual: 2 × 2 = **4 (Low)**
- Owner: CTO

## R14. Insider threat (credential abuse, data exfil)
- Domain: Security / HR
- Likelihood 3 × Impact 4 = **12 (High)**
- Controls: ABAC/RBAC, session recording, UEBA in SIEM, periodic access review,
  separation of duties, exit checklist.
- Residual: 1 × 4 = **4 (Low)**
- Owner: CISO + CHRO

## R15. AI hallucination on rare-disease guidance
- Domain: Clinical / AI
- Likelihood 3 × Impact 4 = **12 (High)**
- Controls: rare-disease curated KB only, mandatory escalation for G40, citations
  required, refusal patterns when KB empty.
- Residual: 1 × 4 = **4 (Low)**
- Owner: AI Lead + G40 leads

## R16. Cross-border data transfer breaches PDPL
- Domain: Privacy / Legal
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: KSA-region only by default; explicit safeguards + DPO sign-off for
  exceptions; egress allow-list.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: DPO

## R17. Workforce burnout from over-alerting
- Domain: HR / Clinical UX
- Likelihood 4 × Impact 3 = **12 (High)**
- Controls: alert fatigue review monthly, tiered alerts, snooze with escalation,
  UX research with end users.
- Residual: 2 × 3 = **6 (Moderate)**
- Owner: CMO + UX Lead

## R18. Donor consent breach (cornea/blood/organ/sperm/oocyte)
- Domain: Ethics / Legal
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: consent registry, scope+revocation tracking, ethics committee oversight,
  legal review on policy change.
- Residual: 1 × 4 = **4 (Low)**
- Owner: Ethics + Legal

## R19. Failed disaster recovery test
- Domain: Operations / Resilience
- Likelihood 2 × Impact 5 = **10 (Moderate)**
- Controls: quarterly DR drills with measured RTO/RPO, documented runbooks,
  warm standby in second region.
- Residual: 1 × 5 = **5 (Low–Moderate)**
- Owner: CTO + Platform

## R20. Brand/PR damage from medical-error or media incident
- Domain: Reputation
- Likelihood 2 × Impact 4 = **8 (Moderate)**
- Controls: PR plan, spokesperson designated, media training, incident-comm playbook.
- Residual: 1 × 3 = **3 (Low)**
- Owner: Comms + CEO

---

## Priority queue (next 90 days)
1. R4 (integration failure) — implement contract tests + chaos drill
2. R6 (peds dose error) — finalize 100% test coverage gate
3. R10 (ZATCA) — full reconciliation tooling
4. R8 (imaging AI FN) — drift monitor live
5. R17 (alert fatigue) — alert review + UX session
