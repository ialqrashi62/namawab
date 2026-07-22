# Phase 3 — Full Department Coverage Workplan

> **Scope:** Roll out the 7-Expert Panel system across 88 dept workstreams (64 dept groups + 15 centers + 12 rare + Stitch designs)
> **Method:** AUTOPILOT + LOOP ENGINEERING + token-saver skills + multi-agent batch
> **Date:** 2026-07-22
> **Prerequisite:** Phase 2E2 closed (clinical calculators live on Hetzner 2026-07-22)

---

## 0. The 11-Step Autopilot Loop (per workstream)

```
[1] Plan        →  classify A/B/C (existing cluster vs partial vs greenfield)
[2] CMO input   →  clinical scope (1 turn, max 10 lines)
[3] AI input    →  RAG strategy (1 turn, max 10 lines)
[4] Arch input  →  ERD + OpenAPI + RBAC (1 turn, max 10 lines)
[5] DevOps      →  security + deploy constraints (1 turn, max 5 lines)
[6] PM/UX       →  Stitch wireframe + Gherkin (1 turn, max 10 lines)
[7] Compliance  →  standards + KPIs (1 turn, max 5 lines)
[8] Master Orch →  synthesize → 12-43 artifacts in .ai-brain/
[9] Test        →  unit + integration + e2e stubs
[10] Verify     →  node --check + npm run test:safe + smoke e2e
[11] Commit     →  local commit (push waits for owner)
```

## 1. Token-Saver Skills Loaded at Session Start

| Skill | Purpose |
|---|---|
| `nm-ai-brain-token-saver` | Cached facts: skip re-discovery |
| `nm-ai-brain-multi-agent` | Split large dept lists across 5 sub-agents |
| `nm-ai-brain-loop-engineering` | Plan → Code → Test → Verify per dept |
| `nm-ai-brain-autopilot` | 11-step pipeline |
| `nm-ai-brain-department-generator` | Scaffold 6-doc set in 1 turn |
| `nm-ai-brain-frontend-bridge` | Stitch HTML → React/Vanilla JS |
| `snippets.md` (shared) | 13 reusable paragraph blocks |

## 2. The 11 Batches (autopilot rollout)

### Batch 0 — Pre-flight (1 turn)
- Load canonical references once.
- Read `APP_AUDIT_AND_GAP_ANALYSIS_2026-07-22.md`.
- Confirm batch list with user.
- Output: 0 tokens (pure discovery).

### Batch 1 — Internal Medicine Subspecialties (9 depts)
| # | Dept | Status | Cluster | Workspace gap |
|---|---|---|---|---|
| 1.1 | Cardiology (interventional, EP, preventive, nuclear, cardio-obstetrics, cath lab, PVD, heart failure) | A (cluster) | cardiology.dbml | 7 sub-unit workspaces |
| 1.2 | Pulmonology (allergic, sleep, resp care, bronchoscopy, home O2) | A | pulmonology.dbml | 5 sub-unit workspaces + new sleep-station |
| 1.3 | Gastroenterology (advanced endo, pancreato-biliary, motility, nutrition) | A | gastro_hepato.dbml | 4 sub-unit workspaces |
| 1.4 | Nephrology (plasmapheresis) | A | nephrology.dbml | 1 sub-unit |
| 1.5 | Oncology (cord blood, gynecologic onc) | A | hemato_oncology.dbml | 2 sub-unit workspaces |
| 1.6 | Endocrinology (Type 1, GDM, diabetic foot) | A | endocrine_diabetes.dbml | 3 sub-unit workspaces |
| 1.7 | Rheumatology (allergy-asthma) | A | rheum_immunology.dbml | 1 sub-unit |
| 1.8 | Dermatology (dermatologic onc, phototherapy) | A | dermatology.dbml | 2 sub-unit |
| 1.9 | Infectious Diseases (antimicrobial, travel, vaccination) | A | infectious_diseases.dbml | 3 sub-unit |

**Output:** 9 × 34 = 306 docs in `.ai-brain/internal_medicine/<dept>/`. 9 Stitch designs. ~60K tokens via multi-agent (5 sub-agents).

### Batch 2 — Surgical Subspecialties (8 depts)
| # | Dept | Sub-units to add |
|---|---|---|
| 2.1 | General Surgery (robotic, bariatric, breast, trauma, colorectal, endocrine, surgical-onc) | 7 sub-unit workspaces |
| 2.2 | Cardiothoracic (already complete) | 0 |
| 2.3 | Neurosurgery (skull base, endoscopic neuro) | 2 sub-unit |
| 2.4 | Orthopedics (pediatric ortho) | 1 sub-unit |
| 2.5 | Ophthalmology (specific pediatric) | 1 sub-unit |
| 2.6 | ENT (already complete) | 0 |
| 2.7 | Urology (already complete) | 0 |
| 2.8 | Plastic & Burns (Burn ICU sub-flag) | 1 sub-unit |

**Output:** 8 × 34 = 272 docs. ~50K tokens.

### Batch 3 — OBGYN & Pediatrics (3 dept groups, deep expansion)
| # | Dept | Sub-units to add |
|---|---|---|
| 3.1 | OB/GYN (reproductive endo, IVF, adolescent, menopause, cosmetic gyn) | 5 sub-unit workspaces + new `ivf-station` + new `fetal-medicine-station` |
| 3.2 | Pediatrics (genetics, nutrition, developmental) | 3 sub-unit + new `childrens-hospital-station` |
| 3.3 | Pediatric subspecialties (12) | 12 sub-unit workspaces (each as child workspace under pediatric-station) |

**Output:** 3 × 34 = 102 docs + 3 Stitch designs. ~30K tokens.

### Batch 4 — Diagnostics (3 dept groups)
| # | Dept | Sub-units to add |
|---|---|---|
| 4.1 | Radiology (already complete at station level; sub-types need worktrees) | 0 |
| 4.2 | Lab (already complete) | 0 |
| 4.3 | Functional Diagnostics (already complete) | 0 |

**Output:** only need to add 3 new RAG chunksets. ~10K tokens.

### Batch 5 — Critical Care (3 dept groups)
| # | Dept | Sub-units to add |
|---|---|---|
| 5.1 | ER (hyper/hypothermia, obs unit, minor surgery ER) | 3 sub-unit |
| 5.2 | ICU (transplant ICU sub-flag) | 1 sub-unit |
| 5.3 | Anesthesia (already complete) | 0 |

**Output:** 3 × 34 = 102 docs. ~20K tokens.

### Batch 6 — Therapeutic & Rehab (3 dept groups)
| # | Dept | Sub-units to add |
|---|---|---|
| 6.1 | Rehabilitation (standalone: PT + OT + Speech + SCI + Prosthetics) | 5 sub-unit + new `rehab-station` |
| 6.2 | Radiation Oncology + Pharmacy (already mostly complete) | 1 sub-unit (radioisotope therapy) |
| 6.3 | Integrative Medicine (already complete in `.ai-brain/INTEGRATIVE_MEDICINE/`) | 0 |

**Output:** 2 × 34 = 68 docs + 2 Stitch designs. ~15K tokens.

### Batch 7 — Support Services (5 dept groups, currently 0 stations)
| # | Dept | New station? |
|---|---|---|
| 7.1 | Nursing (already in legacy station; subspecialty workspaces) | 14 sub-unit workspaces (no new station) |
| 7.2 | Nutrition (Clinical Nutrition + Central Kitchen) | new `nutrition-station` |
| 7.3 | Social Work / Patient Advocacy | new `social-station` |
| 7.4 | Logistics & Technical (Biomed + HIS + Translation + Stats + Comms) | new `his-station` |
| 7.5 | Security & Safety (Security + OHS + Disaster) | new `safety-station` |

**Output:** 5 × 34 = 170 docs + 4 Stitch designs. ~40K tokens.

### Batch 8 — Admin & Academic (4 dept groups, currently 0 stations)
| # | Dept | New station? |
|---|---|---|
| 8.1 | Executive (CEO/CMO/CNO/CFO/COO + councils) | new `admin-station` |
| 8.2 | Quality & Accreditation (JCI/CBAHI/CAP/ISO) | new `quality-station` |
| 8.3 | Education & Research (Internship/Residency/Fellowship/CME/Research/IRB) | new `research-station` |
| 8.4 | HR & Admin (Medical HR + Training + Legal + PR + Call Center) | new `hr-station` |

**Output:** 4 × 34 = 136 docs + 4 Stitch designs. ~30K tokens.

### Batch 9 — Centers of Excellence (15 unified dashboards)
Each center is a unified view that aggregates 3-5 dept stations. Build as a `centers-station` with 15 sub-tabs.

| # | Center | Aggregates depts |
|---|---|---|
| 9.1 | Heart & Vascular Center | cardiology + CTS + vascular |
| 9.2 | Comprehensive Cancer Center | oncology + hem + BMT + rad onc + pharmacy |
| 9.3 | Orthopedic & Spine Center | ortho + neurosurgery-spine + rehab |
| 9.4 | Advanced Fertility Center | OB-GYN + IVF + andrology |
| 9.5 | ENT & Head-Neck Center | ENT + dental + maxillofacial |
| 9.6 | Trauma Center | ER + trauma surg + ortho-trauma + neurosurgery-trauma |
| 9.7 | Burn Center | plastic + burn ICU + rehab |
| 9.8 | Transplant Center | nephro + CTS + gastro-hepato + BMT |
| 9.9 | Geriatric Center | internal med + rehab + psych |
| 9.10 | Pain Center | anesthesia-pain + neurosurgery + rehab |
| 9.11 | Bariatric & Metabolic Center | endo + gastro + surgery-bariatric |
| 9.12 | Children's Hospital | peds + NICU + PICU + all peds sub-specs |
| 9.13 | Behavioral Health Center | psych + addiction + geri-psych |
| 9.14 | Eye Institute | ophth + oculoplastics + peds-ophth |
| 9.15 | Neuroscience & Stroke Center | neuro + neurosurgery + rehab + stroke unit |

**Output:** 15 unified dashboards (1 per center) + 1 `centers-station` (host). 15 × 8 = 120 docs (lighter per-center). 15 Stitch designs. ~30K tokens.

### Batch 10 — Rare & Super-Specialized (12 deep specs)
| # | Dept | Engine? |
|---|---|---|
| 10.1 | Space & Dive Medicine | new `space_medicine.js` |
| 10.2 | Sleep Disorders Center (Polysomnography) | new `sleep_study.js` (consolidated with batch 1.2) |
| 10.3 | Epilepsy Monitoring Unit | new `epilepsy_em.js` |
| 10.4 | Advanced Stem Cell Therapy | new `stem_cell.js` |
| 10.5 | Fetal Surgery | new `fetal_surgery.js` |
| 10.6 | Fetal Medicine Unit (consolidated with batch 3.1) | new `fetal_medicine.js` |
| 10.7 | Deep Brain Stimulation (DBS) | extension to `neurosurgery_engine` |
| 10.8 | Nuclear Medicine Therapy | extension to `lis.js` |
| 10.9 | Cryotherapy / Cryosurgery | new `cryo_unit.js` |
| 10.10 | Confocal Laser Endomicroscopy | new `endomicro_engine.js` |
| 10.11 | Pharmacogenomics | new `pharmacogenomics.js` |
| 10.12 | Nanomedicine & Microrobotics | new `nanomedicine_engine.js` |

**Output:** 12 × 34 = 408 docs. 8 new engines. ~80K tokens.

### Batch 11 — Integration (1 turn)
1. Update `.ai-brain/INDEX.md` with all 88 workstreams.
2. Update `.ai-brain/DEPARTMENT_COVERAGE_MAP.md` to 100%.
3. Generate `.ai-brain/WORKFLOW_SCENARIOS_BY_GROUP.md`.
4. Generate `.ai-brain/STATION_MATCHER_REPORT.md`.
5. Generate `.ai-brain/SUPER_MASTER_PROMPT_v3.md` (next iteration).
6. Commit locally; await owner push authorization.

---

## 3. Token Budget Estimate

| Batch | Docs | Tokens |
|---|---|---|
| 0 | 0 | 0 (cached) |
| 1 | 306 | ~60K |
| 2 | 272 | ~50K |
| 3 | 102 | ~30K |
| 4 | 9 | ~10K |
| 5 | 102 | ~20K |
| 6 | 68 | ~15K |
| 7 | 170 | ~40K |
| 8 | 136 | ~30K |
| 9 | 120 | ~30K |
| 10 | 408 | ~80K |
| 11 | 5 | ~5K |
| **TOTAL** | **~1,700 docs** | **~370K tokens** |

With token-saver skills + multi-agent batching, we estimate **~150K effective tokens** (60% reduction).

---

## 4. Acceptance Criteria for Phase 3

- [ ] 88 dept workstreams in `.ai-brain/<group>/<dept>/` (34 files each).
- [ ] 88 Stitch HTML designs in `.stitch_designs/` or attached to `04_ux_ui_stitch.md`.
- [ ] 8-15 new engines added to `namaweb/` (per the engines-needed list).
- [ ] 5 new DBML clusters appended to `docs/erd/` (for the missing 5 sub-specs).
- [ ] 5 new OpenAPI fragments appended to `docs/openapi/`.
- [ ] 15 net-new migrations (e70-e84) executed on staging (after owner approval).
- [ ] All 88 depts have RAG chunking + VectorMine hooks + LangChain chain.
- [ ] LLM observability wired (LangFuse or equivalent).
- [ ] Token cost tracking dashboard live.
- [ ] All 13 safety rails preserved.
- [ ] 88 NAV_ITEMS added (75 → 163).
- [ ] Stations count: 30 → 100+ (each sub-unit workspace).
- [ ] Unit + integration + e2e tests: 69 → 500+.

---

## 5. Checkpoints (owner approval gates)

After each batch (1-10), deliver a batch closeout report. Wait for owner
approval before starting the next batch. Never auto-roll into the next batch.

---

End of workplan.
