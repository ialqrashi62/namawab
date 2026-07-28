<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: NEPH-004
name: "Pediatric Dialysis"
parent: "Nephrology"
code: NEPH
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Pediatric Dialysis — NEPH-004

## Mission
Pediatric dialysis: PD (preferred in <5y), HD, CRRT, growth/nutrition, transition to adult.

## Scope
Pediatric PD (CAPD/APD), pediatric HD, CRRT, growth/development monitoring, school liaison, transition to adult services at 18y.

## Top 10 Conditions: 1. ESRD pediatric (N18.6) 2. CAKUT (Q60) 3. FSGS pediatric (N04.1) 4. Nephrotic syndrome (N04.9) 5. Cystinosis (E72.0) 6. Polycystic kidney disease childhood (Q61) 7. Hemolytic uremic syndrome (D59.3) 8. AKI pediatric (N17) 9. Renal tubular acidosis (N39.8) 10. Gitelman syndrome (N15.8)
## Top 20 Procedures: Pediatric PD 90945, pediatric HD 90935, PD catheter pediatric 49421, growth monitoring, nutrition support, EPO for pediatric, calcitriol, growth hormone 29495, transition planning 99420, school accommodations, family counseling, social work, child life, pediatric palliative care, school visit, vaccination (HepB, flu, pneumococcal), 24h urine protein, growth chart plotting, Tanner staging, bone age, neurodevelopment
## Red Flags: Peritonitis (cloudy effluent) · PD catheter exit site infection · Vascular access thrombosis · Growth failure · Hypertension emergency · Hyperkalemia · Uremia · Seizures · Cardiac arrest (electrolyte) · Pericardial effusion · Transition failure
## Database: 6 tables, RLS-forced
## 12 endpoints, 3 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. KDIGO pediatric. ESPN. IPNA. UNICEF child rights.

## Engine: pediatric_dialysis_engine.js
PediatricKtVTarget, GrowthZScore, PDPeritonitisDiagnosis, PediatricHTNPercentile, VaccinationStatusPediatric, TransitionReadinessScore, PediatricEPO Dosing, RenalBoneAgeAssessment, PediatricDialysisAccess, NeurodevelopmentMilestones

## Sub-Departments: Pediatric PD, Pediatric HD, Child Life, School Program, Transition Clinic

---
*L1 DRAFT complete.*