<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-007
name: "Cardiac Catheterization Lab (Specialized)"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Cardiac Catheterization Lab (Specialized) — CARD-007

## Mission
Specialized cath procedures: complex PCI (CHIP), chronic total occlusion (CTO), bifurcation, left main, vein graft, atherectomy (rotational, orbital, intravascular lithotripsy), intravascular imaging (IVUS, OCT, NIRS).

## Scope
CTO-PCI (antegrade + retrograde), bifurcation (provisional + 2-stent), left main PCI, vein graft PCI, rotational/orbital atherectomy, IVL, IVUS/OCT/NIRS, hemodynamic support (IABP, Impella, VA-ECMO), coronary perforation repair.

## Top 10 Conditions
1. CTO (I25.82) 2. Bifurcation lesion (I25.83) 3. Left main disease (I25.81) 4. Vein graft disease (I25.710) 5. Heavily calcified (I25.84) 6. In-stent restenosis (I25.71) 7. Peri-procedural MI (I21.A) 8. Coronary perforation (I25.83) 9. Cardiogenic shock (R57.0) 10. No-reflow (I25.85)

## Top 20 Procedures
CTO-PCI 92928+modifier, retrograde CTO 92928, rotablation 92996, orbital atherectomy 92997, IVL 92928+modifier, IVUS 92978, OCT 92978 alt, NIRS-IVUS, FFR 93571, iFR 93571 alt, bifurcation DK crush, Culotte, T-stenting, provisional 92928, vein graft PCI 92928, IABP 33967, Impella 33990, VA-ECMO 33946, covered stent 92928+modifier, coil embolization 37204, pericardiocentesis 33016

## Red Flags
Coronary perforation (Ellis III) · Cardiac tamponade · Stent thrombosis · No-reflow · Dissection (NHLBI D-F) · Side branch loss · Distal embolization · Wire entrapment · Contrast extravasation · Cardiogenic shock · Aortic dissection · Stroke (cath-induced)

## Database: 7 tables, RLS-forced
## 14 endpoints
## 5 LangChain chains

## Compliance
JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. SCAI 2021 best practices. CTO-PCI consensus 2019.

## Engine: cath_lab_specialized_engine.js
CTOScoreJCTO, SyntaxScore, CalciumScoreIVUS, FFRiFRAnalysis, BifurcationMedina, PerforationEllis, RotablationBurr, IVLDelivery, NoReflowPredict, CoronaryDissectionType

## Sub-Departments
CTO Suite, CHIP Suite, Hybrid OR, IVUS/OCT Cart

---
*L1 DRAFT complete.*