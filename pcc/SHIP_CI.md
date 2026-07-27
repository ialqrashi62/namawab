# P3-CI Ship Report

**Version:** v3.47.0
**Modules:** 3 (pcc_lab_ext2, pcc_path_ext, pcc_rad_ext2)
**Tests:** +72 (30 unit + 42 integ) → **5055 total**
**Audit:** 222 PASS (was 219)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_lab_ext2 | /api/v1/pcc-lab-ext2/{list,call/:fn,record} | Comprehensive, Toxicology, Molecular, Banked, Convenience, Reference, PointOfCare, Quality, Turnaround, Critical |
| pcc_path_ext | /api/v1/pcc-path-ext/{list,call/:fn,record} | SpecimenType, Grossing, Embedding, Stain, Diagnosis, Margin, Stage, Grade, Tnm, Molecular |
| pcc_rad_ext2 | /api/v1/pcc-rad-ext2/{list,call/:fn,record} | Modality, BodyPart, Indication, Contrast, Urgency, Comparison, Dose, Pregnancy, Pediatric, Report |

## Server

- `pcc/server.js` v3.47.0, 224 modules wired
- 3 endpoints verified

## Audit

- 222/222 PASS

## Next: P3-CJ candidates

`pcc_icu_ext3`, `pcc_ed_ext2`, `pcc_ob_ext2`
