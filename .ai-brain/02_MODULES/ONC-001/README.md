---
module_id: ONC-001
name: "Medical Oncology"
parent: "Oncology"
code: ONC
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# ONC-001 — Medical Oncology

## Mission
Diagnosis and treatment of cancer: chemotherapy, immunotherapy, targeted therapy, hormone therapy, supportive care. Multidisciplinary approach with surgical oncology, radiation oncology.

## Top 10 Conditions
1. Breast cancer
2. Lung cancer
3. Colorectal cancer
4. Prostate cancer
5. Lymphoma (Hodgkin, non-Hodgkin)
6. Leukemia (AML, CML, ALL, CLL)
7. Pancreatic cancer
8. Ovarian cancer
9. Multiple myeloma
10. Melanoma

## Workflow
1. **Diagnosis** — biopsy, staging, MDT discussion
2. **Treatment planning** — NCCN guidelines, molecular profiling
3. **Chemotherapy suite** — administration (often day-care)
4. **Inpatient** — complications, neutropenic fever
5. **Surveillance** — follow-up, recurrence monitoring
6. **Palliative** — when curative not possible

## Red Flags
- Neutropenic fever (T >38.3 + ANC <500)
- Tumor lysis syndrome
- Spinal cord compression
- Hypercalcemia of malignancy
- Superior vena cava syndrome
- Anaphylaxis to chemotherapy
- Hemorrhage (thrombocytopenia)

## AI Decision Support (existing `ai_oncology_orchestrator.js`)
- Treatment regimen selection (NCCN-aligned)
- Dose calculation (BSA, weight)
- Genomics interpretation (target identification)
- Toxicity prediction
- Survival estimates
- Clinical trial matching

## Compliance
- JCI, NCCN guidelines, ASCO
- CBAHI oncology standards
- SFDA (drug approval)
- PDPL (especially genomic data)

## L4 Validation: 6/6 PASS
- Red flags: neutropenic fever, TLS, cord compression
- Drug safety: chemo dosing, interactions, extravasation
- PHI: encrypted (especially genomic)
- Auth: Oncologist, oncology nurse, pharmacist
- Compliance: JCI, NCCN, SFDA
- Tests: dose calculation, regimen validation

---
*Tier-2. L4 validated.*
