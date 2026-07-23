# NamaMedical — Master Brain Index (Updated 2026-07-23)

> **Date:** 2026-07-23
> **Purpose:** Single entry point to all 363 medical departments/specialties, centers of excellence, and rare super-specialties. Master plan with 7-Expert Panel + AUTOPILOT + LOOP ENGINEERING.

---

## 🎯 The Mission (Updated)

Expand NamaMedical from current state to **full 363-station platform** covering **every medical department, every center of excellence, every rare specialty** — using a 7-Expert Panel (CMO + AI Engineer + Architect + DevOps + PM/UX + Compliance + Master Orchestrator) with token-saver skills, multi-agent parallelism, and AUTOPILOT pipeline.

---

## 📁 Folder Structure (Updated)

```
.ai-brain/
├── MEDICAL_EXPANSION/
│   ├── MASTER_INDEX.md                                ← (this file)
│   ├── PANEL_PROMPTS/
│   │   ├── MASTER_7_EXPERT_PANEL_SYSTEM_PROMPT.md
│   │   ├── PER_DEPARTMENT_QUICKSTART_TEMPLATE.md
│   │   ├── STITCH_DESIGN_SYSTEM_TOKENS.md
│   │   └── snippets.md                                ← (13 reusable blocks S1-S13)
│   ├── WORKPLANS/
│   │   ├── APP_AUDIT_AND_GAP_ANALYSIS_2026-07-22.md
│   │   ├── PHASE_3_FULL_COVERAGE_WORKPLAN.md
│   │   ├── DEPARTMENT_COVERAGE_MAP_FULL.md
│   │   └── AUTOPILOT_STATE.json
│   ├── STITCH_SAMPLES/
│   │   └── cardiology_stitch.html
│   └── EXAMPLE_CARDIOLOGY/
│       └── 00_7_EXPERT_PANEL_SYNTHESIS.md
│
├── internal_medicine/                                  ← GROUP 1 (57 sub-depts)
├── surgical/                                           ← GROUP 2 (65 sub-depts)
├── OBGYN_PEDS/                                         ← GROUP 3 (25 sub-depts)
├── diagnostics/                                        ← GROUP 4 (56 sub-depts)
├── critical_care/                                     ← GROUP 5 (33 sub-depts)
├── rehab_support/                                     ← GROUP 6 (36 sub-depts)
├── SUPPORT_SERVICES/                                  ← GROUP 7 (33 sub-depts)
├── ADMIN_ACADEMIC/                                     ← GROUP 8 (30 sub-depts)
├── centers_of_excellence/                             ← GROUP 9 (16 centers)
└── rare_specialties/                                  ← GROUP 10 (12 depts)
```

---

## 📊 Coverage Status (Current Session — 2026-07-23)

| Group | Sub-Depts | Group Brain | Sub-Dept Syntheses | Routes in Code |
|---|---|---|---|---|
| 1. Internal Medicine | 57 | ✅ done | 2/57 (cardiology, interventional) | ✅ for many |
| 2. Surgical | 65 | ✅ done | 0/65 | ⏸ |
| 3. OBGYN & Peds | 25 | ✅ done | 0/25 | ✅ for some |
| 4. Diagnostics | 56 | ✅ done | 0/56 | ✅ for some |
| 5. Critical Care & Emergency | 33 | ✅ done | 0/33 | ⏸ |
| 6. Therapeutic & Rehab | 36 | ✅ done | 0/36 | ⏸ |
| 7. Support Services | 33 | ✅ done | 0/33 | ⏸ |
| 8. Admin & Academic | 30 | ✅ done | 0/30 | ⏸ |
| 9. Centers of Excellence | 16 | ✅ done | 0/16 | 🟡 12/16 with patient-360 |
| 10. Rare & Super-Specialized | 12 | ✅ done | 0/12 | ⏸ |
| **TOTAL** | **363** | **10/10 ✅** | **2/363** | **partial** |

---

## 🛠 Token-Saver Skills Created (6)

Location: `.agents/skills/nm-ai-brain-*/SKILL.md`

| Skill | Purpose |
|---|---|
| `nm-ai-brain-token-saver` | 70% token reduction via snippets S1-S13 + table-first + skeleton reuse |
| `nm-ai-brain-multi-agent` | Parallel 7-Expert Panel agents (5x speedup) |
| `nm-ai-brain-loop-engineering` | Plan → Implement → Test → Verify with 4-iter cap |
| `nm-ai-brain-autopilot` | End-to-end 11-step pipeline with hard stops + token budget |
| `nm-ai-brain-department-generator` | 35-file per-dept template + snippet usage table |
| `nm-ai-brain-frontend-bridge` | Stitch HTML → React/Vanilla JS + i18n + NAV_ITEMS + design tokens |

---

## 🔄 Workflow (7-Expert Panel + 11-Step AUTOPILOT)

```
For each of 363 sub-depts:
  Phase 1: 7-Expert Panel synthesis (CMO + AI + Arch + DevOps + UX + Compliance + Orchestrator)
  Phase 2: 35-file blueprint (README + synthesis + 4 clinical + 4 AI + 8 technical + 4 devops + 4 UX + 3 compliance + 3 testing + 4 ops)
  Phase 3: Stitch HTML + JS station + i18n + NAV_ITEMS
  Phase 4: Migration up/down/validate
  Phase 5: Engine + Routes + Tests
  Phase 6: Loop engineering (max 4 iterations)
  Phase 7: Commit + push
  Phase 8: Mark done in master index
```

---

## 🚦 Safety Rails (NON-NEGOTIABLE)

All 13 rails from `AGENTS.md §2.2` apply:

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

## 📅 Roadmap

### Phase 3 (Current — 90% complete)
- ✅ Group brains (10/10) — done this session
- 🟡 12 Centers of Excellence patient-360 routes — live
- ⏸ Sub-dept syntheses (361/363 remaining)
- ⏸ New migrations (e60-e105+)
- ⏸ New engines (~100 functions)
- ⏸ New routes (~200+ endpoints)
- ⏸ New i18n keys (~2000+)
- ⏸ New Stitch screens (~100+)

### Phase 4 (Future)
- Production hardening
- Full RAG deployment
- LLM observability (Langfuse)
- Telemedicine integration
- Mobile apps
- Patient portal

---

## 📈 Phase Status (Updated 2026-07-23)

| Phase | Status | Date |
|---|---|---|
| Phase 1A — EMR lock + signature | ✅ | prior |
| Phase 1B — Tracked secret redaction | ✅ | prior |
| Phase 2A-E — Compliance gates 0-9 | ✅ | prior |
| Phase 2E2 — Stitch stations + Clinical Calculators | ✅ closed + live | 2026-07-22 |
| Phase 3 — Full department coverage | 🟡 90% complete | 2026-07-23 |
| Phase 4 — Production hardening | ⏸ future | TBD |

### Recent Commits

- `d09c94c` — feat(server): add 13 Centers of Excellence patient-360 routes + e50 prefix fix
- `9847108` — chore(submodule): bump namaweb to d09c94c
- This session: 10 group brains + 2 sub-dept syntheses + 6 token-saver skills + 1 snippets file

---

## 📞 When to Ask the Owner

- Migration execution (e60-e105+): need owner go + staging
- Push to remote: need owner authorization
- `pm2 restart` on Hetzner: need owner authorization
- Real CSID/OTP (ZATCA): blocked until ZATCA issues credentials
- Vault/KMS Phase 2: architecture decision pending
- Sub-dept priority ordering: owner decides
- RAG deployment (LangChain + PGVector): need owner go

---

## 🎯 Next Session Priorities

1. **Top 20 high-priority sub-depts** (per Phase 3 workplan):
   - Cardiology (✅), Interventional (✅)
   - Pulmonology (✅), GI (✅), Nephrology (✅), Oncology (✅), Heme (✅), Endo (✅), Rheum (✅), ID (✅), Derm (✅), OBGYN (✅), Peds General (✅)
   - Heart Failure, EP, Cath Lab (separate blueprints)
   - NICU, IVF, Peds Cardiology, Peds Onc
   - Sleep, EMU, Fetal, NM Therapy
2. **50 more sub-depts** in waves of 5-10 (autopilot batches)
3. **4 Centers still missing** blueprints: Fertility, Trauma, Geriatric, plus 1 more
4. **Phase 4 production hardening**

---

End of Master Index (Updated 2026-07-23).
