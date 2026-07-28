# PCC Sandbox State — v3.41.0 (P3-CC complete)

**Last updated:** 2026-07-25
**Status:** ✅ P3-CC SHIPPED — 206 modules, 4623 tests, 204 audit PASS

---

## Headline

- **Sandbox:** `c:\Users\ice\Desktop\NMEDCALVSCODE\pcc\`
- **Server:** Node.js + Express on port 3101, v3.41.0
- **Modules wired:** 206 (was 203)
- **Tests passing:** 4623 / 4623 (was 4551)
- **Audit modules:** 204 / 204 PASS (was 201)
- **v3.41.0 ENTERPRISE READY** ✅

---

## P3-CC new modules (decision+dx+drug)

- **pcc_decision** — Triage, Risk, Recommendation, Differential, Path, Severity, Outcome, FollowUp, Test, Therapy (10 funcs)
- **pcc_clinical_dx** — Differential, Workup, Imaging, Lab, Consult, Spec, FollowUp, Disposition, Pathway, Alert (10 funcs)
- **pcc_drug** — Dose, Interaction, Allergy, Renal, Hepatic, Level, Pregnancy, Route, Frequency, Duration (10 funcs)

## Routes mounted (v3.41.0)

- `GET  /api/v1/pcc-decision/list`  → 10 functions
- `GET  /api/v1/pcc-clinical-dx/list`  → 10 functions
- `GET  /api/v1/pcc-drug/list`  → 10 functions

## Next candidates (P3-CD)

pcc_imaging, pcc_emergency, pcc_infection, pcc_quality, pcc_research, pcc_education
