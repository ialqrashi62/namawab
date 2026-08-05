# PULM-001 — Pulmonology Department Blueprint

> **Generated:** 2026-08-01
> **Tier:** 1 (critical revenue + safety)
> **Owner:** CMO + AIE + SA + DSL + PM + CQO
> **Status:** ✅ shipped (60 files + README)
> **Mode:** MODE 2 — plan + blueprint

---

## 1. Coverage scope

- Pulmonology (general)
- Subspecialties covered:
  - Asthma + severe asthma
  - COPD
  - Pulmonary fibrosis / ILD
  - Pulmonary hypertension
  - Sleep medicine
  - Lung cancer (screening + diagnosis)
  - Bronchiectasis
  - Pleural disease
  - Occupational lung disease
  - Allergic pulmonology
  - Cystic fibrosis
  - Critical care pulmonology
  - Bronchoscopy + EBUS + thoracoscopy
  - Pulmonary rehabilitation

## 2. Pathway equivalents (vs global systems)

| Epic Module | NamaMedical ID |
|------------|----------------|
| EpicCare Pulmonology | PULM-001 |
| Cerner Pulmonology PowerPlan | PULM-001 order sets |
| MEDITECH Pulmonology Care Plan | PULM-001 care plan |

## 3. Top 10 conditions + 20 procedures

See `01_clinical_workflows.md`.

## 4. KPIs

- Door-to-inhaler (asthma severe): <30m
- 30-day COPD readmission: <5%
- Sleep study completion time: <14d
- Lung cancer screen adherence: >80%
- ILD-FVC progression rate tracked

## 5. Files

```
PULM-001/
├── 00_README.md         (this)
├── 01_clinical_workflows.md
├── 02_sub_dept_catalog.md
├── ...
└── 60_closeout.md
```

## 6. Acceptance

- ✅ 60/60 files
- ✅ All sections complete
- ✅ Compliance: CBAHI + NPHIES + PDPL + JCI mapped
- ✅ Tests stubs ready
- ✅ Mock data for seeding

## 7. Next steps

1. Run migration up
2. Verify seeds
3. Activate prompt registry entry
4. Add to AI orchestrator index
5. Smoke-test the API endpoints
6. Train staff (5-min office hours)
