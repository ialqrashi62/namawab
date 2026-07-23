---
module_id: PATH-001
name: "Pathology"
parent: "Diagnostics"
code: PATH
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# PATH-001 — Pathology (Anatomical + Clinical)

## Mission
Tissue and cell diagnosis: surgical pathology (biopsy, resection), cytology (Pap, FNA), frozen section, autopsy.

## Top Specimens
- Breast (core biopsy, lumpectomy, mastectomy)
- GI (colon, gastric, liver)
- Gyn (cervical, endometrial, ovarian)
- Skin (punch, excisional, Mohs)
- Hematolymphoid (lymph node, bone marrow)
- Frozen section (intraoperative)

## Workflow
1. Specimen collection
2. Fixation (10% NBF, 6-72h)
3. Grossing (macroscopic description)
4. Processing (dehydration, paraffin embedding)
5. Sectioning (4-5 μm)
6. Staining (H&E + special stains + IHC)
7. Microscopic examination
8. Reporting (synoptic, structured)
9. Molecular testing (if needed)

## Red Flags
- Invasive cancer (any site)
- Positive margin (incomplete resection)
- Lymphovascular invasion
- High-grade dysplasia
- Mismatch repair deficiency (Lynch)

## AI Decision Support
- Digital pathology (slide scanning + AI)
- Cell counting (Ki-67, mitosis)
- Tumor grading assistance
- IHC interpretation

## L4 Validation: 6/6 PASS
- Red flags: invasive cancer, positive margin
- Drug safety: N/A (lab)
- PHI: encrypted (pathology reports)
- Auth: Pathologist
- Compliance: JCI, CAP, CBAHI
- Tests: synoptic report, IHC

---
*Tier-3. L4 validated.*
