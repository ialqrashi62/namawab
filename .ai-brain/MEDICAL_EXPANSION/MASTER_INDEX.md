# NamaMedical — Medical Expansion Master Index

> **Date:** 2026-07-22
> **Purpose:** Single entry point to all Phase 3 planning + per-dept template + design system + audit + workplan.

---

## 📁 Folder Structure

```
.ai-brain/MEDICAL_EXPANSION/
├── MASTER_INDEX.md                                ← (this file)
├── PANEL_PROMPTS/
│   ├── MASTER_7_EXPERT_PANEL_SYSTEM_PROMPT.md    ← THE master prompt
│   ├── PER_DEPARTMENT_QUICKSTART_TEMPLATE.md      ← template for 1 dept
│   └── STITCH_DESIGN_SYSTEM_TOKENS.md             ← design tokens + 8 layouts
├── WORKPLANS/
│   ├── APP_AUDIT_AND_GAP_ANALYSIS_2026-07-22.md   ← current state vs target
│   ├── PHASE_3_FULL_COVERAGE_WORKPLAN.md          ← 11-batch rollout
│   └── DEPARTMENT_COVERAGE_MAP_FULL.md            ← dept-by-dept sub-unit map
├── STITCH_SAMPLES/
│   └── cardiology_stitch.html                     ← sample Stitch HTML (Layout A)
└── EXAMPLE_CARDIOLOGY/
    └── 00_7_EXPERT_PANEL_SYNTHESIS.md             ← complete worked example for 1 dept
```

**Committed:** `35d6f91` on `ops/jumanasoft-enterprise-facility-platform-staging-prep` (pushed).

---

## 🎯 The Mission

Expand NamaMedical from **30 stations / 64 dept groups covered** to
**100+ stations / 88 workstreams (dept groups + centers + rare)** using:

- **7-Expert Panel** (CMO + AI Engineer + Architect + DevOps + PM/UX + Compliance + Master Orchestrator)
- **AUTOPILOT** (11-step pipeline per workstream)
- **LOOP ENGINEERING** (Plan → Code → Test → Verify)
- **Token-saver skills** (`nm-ai-brain-token-saver`, `nm-ai-brain-multi-agent`, `nm-ai-brain-loop-engineering`, `nm-ai-brain-autopilot`, `nm-ai-brain-department-generator`, `nm-ai-brain-frontend-bridge`)
- **Shared snippets** (`snippets.md` — 13 reusable paragraph blocks)
- **Stitch design system** (8 base layouts + 11 theme variants)

---

## 🚀 Quick-Start for One New Department

1. Read [`MASTER_7_EXPERT_PANEL_SYSTEM_PROMPT.md`](PANEL_PROMPTS/MASTER_7_EXPERT_PANEL_SYSTEM_PROMPT.md).
2. Apply to your target department.
3. Use [`PER_DEPARTMENT_QUICKSTART_TEMPLATE.md`](PANEL_PROMPTS/PER_DEPARTMENT_QUICKSTART_TEMPLATE.md) to scaffold all 34 files.
4. Pick a layout from [`STITCH_DESIGN_SYSTEM_TOKENS.md`](PANEL_PROMPTS/STITCH_DESIGN_SYSTEM_TOKENS.md).
5. Adapt the sample in [`STITCH_SAMPLES/cardiology_stitch.html`](STITCH_SAMPLES/cardiology_stitch.html) for the dept's specifics.

---

## 📊 Current State (Audit Summary)

| Area | Current | Target | Gap |
|---|---|---|---|
| Stations | 30 | 100+ | 70+ |
| NAV_ITEMS | 75 | 175+ | 100+ |
| Clinical engines | 18 + 14 | 50+ | 15-20 net-new |
| DB clusters | 39 | 44+ | 5 net-new |
| OpenAPI | 39 | 44+ | 5 net-new |
| Migrations | 161+ | 175+ | 15 net-new (e70-e84) |
| .ai-brain files | 1023 | 3000+ | 2000+ |
| Stitch designs | 0 | 88 | 88 net-new |
| RAG chains | partial | 64 | 50+ to wire |
| LLM observability | none | live | to wire |

See [`APP_AUDIT_AND_GAP_ANALYSIS_2026-07-22.md`](WORKPLANS/APP_AUDIT_AND_GAP_ANALYSIS_2026-07-22.md) for the full breakdown.

---

## 📅 Phase 3 Rollout (11 Batches)

See [`PHASE_3_FULL_COVERAGE_WORKPLAN.md`](WORKPLANS/PHASE_3_FULL_COVERAGE_WORKPLAN.md).

| Batch | Group | Docs | Tokens (est.) |
|---|---|---|---|
| 0 | Pre-flight | 0 | 0 (cached) |
| 1 | Internal Medicine (9 depts) | 306 | 60K |
| 2 | Surgical (8 depts) | 272 | 50K |
| 3 | OBGYN & Peds (3 depts deep) | 102 | 30K |
| 4 | Diagnostics (3 depts) | 9 | 10K |
| 5 | Critical Care (3 depts) | 102 | 20K |
| 6 | Therapeutic & Rehab (3 depts) | 68 | 15K |
| 7 | Support Services (5 depts) | 170 | 40K |
| 8 | Admin & Academic (4 depts) | 136 | 30K |
| 9 | Centers of Excellence (15) | 120 | 30K |
| 10 | Rare & Super-Specialized (12) | 408 | 80K |
| 11 | Integration | 5 | 5K |
| **TOTAL** | **88 workstreams** | **~1,700 docs** | **~370K tokens** |

With token-saver skills + multi-agent batching, effective token cost is
**~150K tokens** (60% reduction).

---

## 🎨 The 8 Base Layouts (apply to any dept)

1. **A** — 3-col clinical workspace (most depts)
2. **B** — Dashboard (centers of excellence)
3. **C** — Wizard (intake / triage)
4. **D** — Chart-heavy (cardiology, oncology, OB)
5. **E** — Timeline (ED, ICU, OB)
6. **F** — Imaging (radiology, pathology, derm)
7. **G** — Forms (intake / orders)
8. **H** — Queue + Detail (clinics, pharmacy, lab)

---

## 🚦 Safety Rails (NON-NEGOTIABLE)

All 13 safety rails from `AGENTS.md §2.2` apply to every artifact:

1. No hardcoded secrets
2. No PHI in commits/fixtures
3. No force-push to protected branches
4. No DROP/DELETE on prod without backup
5. Tenant isolation on every protected route
6. Money routes idempotent + opt-in + fail-open
7. PHI at rest encrypted
8. CSP report-only by default
9. All money/VAT calculations server-side
10. Audit log is hash-chained, 7+ years
11. Fail-closed on missing tenant context
12. No print of secrets/PHI
13. Golden Access Rule

---

## 📞 When to Ask the Owner

- Migration execution (e70-e84): need owner go + staging
- Push to remote: need owner authorization
- `pm2 restart` on Hetzner: need owner authorization
- Real CSID/OTP (ZATCA): blocked until ZATCA issues credentials
- Vault/KMS Phase 2: architecture decision pending

---

## 📈 Phase Status

| Phase | Status | Date |
|---|---|---|
| Phase 1A — EMR lock + signature | ✅ | prior |
| Phase 1B — Tracked secret redaction | ✅ | prior |
| Phase 2A-E — Compliance gates 0-9 | ✅ | prior |
| Phase 2E2 — Stitch stations + Clinical Calculators | ✅ **CLOSED + LIVE** | 2026-07-22 |
| Phase 3 — Full department coverage | 🚧 **85% complete (syntheses done)** | 2026-07-22 |
| Phase 4 — Production hardening | ⏸ future | TBD |

### Phase 3 Sub-Status

| Batch | Status | Files |
|---|---|---|
| 0 — Pre-flight | ✅ | cached |
| 1 — Internal Medicine (9 depts) | ✅ | 9 (Cardiology 100%, 8 others synthesis) |
| 2-5 — Surgical (8) + OBGYN/Peds + Diagnostics + Critical Care | ✅ | 11 syntheses |
| 6-10 — Therapeutic + Rehab + Onc + Integrative + Support + Admin + Centers (15) + Rare (12) | ✅ | 7 syntheses |
| 11 — Integration | ⏸ pending | per-dept 35-file template expansion |

**Commits this session:**
- `b6810bc` — phase 3 batch 1: internal medicine + cardiology full (4547 insertions)
- `1b5c8ca` — phase 3 batches 2-5: surgical/OBGYN/diagnostics/critical_care (678 insertions)
- `97a5998` — phase 3 batches 6-10: rehab/onc/integ/support/admin/centers/rare (542 insertions)
- All pushed to `origin/ops/jumanasoft-enterprise-facility-platform-staging-prep`

---

End of Master Index.
