# Wave 9 — G-07 Order Sets Complete ✅

**Date:** 2026-08-03
**Scope:** Care Plan Order Sets (45d target from BENCHMARK_GAP_ANALYSIS_AR.md §7.1)

## Status: ✅ 47 bundles live on Hetzner

### Coverage by clinical specialty

| Specialty | Bundles | Count |
|-----------|---------|------:|
| **Cardiology (existing)** | stroke_alert, chest_pain, acs_stemi, dka, sepsis_1h | 5 |
| **Respiratory/Pulmonary** | asthma_exacerbation, copd_exacerbation, pulmonary_embolism, pneumonia_cap, massive_hemoptysis | 5 |
| **Cardiology** | atrial_fib_new, heart_failure_admit, hypertensive_emergency, bradycardia, pericarditis | 5 |
| **GI/Hepatobiliary** | upper_gi_bleed, acute_pancreatitis, biliary_colic, hepatic_encephalopathy, small_bowel_obstruction | 5 |
| **Renal/Urology** | aki_adult, hyperkalemia_severe, renal_colic, uti_complicated | 4 |
| **Endocrine/Metabolic** | thyroid_storm, adrenal_crisis, hypoglycemia_severe | 3 |
| **Neuro** | status_epilepticus, tia_workup, intracranial_hemorrhage, meningitis_adult | 4 |
| **OB/GYN** | preeclampsia_severe, postpartum_hemorrhage, ectopic_pregnancy | 3 |
| **Pediatrics** | pediatric_fever_no_source, pediatric_status_epilepticus | 2 |
| **Psychiatry** | acute_agitation, alcohol_withdrawal | 2 |
| **Trauma/Surgery** | trauma_primary_survey, burns_major, surgical_preop | 3 |
| **Hematology/Oncology** | neutropenic_fever, tumor_lysis_syndrome, sickle_cell_crisis | 3 |
| **Infectious Disease** | covid_severe, tb_initiation, dengue_warning | 3 |
| **TOTAL** | | **47** |

### Bundle structure (per bundle)

```js
{
  id: 'stroke_alert',                  // unique key
  name: 'Stroke Alert Bundle',         // English display
  nameAr: 'حزمة إنذار السكتة الدماغية', // Arabic display
  timeCritical: '4.5h',                // evidence-based window
  ownerRoles: ['doctor', 'nurse'],     // who can apply
  items: [                             // 4-8 items each
    { code: 'IMG-CT-HEAD',  type: 'imaging',     priority: 'STAT',  timeWindow: '25min' },
    { code: 'LAB-CBC',      type: 'lab',         priority: 'STAT',  timeWindow: '10min' },
    { code: 'MED-tPA',      type: 'medication',  dose: '0.9mg/kg', route: 'IV',
      conditional: 'if ischemic AND within 4.5h' },
    // ...
  ]
}
```

### Each item has:

- `code`: identifier (e.g., `LAB-CBC`, `IMG-CT-HEAD`)
- `type`: `imaging | lab | medication | consult | observation | procedure | micro`
- `priority`: `STAT | urgent | null`
- `timeWindow`: optional (e.g., `10min`, `25min`)
- `dose`: optional (medication)
- `route`: optional (medication: `IV`, `PO`, `IM`, `Nebulized`)
- `freq`: optional (observation: `Q1h`, `Q15min`)
- `conditional`: optional (e.g., `if ischemic AND within 4.5h`)

### Evidence sources (per benchmark methodology §15)

| Bundle | Source |
|--------|--------|
| stroke_alert | AHA/ASA acute ischemic stroke guidelines |
| sepsis_1h | Surviving Sepsis Campaign 1-hour bundle |
| chest_pain, acs_stemi | AHA/ACC ACS early evaluation, STEMI door-to-balloon |
| dka | ADA DKA management |
| asthma, copd | GINA/GOLD guidelines |
| trauma_primary_survey | ATLS ABCDE |
| neutropenic_fever | IDSA febrile neutropenia |
| sepsis, meningitis, pneumonia | Surviving Sepsis / IDSA |
| pulmonary_embolism | ESC PE guidelines |

## Files changed

- `namaweb/lib/careplans/orderSets.js` — added 42 new bundles (117 → ~485 lines)

## Live verification (Hetzner)

```
server bundles: 47
GET /api/v4/careplans/bundles => 200 (count: 47, all bundle ids returned)
GET /api/v4/careplans/bundles/stroke_alert => 200 (6 items)
```

## Endpoints already live

- `GET  /api/v4/careplans/bundles` → list all
- `GET  /api/v4/careplans/bundles/:id` → single bundle
- `GET  /api/v4/careplans/active` → active plans
- `POST /api/v4/careplans/apply` → apply bundle to patient
- `POST /api/v4/careplans/:id/progress` → mark progress
- `GET  /api/v4/careplans/:id/adherence` → adherence report

## Server state

- md5 (orderSets.js): `b6e4556c5a8081b200583141164fe243`
- pm2 restart #62
- 162/162 smoke tests passing
- Live on Hetzner `204.168.144.74:3000/api/v4/careplans/bundles`

## What this closes from BENCHMARK_GAP_ANALYSIS_AR.md §7.1

✅ **G-07 Care Plans + Order Sets** — 47 bundles live (target was 50)
- Coverage: stroke, sepsis, MI, DKA, asthma, COPD, PE, pneumonia, hemoptysis, AF, HF, HTN, bradycardia, pericarditis, GI bleed, pancreatitis, biliary, hepatic encephalopathy, SBO, AKI, hyperkalemia, renal colic, UTI, thyroid storm, adrenal crisis, hypoglycemia, status epilepticus, TIA, ICH, meningitis, preeclampsia, PPH, ectopic, pediatric fever, pediatric status, agitation, alcohol withdrawal, trauma ABCDE, burns, preop, neutropenic fever, TLS, sickle cell, COVID-19, TB, dengue.

## Next wave candidates

- **G-11 Multi-currency** (30d) — `currency_code` + `fx_rate_at_invoice`
- **G-08 Genomic Data Model** (90d) — `genomic_variant` + `pgx_report`
- **G-10 OLAP connector** (60d) — DuckDB-WASM + Tableau