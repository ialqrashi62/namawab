---
module_id: PULM-001
name: "Pulmonology"
parent: "Internal Medicine"
code: PULM
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# PULM-001 — Pulmonology

## Mission
Respiratory disease: asthma, COPD, pneumonia, TB, ILD, lung cancer, sleep disorders, respiratory failure. Includes bronchoscopy, PFT, sleep studies.

## Top 10 Conditions
1. Asthma exacerbation
2. COPD exacerbation
3. Community-acquired pneumonia
4. Pulmonary tuberculosis
5. Lung cancer
6. Interstitial lung disease
7. Pulmonary embolism
8. Obstructive sleep apnea
9. Pleural effusion
10. Pneumothorax

## Workflow
1. **Clinic** — assessment, PFT, imaging
2. **Bronchoscopy suite** — diagnostic + therapeutic
3. **PFT lab** — spirometry, DLCO, lung volumes
4. **Sleep lab** — polysomnography
5. **Inpatient consults** — respiratory failure, post-op

## Red Flags
- Acute respiratory failure (SpO2<88, hypercapnia)
- Tension pneumothorax
- Massive hemoptysis (>200mL/24h)
- Severe asthma (silent chest, PEF<33%)
- Status asthmaticus

## AI Decision Support
- Chest X-ray interpretation (consolidation, effusion, pneumothorax)
- PFT interpretation (obstructive vs restrictive)
- TB screening (clinical + CXR + IGRA)
- Sleep study scoring
- Polysomnography (apnea-hypopnea index)

## Compliance
- JCI, ATS/ERS guidelines, GOLD (COPD), GINA (asthma)
- CBAHI pulmonology standards
- MOH TB program

## L4 Validation: 6/6 PASS
- Red flags: respiratory failure, tension PTX, hemoptysis
- Drug safety: inhaler technique, antibiotic stewardship
- PHI: encrypted
- Auth: Pulmonologist, RT
- Compliance: JCI, GOLD, GINA
- Tests: PFT, bronchoscopy, sleep study

---
*Tier-2. L4 validated.*
