---
module_id: CARD-001
name: "Cardiology"
parent: "Internal Medicine"
code: CARD
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# CARD-001 — Cardiology

## Mission
Diagnosis and treatment of cardiovascular disease: coronary artery disease, heart failure, arrhythmias, valvular disease, hypertension, lipid disorders, congenital heart disease. Includes invasive and non-invasive procedures.

## Top 10 Conditions (CMO)
1. ACS / STEMI / NSTEMI
2. Heart failure (HFrEF, HFpEF)
3. Atrial fibrillation
4. Hypertension
5. Valvular heart disease
6. Cardiomyopathy
7. Pulmonary embolism
8. Pericarditis
9. Endocarditis
10. Aortic dissection

## Workflow
1. **Clinic** — initial assessment, ECG, echo, stress test
2. **Cath lab** — diagnostic cath, PCI, structural interventions
3. **CCU** — acute MI, cardiogenic shock, post-arrest
4. **Inpatient consults** — pre-op clearance, chest pain
5. **Outpatient follow-up** — chronic disease management

## Red Flags
- STEMI (ST elevation in 2+ contiguous leads) → code STEMI
- Cardiogenic shock (SBP<90, signs of hypoperfusion)
- Ventricular tachycardia
- Aortic dissection
- Acute pulmonary embolism with hemodynamic instability

## AI Decision Support (existing `ai_cardiology_orchestrator.js`)
- ECG interpretation (STEMI detection)
- Heart failure risk prediction
- CHA₂DS₂-VASc / HAS-BLED scoring
- Troponin trend analysis
- Echo interpretation (limited)
- Risk stratification (TIMI, GRACE, ASCVD)

## Compliance
- JCI (COP.3 Emergency, MMU), ACC/AHA guidelines, ESC
- CBAHI cardiology standards
- PDPL + NPHIES

## L4 Validation: 6/6 PASS
- Red flags: STEMI, dissection, shock
- Drug safety: anticoag + antiplatelet interactions
- PHI: encrypted
- Auth: Cardiologist, cath lab team
- Compliance: JCI, ACC/AHA
- Tests: ECG interpretation, risk scores

---
*Tier-2. L4 validated.*
