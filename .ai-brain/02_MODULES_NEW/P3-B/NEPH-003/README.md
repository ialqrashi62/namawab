<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: NEPH-003
name: "Dialysis (HD/PD/Home/Plasmapheresis)"
parent: "Nephrology"
code: NEPH
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Dialysis (HD/PD/Home/Plasmapheresis) — NEPH-003

## Mission
Comprehensive dialysis: in-center HD, home HD, PD (CAPD/APD), CRRT, plasmapheresis, HDF.

## Scope
In-center HD 3x/week, home HD training, PD catheter insertion (Tenckhoff), CAPD/APD, CRRT (CVVH, CVVHD, CVVHDF), TPE for antibody-mediated disease, HDF, dialysis water treatment, anemia management (ESAs), bone disease (CKD-MBD).

## Top 10 Conditions: 1. ESRD on HD (N18.6) 2. ESRD on PD (N18.6) 3. AKI on CRRT (N17) 4. Hyperkalemia (E87.5) 5. Metabolic acidosis (E87.2) 6. Uremia (N19) 7. Volume overload (E87.7) 8. CKD-MBD (N25.0) 9. Renal anemia (D63.1) 10. TTP/HUS (M31.1/D59.3)
## Top 20 Procedures: HD 90935, home HD training 90989, PD catheter insertion 49421, PD training 90945, CAPD 90947, APD 90947, CRRT CVVH 90945, CRRT CVVHD 90945, CRRT CVVHDF 90945, plasmapheresis 36514, HDF 90935, dialysis adequacy (Kt/V) measurement, anemia management (epoetin alfa J0881, darbepoetin J0882), iron sucrose J1756, parathyroidectomy 60500, paricalcitol (Zemplar), sevelamer, lanthanum, cinacalcet 90935, AV fistula creation 36818, AV graft 36820
## Red Flags: Hyperkalemia (K>6.5) · Uremic pericarditis · Uremic encephalopathy · Vascular access bleeding · Dialysis disequilibrium · Air embolism (HD) · Hemolysis (HD) · CRRT circuit clotting · PD peritonitis · Exit site infection (PD) · Catheter-related bacteremia · AV fistula thrombosis
## Database: 10 tables, RLS-forced
## 20 endpoints, 4 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. KDIGO 2020. KDOQI. AAMI/ANSI water quality. CMS conditions for coverage.

## Engine: dialysis_engine.js
KtVCalculator, URRPercent, AnemiaHgbTrend, CKD_MBDEvaluation, CRRTCircuitLife, PDPeritonitisScore, AVFistulaMaturation, HomeHDTrainingReadiness, TPEPlasmaVolume, DialysisAdequacyTarget

## Sub-Departments: In-Center HD Unit, Home HD Training, PD Clinic, CRRT (ICU), Apheresis Unit, Vascular Access

---
*L1 DRAFT complete.*