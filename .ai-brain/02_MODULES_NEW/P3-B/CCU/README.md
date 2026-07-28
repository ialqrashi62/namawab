<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CCU
name: "Coronary Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Coronary Care Unit — CCU

## Mission
Coronary care: post-PCI, post-MI, cardiogenic shock, post-cardiac arrest, arrhythmia management.

## Scope
Post-PCI monitoring, post-MI care (STEMI/NSTEMI), cardiogenic shock (Impella, IABP, VA-ECMO), post-cardiac arrest (targeted temperature management), arrhythmia (VT storm, AF), temporary pacing, cardiac arrest response, pulmonary edema, hypertensive emergency.

## Top 10 Conditions: 1. Post-PCI (Z95.5) 2. STEMI post-PCI (I21) 3. NSTEMI (I21.4) 4. Cardiogenic shock (R57.0) 5. Post-cardiac arrest (I46.9) 6. VT storm (I47.2) 7. AF rapid vent (I48.91) 8. Acute heart failure (I50.23) 9. Hypertensive emergency (I16.1) 10. Post-TAVR (Z95.2)
## Top 20 Procedures: 12-lead ECG, continuous rhythm monitor, telemetry, troponin q3-6h, BNP, BMP, CBC, coags, TTE, RHC, IABP 33967, Impella 33990, VA-ECMO 33946, temporary pacing 33210, cardioversion 92960, defibrillation 92961, pericardiocentesis 33016, central line, arterial line, PA cath, inotrope (dobutamine, milrinone, norepinephrine), vasopressor, TTM (targeted temperature management), beta blocker, ACE-i/ARB/ARNI, aldosterone antagonist, SGLT2i, statin, antiplatelet (DAPT), anticoagulation, intubation, sedation
## Red Flags: Recurrent STEMI (stent thrombosis) · Cardiogenic shock (SCAI stage C-E) · VT storm · Post-PCI bleeding (BARC 3-5) · Acute LV failure · Mechanical complications (papillary muscle rupture, VSR, free wall) · Pericarditis (Dressler) · Aortic dissection · Cardiac tamponade · Cardiac arrest · Failed cardioversion · IABP/Impella malfunction
## Database: 9 tables, RLS-forced
## 18 endpoints, 5 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. ACC/AHA NSTE-ACS 2024, STEMI 2023. SCAI 2023 Shock Consensus. ESC 2021 ACS.

## Engine: ccu_engine.js
GRACEInHospitalMortality, TIMI_30day, SCAI_Shock_Stage, DAP_30day, BleedingRisk, MCSIndication, TTMEligibility, ArrhythmiaRecognition, IABPTroubleshooting, ImpellaTroubleshooting

## Sub-Departments: CCU Beds, Cath Lab, EP Lab, MCS Coordination

---
*L1 DRAFT complete.*