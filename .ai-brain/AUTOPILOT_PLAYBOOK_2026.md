# 🚀 AUTOPILOT_PLAYBOOK_2026 — تشغيل آلي شامل

> **الهدف:** تشغيل autopilot يولد 60 قسم × 35 ملف + 30 engine + 19 station
> **الزمن:** 8 ساعات متوازية (8 workers)
> **التوكنز:** ~900k (مع token-saver)

---

## 1. شروط التشغيل (Prerequisites)

| # | الشرط | الحالة |
|---|---|---|
| 1 | `nm-ultimate-blueprint-factory` skill | ✅ |
| 2 | `nm-token-saver-pack-v2` (20 snippet) | ✅ |
| 3 | `nm-multi-agent-orchestrator-v2` (7 experts) | ✅ |
| 4 | `nm-loop-engineering-v2` (4-cap retry) | ✅ |
| 5 | `nm-stitch-medical-v2` (Stitch UI) | ✅ |
| 6 | `nm-vector-rag-v2` (RAG + LangChain) | ✅ |
| 7 | `nm-dept-prompt-v3` (Prompt + Scenario + Flow) | ✅ |
| 8 | `nm-dept-discovery` (gap analyzer) | ✅ |
| 9 | MASTER_CATALOG_v5.yaml | ✅ |
| 10 | 03_AUTOPILOT/generate_all_depts.py | ✅ |

---

## 2. خطة التشغيل (Run Plan)

### Phase A — Discovery (5 min)
```bash
node .ai-brain/03_AUTOPILOT/discovery.js
```
Output: `99-state/discovery_<date>.json`

### Phase B — Skill Warmup (2 min)
- Verify all 8 skills loaded
- Load snippet library S-01 → S-20
- Verify MASTER_CATALOG_v5.yaml schema valid

### Phase C — Multi-Agent Wave 1 (60 min) — 10 Priority P0 Depts
- DEP-001 Cardiology → DEP-010 Allergy (10 depts)
- 7 experts × 10 depts × parallel (3 depts at a time)
- 10 × 35 = 350 files generated

### Phase D — Multi-Agent Wave 2 (60 min) — 10 Surgery Depts
- DEP-011 to DEP-020
- 10 × 35 = 350 files

### Phase E — Multi-Agent Wave 3 (60 min) — 15 Critical Care + OB + Diagnostics
- DEP-021 to DEP-043
- 15 × 35 = 525 files

### Phase F — Multi-Agent Wave 4 (60 min) — 15 Mental/Rehab/Onco/Support
- DEP-044 to DEP-060
- 15 × 35 = 525 files

### Phase G — Code Implementation (120 min)
- 30 engines جديدة في `namaweb/*_engine.js`
- 19 stations جديدة في `namaweb/public/js/*-station.js`
- routes wiring في server.js
- 50 migration جديدة

### Phase H — Loop Engineering (60 min)
- Per-dept: Plan → Implement → Test → Verify
- Cap 4 iterations per dept
- Auto-fix common failures (tenant scope, RLS, RBAC)

### Phase I — Verification (30 min)
- All 20 acceptance criteria check
- Token budget audit
- Final closeout

---

## 3. Total Time Budget

| Phase | Minutes |
|---|---|
| A Discovery | 5 |
| B Warmup | 2 |
| C Wave 1 | 60 |
| D Wave 2 | 60 |
| E Wave 3 | 60 |
| F Wave 4 | 60 |
| G Code | 120 |
| H Loop | 60 |
| I Verify | 30 |
| **TOTAL** | **457 min ≈ 7.6 hours** |

---

## 4. Token Budget (Real-Time Tracking)

```
skill_init: 50k
wave_1_10depts × 15k = 150k
wave_2_10depts × 15k = 150k
wave_3_15depts × 15k = 225k
wave_4_15depts × 15k = 225k
code_30_engines × 5k = 150k
code_19_stations × 4k = 76k
code_50_migrations × 1k = 50k
loop_iterations × 10k = 100k
verification = 30k
TOTAL: ~1.2M tokens
```

---

## 5. Parallel Workers Strategy

```
Worker 1: Cardiology + Endocrine + Gastro (3 depts parallel within)
Worker 2: HemOnc + Nephro + Pulmo
Worker 3: Rheuma + ID + Derm
Worker 4: Surgery + Ortho + Neuro
Worker 5: CardioThoracic + ENT + Ophth
Worker 6: Uro + Plastic + Vascular
Worker 7: ER + ICU + NICU + PICU + PACU
Worker 8: Pediatrics cluster (8 depts)
```

**Max parallelism:** 8 workers (token-budget aware)

---

## 6. Failure Recovery (Per Phase)

| Failure | Recovery |
|---|---|
| Expert timeout | Retry with reduced scope |
| Token budget exceeded | Truncate + summary |
| Schema validation fail | Inject fallback template |
| Loop cap hit (4) | Escalate to owner signal |
| File write fail | Retry with path fix |

---

## 7. Verification Checklist

- [ ] 60 dept folders exist in `.ai-brain/02_MODULES/`
- [ ] Each dept has 35 files (count)
- [ ] Each dept has OpenAPI 3.0 (yaml valid)
- [ ] Each dept has ERD DDL (sql valid)
- [ ] Each dept has migrations up + down
- [ ] Each dept has 3 test files
- [ ] Each dept has user manual AR + EN
- [ ] Each dept has i18n AR + EN
- [ ] Each dept has wireframe + Stitch tokens
- [ ] Each dept has LangChain chains
- [ ] Each dept has VectorMine config
- [ ] Each dept has RAG pipeline
- [ ] 8 v2 skills created
- [ ] MASTER_CATALOG_v5.yaml valid
- [ ] 30+ engines created in namaweb/
- [ ] 19+ stations created in namaweb/public/js/
- [ ] 50+ migrations created in namaweb/migrations/
- [ ] server.js wired correctly
- [ ] INDEX_2026_08_08.md updated
- [ ] FINAL_CLOSEOUT_2026_08_08.md written

---

## 8. Output Artifacts

```
.ai-brain/
├── 02_MODULES/
│   ├── DEP-001_cardiology/ (35 files)
│   ├── DEP-002_endocrinology/ (35 files)
│   └── ... (60 depts)
├── 03_AUTOPILOT/
│   ├── discovery.js
│   ├── generate_all_depts.py
│   ├── orchestrator.js
│   └── verify.js
├── 99-state/
│   └── discovery_2026-08-08.json
├── skills/
│   └── nm-*-v2/ (8 skills)
├── 00_SYSTEM/
│   └── MASTER_CATALOG_v5.yaml
├── 99-upgrade/
│   └── 02_GLOBAL_SYSTEMS_BENCHMARK_2026_AR.md
├── MASTER_PLAN_2026_08_08_AR.md
├── AUTOPILOT_PLAYBOOK_2026.md
├── LOOP_ENGINEERING_GUIDE_2026.md
├── MULTI_AGENT_PROMPTS_2026.md
├── INDEX_2026_08_08.md
└── FINAL_CLOSEOUT_2026_08_08.md
```

---

## 9. Go / No-Go Decision

**Owner signal: ACTIVE (Signal 5)**
- User authorized full execution without interruption
- All 12 phases will run sequentially
- Auto-recovery enabled
- Loop cap: 4 iterations per dept
- Escalation: only on critical safety-rail violation

**Status: GO**
