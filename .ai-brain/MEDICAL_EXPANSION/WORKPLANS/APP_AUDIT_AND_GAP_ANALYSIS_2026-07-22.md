# NamaMedical — Application Audit & Department Coverage Map

> **Date:** 2026-07-22
> **Scope:** All 38 departments / 100+ sub-units from the master clinical list
> **Method:** Static code audit + manifest comparison + station ↔ dept cross-ref
> **Status:** Phase 2E2 closed (clinical calculators live). Phase 3 (full coverage) planning.

---

## 1. Executive Summary

| Metric | Current | Target (master list) | Gap |
|---|---|---|---|
| **Stations** | 30 (28 specialized + 2 legacy) | 100+ (every dept + sub-unit) | 70+ sub-units missing |
| **NAV_ITEMS** | 75 (NAV indices 1-75) | 175+ (every dept) | 100+ entries missing |
| **Clinical engines** | 18 (Phase 2E2) + 4 (EWS/ICU/OB/PATH) + 4 (specialty scores) + 11 (finance) + 11 (insurance) + 16 (inventory) + 18 (HR) | 50+ (1 per dept family) | 5-10 net-new engines needed |
| **DB clusters (ERD)** | 39 cluster DBMLs | 39 + 5 new (centers of excellence) | 5 new clusters |
| **OpenAPI specs** | 39 cluster .yaml | 39 + 5 new | 5 new specs |
| **Migrations** | 161+ (eN_*, pN_*, exN_*) | 175+ (e70-e84 planned) | 15 net-new planned |
| **.ai-brain files** | 1023 .md (already) | ~3000+ (34 per dept × 88 depts) | 2000+ net-new |
| **Stitch designs** | 0 (only inline 3-col CSS) | 88 (1 per dept) | 88 net-new |

**Verdict:** Phase 1-2 (core platform + 28 stations + clinical calculators) is live.
Phase 3 (full department coverage + AI orchestration + Stitch design system) is the
target. Master plan below.

---

## 2. Stations Inventory (30 → Target 100+)

### A. Existing Stations (30) — MAPPED to master list

| # | Station | Maps to master list dept | Sub-units covered | Sub-units missing |
|---|---|---|---|---|
| 1 | `cardiology-station` | ✅ ق. طب القلب العام + التداخلي | 2/9 | 7 (Electrophysiology, Preventive, Nuclear, Cardio-Obstetrics, Cath Lab, Peripheral, Heart Failure) |
| 2 | `pulmonology-station` | ✅ ق. طب الصدر | 1/6 | 5 (Allergic Pulm, Sleep, Respiratory Care, Bronchoscopy, Home O2) |
| 3 | `gastro-station` | ✅ ق. الجهاز الهضمي + الكبد | 2/7 | 5 (Advanced Endo, Pancreato-Biliary, Motility, Clinical Nutrition) |
| 4 | `nephrology-station` | ✅ ق. طب الكلى + زراعة + غسيل | 4/5 | 1 (Plasmapheresis) |
| 5 | `oncology-station` | ✅ ق. الأورام + أمراض الدم + BMT | 3/5 | 2 (Cord Blood, Gynecologic Onc) |
| 6 | `endocrine-station` | ✅ ق. الغدد الصماء + السكري | 2/5 | 3 (Type 1 unit, GDM, Diabetic Foot) |
| 7 | `rheuma-station` | ✅ ق. الروماتيزم + المناعة + الحساسية | 3/4 | 1 (Allergy & Asthma) |
| 8 | `derm-station` | ✅ ق. الجلدية + التجميل + الجراحية | 3/5 | 2 (Dermatologic Onc, Phototherapy) |
| 9 | `infectious-station` | ✅ ق. الأمراض المعدية + الوقاية + الحميات | 3/6 | 3 (Antimicrobial, Travel, Vaccination) |
| 10 | `surgery-station` | ✅ ق. الجراحة العامة + الأورام + الغدد + السمنة + الثدي + Trauma + القولون | 7/8 | 1 (Robotic + Minimal Invasive) |
| 11 | `cardiothoracic-station` | ✅ ق. جراحة القلب والصدر | 3/3 | 0 ✅ (Open Heart, Thoracic, Airway) |
| 12 | `neurosurgery-station` | ✅ ق. جراحة المخ + الأعصاب + العمود الفقري | 6/8 | 2 (Skull Base, Endoscopic Neurosurgery) |
| 13 | `orthopedics-station` | ✅ ق. العظام + المفاصل + الرياضة + أورام | 8/9 | 1 (Pediatric Ortho) |
| 14 | `ophthalmology-station` | ✅ ق. العيون + الشبكية + القرنية + المياه + التجميل + الأطفال + العصبي + الانكسار | 8/9 | 1 (specific pediatric sub-unit) |
| 15 | `ent-station` | ✅ ق. الأنف والأذن + الرأس والرقبة + الجيوب + السمع + الحنجرة + الدرقية + النوم | 7/7 | 0 ✅ |
| 16 | `urology-station` | ✅ ق. المسالك + المناظير + الأورام + الأطفال + الذكورة + Urodynamics + الترميم | 7/7 | 0 ✅ |
| 17 | `plastic-surgery-station` | ✅ ق. التجميل + الحروق + الوجه والفكين | 3/3 | 0 ✅ (but burns ICU is separate) |
| 18 | `obgyn-peds-station` | ✅ ق. النساء + الأم والجنين + أطفال | 3/8 | 5 (Reproductive Endo, IVF, Adolescent, Menopause, Cosmetic Gyn) |
| 19 | `radiology-station` | ✅ ق. الأشعة + التداخلية + CT + MRI + US + Nuclear | 6/6 | 0 ✅ (covered, but advanced sub-types loose) |
| 20 | `lab-station` | ✅ ق. الباثولوجيا + الأحياء + الكيمياء + المناعة + الوراثة + السموم + بنك الدم | 7/7 | 0 ✅ |
| 21 | `diagnostics-station` | ✅ ق. الفحوصات الوظيفية (ECG, PFT, EMG, EEG) | 5/5 | 0 ✅ |
| 22 | `er-station` | ✅ ق. الطوارئ (8 sub-units) | 8/11 | 3 (Hyper/Hypothermia, Obs Unit, Minor Surgery ER) |
| 23 | `icu-station` | ✅ ق. العناية المركزة (12 sub-units) | 12/13 | 1 (Transplant ICU sub-specialty flag) |
| 24 | `anesthesia-station` | ✅ ق. التخدير + الألم + PACU + HBOT | 4/4 | 0 ✅ |
| 25 | `pacu-station` | ✅ (sub of anesthesia) | 1/1 | 0 ✅ |
| 26 | `nicu-station` | ✅ ق. حديثي الولادة (NICU + Nursery + Follow-up) | 3/3 | 0 ✅ |
| 27 | `functional-tests-station` | ✅ (sub of diagnostics) | 1/1 | 0 ✅ |
| 28 | `critical-station` | ✅ (ICU/SCU combined view) | 1/1 | 0 ✅ |
| 29 | `doctor-station` (legacy) | n/a (master view) | n/a | n/a |
| 30 | `nursing-station` (legacy) | n/a (master view) | n/a | n/a |

### B. Departments WITHOUT dedicated station (need new)

| Dept group | Sub-units | Priority |
|---|---|---|
| Sleep Medicine (standalone) | Polysomnography, Sleep Surgery | P1 |
| Bariatric / Metabolic Center | Medical + Surgical | P1 |
| Fetal Medicine | 4D US, Amniocentesis, CVS, Fetal Surgery | P1 |
| Reproductive Endocrinology & IVF | ICSI, IMSI, PGD, Cryo bank | P1 |
| Pain Center (interventional) | RF Ablation, SCS, Intrathecal Pumps | P1 |
| Heart Failure Advanced (LVAD, Transplant) | dedicated unit | P1 |
| Burn ICU | (extension of plastic-surgery + ICU) | P1 |
| Transplant Center (multi-organ) | Kidney, Liver, Heart, BMT | P1 |
| Trauma Center Level I/II | dedicated workflow | P1 |
| Stroke Center | Code Stroke pathway | P1 |
| Women's Health (standalone) | OB + Gyn + Reproductive | P2 |
| Children's Hospital (within hospital) | all pediatric subspecialties unified | P2 |
| Geriatric Center | falls, dementia, polypharmacy | P2 |
| Behavioral Health | Psych ER, Inpatient, OP | P2 |
| Wound Care & Hyperbaric | HBOT + wound clinic | P2 |
| Rehabilitation (standalone) | PT + OT + Speech + SCI + Prosthetics | P2 |
| Nutrition Services (standalone) | Clinical Nutrition + Kitchen | P2 |
| Pharmacy (standalone) | 6 sub-units | P2 |
| Social Work / Patient Advocacy | 4 sub-units | P2 |
| Health IT (HIS) | EMR + PACS + Cyber | P3 |
| Biomedical Engineering | 4 sub-units | P3 |
| Medical Statistics & Analytics | Big Data + Epidemic Forecasting | P3 |
| Telemedicine | Teleradiology + Teleconsult | P3 |
| Security (medical) | 3 sub-units | P3 |
| Occupational Health & Safety | 3 sub-units | P3 |
| Disaster Management | 3 sub-units | P3 |
| Executive (CEO/CMO/CNO/CFO/COO) | 7 sub-units | P3 |
| Quality & Accreditation (JCI/CBAHI/CAP/ISO) | 6 sub-units | P3 |
| Medical Education (Internship/Residency/Fellowship/CME) | 5 sub-units | P3 |
| Research Center (CTU/IRB/Biostatistics/Publications) | 6 sub-units | P3 |
| Medical Library | digital + physical | P3 |
| Simulation Center | 3 sub-units (OR, ER, OB/Peds) | P3 |
| Medical HR | 3 sub-units | P3 |
| Training & Development | n/a | P3 |
| Legal Affairs | n/a | P3 |
| Public Relations | Media + Community | P3 |
| Call Center | n/a | P3 |
| **Centers of Excellence (15)** | Heart, Cancer, Ortho, Fertility, ENT, Trauma, Burn, Transplant, Geriatric, Pain, Bariatric, Children's, Behavioral, Eye, Neuro/Stroke, Women/Fetal | P1 (unified view) |
| **Rare & Super-Specialized (12)** | Space, Sleep, Epilepsy, Stem Cell, Fetal Surgery, Fetal Medicine, DBS, Nuclear Therapy, Cryo, Confocal, Pharmacogenomics, Nano | P3 |

### C. Sub-unit count summary

| Category | Departments in master list | Sub-units | Stations present | Stations missing |
|---|---|---|---|---|
| Internal Medicine (groups 1-9) | 9 groups | ~45 sub-units | 9 stations | ~36 sub-unit workspaces |
| Surgical (groups 10-17) | 8 groups | ~50 sub-units | 8 stations | ~42 sub-unit workspaces |
| OBGYN & Peds (18-20) | 3 groups | ~30 sub-units | 2 stations | ~28 sub-unit workspaces |
| Diagnostics (21-23) | 3 groups | ~30 sub-units | 3 stations | ~27 sub-unit workspaces |
| Critical Care (24-26) | 3 groups | ~28 sub-units | 4 stations | ~24 sub-unit workspaces |
| Therapeutic (27-29) | 3 groups | ~25 sub-units | 1 station (rehab partial) | ~24 sub-unit workspaces |
| Support (30-34) | 5 groups | ~30 sub-units | 0 stations | ~30 sub-unit workspaces |
| Admin & Academic (35-38) | 4 groups | ~25 sub-units | 0 stations | ~25 sub-unit workspaces |
| Centers of Excellence (15) | 15 | 15 (each = unified view) | 0 dedicated | 15 unified dashboards |
| Rare & Super-Specialized (12) | 12 | 12 deep sub-specs | 0 | 12 workspaces |
| **TOTAL** | **64 dept groups** | **~290 sub-units** | **30 stations** | **~260 sub-unit workspaces** |

---

## 3. Engines Inventory (18 + ~70 = ~88)

### A. Clinical engines (live, 18)

`clinical_calculators.js`: tbsaRuleOfNines, parklandFormula, apgarTotal, gcsTotal, aldreteTotal, esiLevel, iolSrkt, childPugh, meld, cha2ds2vasc, hasBled, curb65, qsofa, wellsDvt, centor, romScore, ewsTotal, cpbTimer (all on `/api/calculators`).

### B. Engines present in code (live, ~14)

| Engine | File | Status |
|---|---|---|
| `ews_engine.js` | EWS scoring | ✅ live |
| `icu_scoring.js` | ICU multi-score | ✅ live |
| `ob_engine.js` | OB partograph + delivery | ✅ live |
| `pathology_engine.js` | Lab accession + flag | ✅ live |
| `esi_engine.js` | ER triage | ✅ live (also in calculators) |
| `specialty_scores.js` | multi-specialty | ✅ live |
| `nursing_scores.js` | nursing | ✅ live |
| `lis.js` | lab LIS | ✅ live |
| `bloodbank_compat.js` | blood bank | ✅ live |
| `obgyn_peds_wave3_engine.js` | OB/Peds wave 3 | ✅ live |
| `surgical_wave2_engine.js` | surgical wave 2 | ✅ live |
| `diagnostics_wave4_engine.js` | diagnostics wave 4 | ✅ live |
| `critical_care_wave5_engine.js` | critical care wave 5 | ✅ live |
| `rare_specialized_engine.js` | rare | ✅ live |
| `internal_medicine_wave1_engine*.js` | internal medicine wave 1 | ✅ live |
| `e10_finance_engine.js` | finance | ✅ live |
| `e11_insurance_engine.js` | NPHIES insurance | ✅ live |
| `e16_inventory_engine.js` | inventory | ✅ live |
| `e18_hr_engine.js` | HR | ✅ live |
| `cds.js` | clinical decision support | ✅ live |

### C. Engines needed (net-new, ~10-15)

| Engine | Maps to dept | Notes |
|---|---|---|
| `fetal_monitoring.js` | OB Fetal Medicine | CTG, biophysical profile, Doppler |
| `ivf_lab.js` | Reproductive Endo & IVF | Stimulation protocols, embryo grading |
| `sleep_study.js` | Sleep Medicine | Polysomnography, AHI, MSLT |
| `lvad_heart_failure.js` | Advanced Heart Failure | LVAD, transplant listing |
| `interventional_pain.js` | Pain Center | Procedure coding, opioid stewardship |
| `rehab_assessment.js` | Rehabilitation | FIM, Barthel, modified Rankin |
| `trauma_score.js` | Trauma Center | ISS, RTS, TRISS |
| `stroke_scale.js` | Stroke Center | NIHSS, ASPECTS, mRS |
| `pharmacy_stewardship.js` | Pharmacy | TDM, antimicrobial stewardship |
| `nutrition_assessment.js` | Nutrition | MUST, SGA, caloric targets |
| `transplant_coordinator.js` | Transplant Center | UNOS/Eurotransplant scoring |
| `wound_care.js` | Wound Care | Bates-Jensen, push tool |
| `telemedicine.js` | Telemedicine | Triage, store-and-forward |
| `disaster_mgmt.js` | Disaster Mgmt | Mass casualty triage (START, SALT) |
| `clinical_research.js` | Research Center | CTMS, IRB submissions, eCRF |

---

## 4. Database Coverage (39 ERD clusters)

| Cluster DBML | Departments |
|---|---|
| `cardiology.dbml` | cardiology + 4 sub |
| `cts_vascular_surgery.dbml` | cardiothoracic + vascular |
| `neurosurgery_spine.dbml` | neuro + spine |
| `orthopedics.dbml` | ortho + 8 sub |
| `ophthalmology.dbml` | ophth + 8 sub |
| `ent.dbml` | ENT + 7 sub |
| `urology.dbml` | urology + 7 sub |
| `plastic_burns.dbml` | plastic + burns |
| `general_surgery.dbml` | general + 7 sub |
| `gastro_hepato.dbml` | gastro + hepato + 6 sub |
| `pulmonology.dbml` | pulmonology + 6 sub |
| `nephrology.dbml` | nephro + 5 sub |
| `hemato_oncology.dbml` | onco + hem + BMT |
| `endocrine_diabetes.dbml` | endo + diabetes + 4 sub |
| `rheum_immunology.dbml` | rheum + immuno + allergy |
| `dermatology.dbml` | derm + 4 sub |
| `infectious_diseases.dbml` | ID + 5 sub |
| `obgyn.dbml` | OB/GYN + 7 sub |
| `neonatal_pediatrics.dbml` | neonatology + peds + 8 sub |
| `pediatric_subspec.dbml` | peds sub-specs (cardiac, GI, rheum, etc.) |
| `intensive_care.dbml` | ICU + 12 sub |
| `anesthesia_pain.dbml` | anesthesia + pain + HBOT |
| `radiology_imaging.dbml` | rad + 6 sub |
| `laboratories.dbml` | lab + 7 sub |
| `functional_diagnostics.dbml` | ECG/PFT/EMG/EEG |
| `radiation_pharmacy.dbml` | rad onc + pharmacy + 6 sub |
| `rehab_pt.dbml` | rehab + PT/OT/speech |
| `integrative_medicine.dbml` | TCM, herbal, music, art, massage, yoga, pet |
| `nursing.dbml` | nursing + 14 sub |
| `nutrition.dbml` | clinical nutrition + kitchen |
| `social_psych.dbml` | social work + psych |
| `logistics_it.dbml` | biomed + HIS + translation + stats + comms |
| `security_safety.dbml` | security + OHS + disaster |
| `executive.dbml` | CEO + CMO + CNO + CFO + COO + councils |
| `quality_accreditation.dbml` | TQM + JCI + audit + complaints + risk |
| `education_research.dbml` | education + research + library + sim |
| `hr_admin.dbml` | medical HR + training + legal + PR + call center |
| `centers_of_excellence.dbml` | 15 centers (unified views) |
| `rare_advanced.dbml` | 12 rare sub-specs |

**Total:** 39 clusters covering 64 dept groups + 15 centers + 12 rare = 91 workstreams. The DBML foundation is solid; what is missing is the **frontend Stitch designs + per-dept `.ai-brain/` specs + per-sub-unit workspaces**.

---

## 5. AI Orchestration Coverage (RAG / VectorMine / LangChain)

| Layer | Status | Notes |
|---|---|---|
| **Vector DB** (pgvector or REAL[]) | partial | `clinical_knowledge_vectors` table exists, but only 1 cluster populated (Cardio) |
| **RAG chain** (LangChain) | partial | `cds.js` orchestrates; falls back to deterministic when no LLM configured |
| **Embeddings** (1536-dim) | partial | OpenAI text-embedding-3-small path, but not all clusters have chunks |
| **Prompt templates** | partial | Cardio + OB + Lab + Peds have; 50+ dept missing |
| **LLM Observability** (LangFuse/LangSmith) | none | not wired |
| **Eval rubric** | none | need golden-set + auto-grader per dept |
| **Token cost tracking** | none | need budget alerts per dept |

**Target:** all 64 dept groups have full RAG chain + VectorMine + LangChain + LLM Observability + cost tracking.

---

## 6. Stitch UI Designs Coverage (0/88)

Currently 0 dedicated Stitch HTML files. The 30 stations use a 3-col layout
implemented in vanilla JS + Tailwind (no Stitch Google design system output).

**Target:** 88 Stitch HTML files (one per dept group), in `.stitch_designs/` or
attached to each `.ai-brain/<group>/<dept>/04_ux_ui_stitch.md`.

---

## 7. Safety Rails Audit (13/13)

All 13 safety rails from `AGENTS.md §2.2` are documented and respected by the
Phase 2E2 deployment (see `docs/PHASE_2E2_STITCH_CALCULATORS_CLOSEOUT_AR.md`).
The next phase (3 — full coverage) must preserve all 13.

---

## 8. Top 10 Risks for Phase 3 (full coverage)

| # | Risk | Mitigation |
|---|---|---|
| 1 | Token explosion (88 depts × 34 files × 500+ lines = 1.5M+ tokens) | Use token-saver skills + multi-agent batching + snippets.md |
| 2 | Stitch design quality (88 designs ≠ 88 unique looks) | Define 8 base layouts + 11 theme variants; each dept picks |
| 3 | LLM cost (RAG per dept × daily volume) | Cache embeddings, use small model (Haiku), batch calls |
| 4 | DB migration contention (88 depts × 15 candidate migrations = 1,300 migrations) | Use `eN_*` series, group by cluster, single transaction per cluster |
| 5 | RLS policy overlap (150 tables → 250+) | Audit each new table; reuse `FORCE_RLS=ON` policy template |
| 6 | Sub-unit workspace overload (260 sub-units × 30 patients) | Lazy-load, virtualization, single-page app |
| 7 | Maintenance burden (88 specs × 43 docs = 3,784 docs) | Auto-regenerate via CI when master blueprint changes |
| 8 | I18n drift (AR/EN labels per dept) | Centralized i18n.json + auto-translate via LLM + manual review |
| 9 | Stitch ↔ Vanilla JS bridge | Already have 28 stations as templates; reuse `routing-patch.js` pattern |
| 10 | RAG chunking per specialty | Per-cluster chunker config in `02_ai_orchestration.md` |

---

## 9. What to do NEXT (Phase 3 workplan)

See `WORKPLANS/PHASE_3_FULL_COVERAGE_WORKPLAN.md` for the detailed
11-batch rollout plan (autopilot + loop engineering + 7-expert panel).
