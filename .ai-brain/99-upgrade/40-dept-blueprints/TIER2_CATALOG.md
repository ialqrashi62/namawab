# Tier-2 Catalog (40 depts × 40 files)

> **Date:** 2026-08-01
> **Owner:** ORC
> **Status:** ACTIVE batch

---

## Subspecialty composition

### Internal Medicine subspecialties (12 depts)

```yaml
internal_subspecs:
  - { id: CARD-101, name: Interventional Cardiology, files: 40, status: planned }
  - { id: CARD-102, name: Electrophysiology,         files: 40, status: planned }
  - { id: CARD-103, name: Preventive Cardiology,      files: 40, status: planned }
  - { id: CARD-104, name: Nuclear Cardiology,         files: 40, status: planned }
  - { id: CARD-105, name: Cardio-Obstetrics,          files: 40, status: planned }
  - { id: CARD-106, name: Heart Failure Clinic,       files: 40, status: planned }
  - { id: PULM-101, name: Allergic Pulmonology,        files: 40, status: planned }
  - { id: PULM-102, name: Sleep Medicine,              files: 40, status: planned }
  - { id: PULM-103, name: Respiratory Care,            files: 40, status: planned }
  - { id: PULM-104, name: Bronchoscopy Suite,          files: 40, status: planned }
  - { id: GI-101,   name: Advanced Endoscopy (EUS/ERCP/Enteroscopy), files: 40, status: planned }
  - { id: GI-102,   name: Hepatology,                  files: 40, status: planned }
```

### Surgical subspecialties (8 depts)

```yaml
surgical_subspecs:
  - { id: SURG-101, name: Bariatric Surgery,           files: 40, status: planned }
  - { id: SURG-102, name: Vascular Surgery,           files: 40, status: planned }
  - { id: SURG-103, name: Trauma Surgery,             files: 40, status: planned }
  - { id: NEURO-101, name: Functional Neurosurgery,    files: 40, status: planned }
  - { id: NEURO-102, name: Cerebrovascular Neurosurgery, files: 40, status: planned }
  - { id: ORTHO-101, name: Spine Surgery,              files: 40, status: planned }
  - { id: ORTHO-102, name: Sports Medicine,            files: 40, status: planned }
  - { id: ENT-101,  name: Voice & Swallowing,          files: 40, status: planned }
```

### Pediatric subspecialties (10 depts)

```yaml
peds_subspecs:
  - { id: PEDS-101, name: Neonatology (NICU),          files: 40, status: planned }
  - { id: PEDS-102, name: Pediatric Genetics,         files: 40, status: planned }
  - { id: PEDS-103, name: Pediatric Nutrition,        files: 40, status: planned }
  - { id: PEDS-104, name: Developmental Pediatrics,    files: 40, status: planned }
  - { id: PEDS-105, name: Pediatric Cardiology,        files: 40, status: planned }
  - { id: PEDS-106, name: Pediatric Nephrology,        files: 40, status: planned }
  - { id: PEDS-107, name: Pediatric Gastroenterology,  files: 40, status: planned }
  - { id: PEDS-108, name: Pediatric HemOnc,            files: 40, status: planned }
  - { id: PEDS-109, name: Pediatric Surgery,           files: 40, status: planned }
  - { id: PEDS-110, name: Pediatric Pulmonology,       files: 40, status: planned }
```

### OBGYN subspecialties (5 depts)

```yaml
obg_subspecs:
  - { id: OBG-101, name: Maternal-Fetal Medicine (MFM), files: 40, status: planned }
  - { id: OBG-102, name: Reproductive Endocrinology / IVF, files: 40, status: planned }
  - { id: OBG-103, name: Urogynecology,                files: 40, status: planned }
  - { id: OBG-104, name: Gynecologic Oncology,         files: 40, status: planned }
  - { id: OBG-105, name: Menopause Clinic,             files: 40, status: planned }
```

### Diagnostics & Functional Tests (5 depts)

```yaml
diagnostics_subspecs:
  - { id: RAD-101,  name: Interventional Radiology,    files: 40, status: planned }
  - { id: RAD-102,  name: Body MRI,                    files: 40, status: planned }
  - { id: LAB-101,  name: Microbiology,                files: 40, status: planned }
  - { id: LAB-102,  name: Blood Bank Transfusion Medicine, files: 40, status: planned }
  - { id: FCT-101,  name: Pulmonary Function Lab,      files: 40, status: planned }
```

**Total Tier-2**: 40 depts × 40 files = **1,600 files** (~360K tokens, 2-3 sessions).

---

## Per-dept file map (Tier-2, 40 files each, reduced vs Tier-1)

```
01 clinical_workflows.md
02 sub_dept_catalog.md
03 icd10_snomed_map.md
04 clinical_red_flags.md
05 prompt_engineering.md
06 system_prompt.md
07 langchain_chains.md
08 rag_chains.md
09 vector_store_schema.md
10 llm_prompts.md
11 engine_module.md
12 routes_api.md
13 middleware_chain.md
14 data_flow.md
15 erd_diagram.md
16 openapi_spec.md
17 dbml_schema.md
18 migration_up.sql
19 migration_down.sql
20 seed_data.sql
21 stitch_layout.md
22 wireframes.md
23 i18n_keys.md
24 design_tokens.md
25 user_stories.md
26 acceptance_criteria.md
27 business_flow.md
28 api_rbac_defense_in_depth.md
29 security_plan.md
30 deployment_runbook.md
31 ci_cd_pipeline.md
32 monitoring_alerting.md
33 jci_checklist.md
34 pdpl_dpia.md
35 nphies_zatca_map.md
36 consent_forms.md
37 audit_trail_design.md
38 unit_tests.md
39 integration_tests.md
40 closeout.md
```

---

## Acceptance

- [ ] All 40 files per dept (no truncation)
- [ ] Schema-first (S1); id reference (S3); templated (S4)
- [ ] All safety rails preserved (13 rails)
- [ ] Migration up + down (non-destructive)
- [ ] Seed PHI-free
- [ ] Tests stubs present

---

*ORC — 2026-08-01 — AUTOPILOT batch — running unattended*
