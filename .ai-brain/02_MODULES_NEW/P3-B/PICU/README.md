<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: PICU
name: "Pediatric Intensive Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Pediatric Intensive Care Unit — PICU

## Mission
Pediatric ICU: severe pediatric illness, post-op complex, congenital heart, sepsis, respiratory failure.

## Scope
Pediatric mechanical ventilation, vasopressors, CRRT, ECMO, post-op complex congenital heart, sepsis, status asthmaticus, status epilepticus, trauma (redirect to PED-ER), child life, family-centered rounds.

## Top 10 Conditions: 1. Pediatric respiratory failure (J96) 2. Pediatric sepsis (A41) 3. Post-op congenital heart (Z48.815) 4. Status epilepticus (R56.9) 5. Status asthmaticus (J45) 6. DKA (E10.10) 7. Severe bronchiolitis (J21) 8. Trauma (T07) 9. Acute abdomen (K35-K38) 10. Toxic ingestion (T50)
## Top 20 Procedures: Pediatric vent, vasopressor, inotrope, pediatric CRRT, pediatric ECMO, pediatric central line, pediatric arterial line, PALS protocols, Broselow tape, sedation (pediatric), analgesia (pediatric), antibiotics (pediatric), antipyretics, bronchodilator, antiepileptic, insulin, DKA protocol, child life, family presence, abuse screening, palliative care, bereavement, transfer to ward, transfer to chronic care
## Red Flags: Cardiac arrest · Refractory shock · Refractory hypoxia · Status epilepticus · Malignant hyperthermia · Tension PTX · Failed intubation · Withdrawal of care · Child abuse · Severe DKA (pH<7.0) · Anaphylaxis · Pulmonary hypertension crisis · Post-cardiac surgery low cardiac output
## Database: 9 tables, RLS-forced
## 18 endpoints, 5 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. PALS. AAP. ESPN. KSA pediatric ICU standards.

## Engine: picu_engine.js
PediatricApache, PediatricSofascore, BroselowWeight, PediatricSepsisRecognition, PediatricVentSettings, PediatricCrrt, PediatricEWS, ChildAbuseScreening, PediatricMortality, PediatricPalliative

## Sub-Departments: PICU Beds, Child Life, Family Lounge, School Program

---
*L1 DRAFT complete.*