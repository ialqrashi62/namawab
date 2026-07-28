<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-009
name: "Advanced Heart Failure"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Advanced Heart Failure — CARD-009

## Mission
HFrEF/HFpEF management, GDMT, advanced therapies (LVAD, transplant eval, palliative).

## Scope
GDMT optimization (ARNI, beta-blocker, MRA, SGLT2i), device therapy (CRT, ICD), IV diuresis, inotropes, LVAD, transplant evaluation, palliative care, hospice.

## Top 10 Conditions
1. HFrEF (I50.22) 2. HFpEF (I50.32) 3. Cardiogenic shock (R57.0) 4. Acute decompensated HF (I50.23) 5. LVAD candidate (Z95.811) 6. Heart transplant eval (Z48.21) 7. Pulmonary HTN (I27.20) 8. Cardiac amyloidosis (E85.4) 9. Sarcoid cardiomyopathy (D86.85) 10. End-stage HF (I50.9)

## Top 20 Procedures
Echo 93306, RHC 93451, LHC 93454, BNP 83880, NT-proBNP, troponin, iron studies, IV diuresis, inotrope (dobutamine, milrinone), LVAD evaluation, RVAD, BiVAD, total artificial heart, IABP, Impella, VA-ECMO, transplant referral, palliative care consult, hospice referral, ICD/CRT implant

## Red Flags
Cardiogenic shock (SCAI stage C-E) · Inotrope dependence · LVAD complication (pump thrombosis, GI bleed, RV failure) · Cardiac transplant rejection · End-stage HF (INTERMACS 1-3) · Pulmonary HTN crisis · Cardiac amyloidosis with conduction disease · Refractory ventricular arrhythmia

## Database: 6 tables, RLS-forced
## 12 endpoints
## 5 LangChain chains

## Compliance
JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. ESC HF 2021. ACC/AHA HF 2022. ISHLT LVAD guidelines.

## Engine: advanced_hf_engine.js
GDMTHFrEFChecklist, SGLT2iIndication, LVADIntermacs, GDMTOptimization, PalliativeHFTrigger, ScaiShockStage, HFAHAStage, BNPTrend, LvefTrajectory, TransplantWaitlistPriority

## Sub-Departments
HF Clinic, LVAD Program, Transplant Coordination, Palliative Care

---
*L1 DRAFT complete.*