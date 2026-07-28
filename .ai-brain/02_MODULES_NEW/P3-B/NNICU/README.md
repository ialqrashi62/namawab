<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: NNICU
name: "Neonatal Intensive Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Neonatal Intensive Care Unit — NNICU

## Mission
NICU: premature neonate, RDS, neonatal sepsis, congenital anomalies, post-delivery resuscitation, therapeutic hypothermia.

## Scope
Premature NICU (Level II-IV), mechanical ventilation (conventional + HFOV), CPAP/NIPPV, surfactant, neonatal sepsis workup, TPN, phototherapy, therapeutic hypothermia (HIE), congenital diaphragmatic hernia (CDH), NEC, ROP screening, transfer to chronic NICU.

## Top 10 Conditions: 1. Premature (P07) 2. RDS (P22.0) 3. Neonatal sepsis (P36) 4. HIE (P91.6) 5. NEC (P77) 6. CDH (Q79.0) 7. TTN (P22.1) 8. Meconium aspiration (P24.0) 9. Congenital heart (Q20-Q28) 10. Hyperbilirubinemia (P59)
## Top 20 Procedures: Neonatal resuscitation (NRP), CPAP, NIPPV, conventional vent, HFOV, iNO, surfactant (Curosurf, Survanta), neonatal central line (UVC, UAC, PICC), peripheral IV, fluid resuscitation, TPN, phototherapy, exchange transfusion, therapeutic hypothermia, caffeine for apnea, diuretic, antibiotics, antifungal, antiviral, ROP screening exam, hearing screen, metabolic screen, car seat test, immunization (Hep B), family support, lactation support, transfer to step-down, transfer to chronic NICU
## Red Flags: Cardiac arrest · Persistent pulmonary hypertension · Tension PTX · Pneumothorax · NEC with perforation · Intestinal perforation · Severe IVH (grade 3-4) · Periventricular leukomalacia · Sepsis with shock · Apnea · Bradycardia · Desaturation · Failed intubation · Meconium aspiration syndrome · Persistent pneumothorax
## Database: 10 tables, RLS-forced
## 20 endpoints, 5 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. NRP. AAP. ESPN. KSA neonatal standards.

## Engine: nnicu_engine.js
ApgarScore, BallardScore, NeonatalVentSettings, SurfactantDosing, TherapeuticHypothermiaEligibility, ROPStage, IVHGrade, NECStage, PhototherapyThreshold, NeonatalSepsisScore

## Sub-Departments: NICU Beds, Lactation, Family Room, Transport Team

---
*L1 DRAFT complete.*