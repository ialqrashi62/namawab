<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-008
name: "Peripheral Vascular Disease"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Peripheral Vascular Disease — CARD-008

## Mission
Peripheral arterial + venous disease: PAD, CLI, carotid, aortic, renal, mesenteric, DVT, varicose veins.

## Scope
Peripheral angiography, endovascular revascularization (PTA, stenting, atherectomy), carotid stenting, EVAR/TEVAR, DVT thrombolysis, varicose vein ablation, vascular access.

## Top 10 Conditions
1. PAD (I73.9) 2. CLI (I70.22) 3. Carotid stenosis (I65.21) 4. AAA (I71.4) 5. Renal artery stenosis (I70.1) 6. Mesenteric ischemia (K55.1) 7. DVT (I82.4) 8. PE (I26.9) 9. Varicose veins (I83.90) 10. Aortic dissection (I71.0)

## Top 20 Procedures
Peripheral angio 75710, PTA 75962, peripheral stent 75960, atherectomy 75962, IVL, carotid angio+stent 37215, EVAR 34703, TEVAR 33880, renal angio 36251, mesenteric angio 75726, DVT thrombolysis 37212, IVC filter 37191, varicose vein ablation 36475, sclerotherapy 36471, vein mapping 93971, ABI 93922, segmental pressures 93923, TCPO2 93965, wound care 97597, amputation 27880

## Red Flags
Acute limb ischemia (6 P's) · Ruptured AAA · Aortic dissection · Acute mesenteric ischemia · Massive PE · Symptomatic carotid stenosis (urgent CEA/stent) · Critical limb ischemia · Blue toe syndrome · Cholesterol embolization · Contrast-induced nephropathy

## Database: 6 tables, RLS-forced
## 12 endpoints
## 4 LangChain chains

## Compliance
JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. SVS guidelines. TASC II. ESVS.

## Engine: peripheral_vascular_engine.js
RutherfordClass, FontainStage, AnkleBrachialIndex, ABIToMortality, CarotidStenosisNASCET, EVARAnatomy, TEVARCoverage, DVTWellsScore, PERuleOut, AmputationLevel

## Sub-Departments
Vascular Lab, Hybrid OR, Vein Clinic, Wound Care

---
*L1 DRAFT complete.*