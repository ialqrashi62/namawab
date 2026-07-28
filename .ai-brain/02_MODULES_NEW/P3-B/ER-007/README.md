<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: ER-007
name: "Pediatric Emergency"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Pediatric Emergency — ER-007

## Mission
Pediatric emergency: ESI 1-5, age-appropriate vitals, family-centered care, child life, transfer to Peds trauma/PICU/NICU.

## Scope
Pediatric triage (age-adjusted vitals), pediatric resuscitation (Broselow tape), pediatric RSI, pediatric trauma (age-adjusted), pediatric sepsis, child life services, family presence, transfer to subspecialty peds center.

## Top 10 Conditions: 1. Fever (R50.9) 2. Bronchiolitis (J21) 3. Croup (J05.0) 4. Asthma exacerbation (J45) 5. Pediatric sepsis (A41) 6. Pediatric trauma (T07) 7. Pediatric seizure (R56.9) 8. Dehydration (E86.0) 9. Foreign body aspiration (T17) 10. Intussusception (K56.1)
## Top 20 Procedures: Pediatric triage, pediatric RSI, Broselow tape, age-adjusted vitals, pediatric intubation, pediatric IV access (intraosseous), pediatric sepsis bundle, bronchodilator (albuterol), racemic epinephrine, steroids (dexamethasone), antipyretics (acetaminophen, ibuprofen), rehydration (PO/NG/IV), antibiotics, antiemetics, child life, family presence, transfer coordination, abuse screening, suicide screening (12+), restraint protocol, sedation (ketamine, etomidate)
## Red Flags: Pediatric sepsis (qSOFA-peds) · Status epilepticus · Severe asthma (silent chest) · Croup with stridor at rest · Severe dehydration · Anaphylaxis · Foreign body aspiration · Non-accidental trauma · SIDS (apparent life-threatening event) · Acute abdomen (intussusception, appendicitis) · DKA · Severe trauma
## Database: 6 tables, RLS-forced
## 12 endpoints, 3 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. PALS guidelines. AAP. WHO IMCI. KSA pediatrics standards.

## Engine: peds_er_engine.js
PediatricSEWS, PediatricGCS, BroselowWeightEstimate, PediatricSepsisRecognition, PediatricAsthmaSeverity, PediatricDehydrationScore, PediatricPainScale, ChildAbuseScreening, PediatricVitalPercentile, ResuscitationDoseCalculation

## Sub-Departments: Peds ER, Child Life, Family Waiting

---
*L1 DRAFT complete.*