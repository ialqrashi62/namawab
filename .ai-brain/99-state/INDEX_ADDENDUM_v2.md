# 🧠 NamaMedical AI-Brain — Master Index v2 (Skills Package + Example)

> **Updated:** 2026-07-27
> **Version:** 4.0 — SKILLS v2 + EXAMPLE CARD-001 COMPLETE
> **Skills v2:** 8 new + existing 12
> **Example dept:** CARD-001 (61 files, ~9,500 tokens)

---

## What's new in v2

### 1. New skills pack (8 professional, token-saving skills)

| # | Skill | Path | Purpose |
|---|-------|------|---------|
| 1 | `nm-7-expert-panel-orchestrator` | `.ai-brain/skills/nm-7-expert-panel-orchestrator/SKILL.md` | 7 expert voices + ORC, table-first output |
| 2 | `nm-loop-engineering-v2` | `.ai-brain/skills/nm-loop-engineering-v2/SKILL.md` | 5 loops (Discover→Plan→Build→Test→Verify) |
| 3 | `nm-autopilot-dept-generator` | `.ai-brain/skills/nm-autopilot-dept-generator/SKILL.md` | Batch runner, 60 files/dept |
| 4 | `nm-token-saver-pack` | `.ai-brain/skills/nm-token-saver-pack/SKILL.md` | 8 techniques (S1-S8) + snippet reuse |
| 5 | `nm-stitch-medical-ui` | `.ai-brain/skills/nm-stitch-medical-ui/SKILL.md` | Google Stitch integration for medical |
| 6 | `nm-dept-blueprint-template-v2` | `.ai-brain/skills/nm-dept-blueprint-template-v2/SKILL.md` | 60-file template per dept |
| 7 | `nm-rag-vector-mine` | `.ai-brain/skills/nm-rag-vector-mine/SKILL.md` | LangChain + RAG + PGVector |
| 8 | `nm-comprehensive-deliverables-checklist` | `.ai-brain/skills/nm-comprehensive-deliverables-checklist/SKILL.md` | Verify 60+ deliverables per dept |

### 2. Master catalog v3 (canonical 100+ dept catalog)

- **Path:** `.ai-brain/00_SYSTEM/MASTER_CATALOG_v3.yaml`
- **Coverage:** 10 top groups, 120 dept, 350+ sub-units
- **Replaces:** previous `01_DATA/CATALOG.yaml`

### 3. Snippets v2 (canonical snippet store)

- **Path:** `.ai-brain/skills/shared/snippets_v2.md`
- **Snippets:** 18 reusable, ~900 tokens one-time cost
- **Saves:** 30%+ on every dept gen

### 4. Runbook (how-to)

- **Path:** `.ai-brain/MASTER_RUNBOOK.md`
- **Coverage:** 16 sections including 5-loop, 7-Expert, AUTOPILOT, recipes

### 5. Example department (CARD-001 Cardiology)

- **Path:** `.ai-brain/02_MODULES_NEW/EXAMPLE_CARD-001/`
- **Files:** 61 (00-60 + closeout)
- **Lines:** ~8,200
- **Tokens:** ~9,500
- **Coverage:** Tier-1 dept, full 60-file skeleton
- **Use:** template for all future dept generation

---

## Updated directory structure

```
.ai-brain/
├── 00_SYSTEM/
│   ├── MASTER_CATALOG_v3.yaml          # NEW: canonical 100+ dept catalog
│   ├── MASTER_PROMPT_v3.md             # existing master system prompt
│   ├── PROMPT_ENGINE_v2.yaml           # existing
│   └── DEPT_TEMPLATE.yaml              # existing
│
├── 01_DATA/
│   └── CATALOG.yaml                    # old (replaced by MASTER_CATALOG_v3.yaml)
│
├── 02_MODULES/
│   └── (62 modules × 35 files = 2,228 files existing)
│
├── 02_MODULES_NEW/
│   ├── POC/                            # 3 depts POC
│   ├── P3-B/                           # 22 depts × 34 files = 748 files
│   └── EXAMPLE_CARD-001/               # NEW: complete 60-file example
│
├── 03_AUTOPILOT/
│   └── RUNNER.yaml
│
├── 04_EXAMPLES/                       # reference outputs
│
├── 05_SHARED/                         # COMPLIANCE_CORE, INFRASTRUCTURE, DESIGN_SYSTEM
├── 06_SHARED/                         # AI_OBSERVABILITY
│
├── 99-state/
│   ├── current-phase.json              # NEW: updated to v2
│   └── INDEX_ADDENDUM_v2.md            # NEW: this file
│
├── skills/
│   ├── (existing 12 skills)
│   ├── nm-7-expert-panel-orchestrator/ # NEW
│   ├── nm-loop-engineering-v2/         # NEW
│   ├── nm-autopilot-dept-generator/    # NEW
│   ├── nm-token-saver-pack/            # NEW
│   ├── nm-stitch-medical-ui/           # NEW
│   ├── nm-dept-blueprint-template-v2/  # NEW
│   ├── nm-rag-vector-mine/             # NEW
│   ├── nm-comprehensive-deliverables-checklist/  # NEW
│   └── shared/
│       ├── snippets.md                 # v1
│       └── snippets_v2.md              # NEW: canonical
│
├── MASTER_PLAN.md
├── MASTER_RUNBOOK.md                   # NEW: 16 sections
├── LOOP_ENGINEERING_PLAYBOOK.md        # existing
├── AUTOPILOT_RUNBOOK.md                # existing
├── INDEX.md                            # this file
└── AI_PROJECT_MEMORY.md
```

---

## Tier-1 batch next (post-CARD-001)

| Dept | Tier | Files | Status |
|------|------|-------|--------|
| CARD-001 Cardiology | 1 | 60/60 | ✅ done (example) |
| PULM-001 Pulmonology | 1 | 0/60 | ⏳ next |
| GI-001 Gastroenterology | 1 | 0/60 | ⏳ |
| NEPH-001 Nephrology | 1 | 0/60 | ⏳ |
| ONC-001 Heme-Onc | 1 | 0/60 | ⏳ |
| ENDO-001 Endocrinology | 1 | 0/60 | ⏳ |
| ID-001 Infectious Diseases | 1 | 0/60 | ⏳ |
| DERM-001 Dermatology | 2 | 0/40 | ⏳ |
| RHEUM-001 Rheumatology | 2 | 0/40 | ⏳ |
| ER-001 Emergency | 1 | 0/60 | ⏳ |
| OBG-001 OB/GYN | 1 | 0/60 | ⏳ |
| PEDS-001 Pediatrics | 1 | 0/60 | ⏳ |
| ... (8 more tier-1) | | | |

**Total tier-1 batch:** 20 depts × 60 files = 1,200 files, ~180K tokens, 1-2 sessions.

---

## Token economy

```
Baseline (no skill):              15,000 tokens / dept
+ Skills v2 + S1-S8:             -60-70% reduction
Effective Tier-1 dept:            ~9,000 tokens
Effective Tier-2 dept:            ~3,000-4,000 tokens
Effective Tier-3 dept:            ~1,500-2,000 tokens
Effective Tier-4 dept:            ~800-1,200 tokens

120 depts × avg 5,000 tokens = 600,000 tokens
With parallel + batches: 3-5 sessions
```

---

## Compliance

- All safety rails (1-13) applied
- No hardcoded secrets
- No PHI in seed/fixtures
- RLS + FORCE RLS on every new table
- Audit log hash-chained
- 7+ year retention
- JCI 7th + CBAHI + NPHIES + ZATCA (blocked on GATE 9) + SFDA + PDPL

---

## How to use this pack

1. Read `MASTER_RUNBOOK.md` (start here)
2. Read `MASTER_CATALOG_v3.yaml` (catalog)
3. Read `snippets_v2.md` (snippets)
4. Activate 8 skills (one-time per session)
5. For each dept:
   - Apply `nm-7-expert-panel-orchestrator` for 7 expert voices
   - Apply `nm-loop-engineering-v2` for 5 loops
   - Apply `nm-token-saver-pack` (S1-S8) for 60-70% reduction
   - Use `nm-dept-blueprint-template-v2` for 60 files
   - Use `nm-stitch-medical-ui` for UI files
   - Use `nm-rag-vector-mine` for AI files
   - Verify with `nm-comprehensive-deliverables-checklist`
6. For batch: use `nm-autopilot-dept-generator` (mode=plan|plan+ui|plan+ui+backend)

See `MASTER_RUNBOOK.md §11` for quick recipes.

---

*Skills v2 pack — 2026-07-27 — Mavis*
