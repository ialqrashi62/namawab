---
name: nm-autopilot-upgrade
description: Use when running the full NamaMedical upgrade in AUTOPILOT mode. Plans, executes, validates, iterates without owner interruption. Combines 5-loop engineering, 7-expert panel, token-saver, and golden access rule. AUTOPILOT.
---

# nm-autopilot-upgrade

> **Purpose:** Run the entire NamaMedical upgrade cycle (discover → plan → build → test → verify) for ONE dept (Tier-1, 60 files) or for one BATCH (5-20 depts).

---

## 1. Activation signal

Activate when the user issues a global upgrade request OR when batch begin signal received. Owner permission assumed during MODE-3 (full implementation).

---

## 2. Operating modes

| Mode | Scope | Output |
|------|-------|--------|
| **MODE 1 (dry)** | Plans only — no files written | `plan.md` per dept |
| **MODE 2 (plan+blueprint)** | Default — L1-L3 → 60 files | full dept blueprint folder |
| **MODE 3 (plan+blueprint+code)** | Mode 2 + real code in `namaweb/` | engines, routes, migrations, tests |
| **MODE 4 (everything)** | Mode 3 + deploy to staging | full pipeline |

> **Default**: MODE 2 for blueprints, MODE 3 by user direct instruction.

---

## 3. The 5-loop discipline per dept

```
L1 DISCOVER  — facts only (no opinions)
  Inputs: master catalog, dept aliases, existing modules, global comparison
  Outputs: facts.yaml, gap_analysis.yaml

L2 PLAN      — approach + risks + rollback (per file)
  Inputs: facts.yaml, TPL:DEPT
  Outputs: per-file plan, total token budget, risk register

L3 BUILD     — complete code (NO abbreviations, 100% runnable)
  Inputs: plans + snippets + shared snippets
  Outputs: 60 files × (system prompts, code, data, UI, ops, tests, compliance)

L4 TEST      — unit + integration + cross-tenant + clinical safety
  Inputs: outputs of L3
  Outputs: passing tests + safety report

L5 VERIFY    — sign-off checklist + closeout
  Inputs: L4 outputs
  Outputs: closeout.md + state file update
```

**Max iterations per loop**: 3 (after which ORC decides: escalate or accept partial).

---

## 4. 7-Expert Panel (always active)

- `CMO` — clinical veto (always wins on patient safety)
- `AIE` — AI/LangChain
- `SA` — architecture
- `DSL` — security + infra
- `PM` — UX + i18n
- `CQO` — compliance + audit
- `ORC` — synthesis + tokens

> Priority (on conflict): Patient Safety > Compliance > Security > Clinical Correctness > AI > Architecture > UX

---

## 5. Parallel batch strategy

For 20 dept Tier-1 batch:

```
Round 1: read master catalog + snippets (one-time)
Round 2: parallel DISCOVER for depts 1-5
Round 3: parallel PLAN for depts 1-5
Round 4: parallel BUILD clinical sections (CMO batch)
Round 5: parallel BUILD AI sections (AIE batch)
Round 6: parallel BUILD arch (SA batch)
Round 7: parallel BUILD ops/security (DSL batch)
Round 8: parallel BUILD UX (PM batch)
Round 9: parallel BUILD compliance (CQO batch)
Round 10: parallel TEST
Round 11: parallel VERIFY + CLOSEOUT (ORC batch)
Round 12: state update
```

Achieves ~70% wall-time saving.

---

## 6. Tier selection

| Tier | Files | Output tokens (effective) | Priority |
|------|-------|---------------------------|----------|
| 1 | 60 | ~9,000 | 🔴 critical revenue + safety |
| 2 | 40 | ~3,000-4,000 | 🟡 specialty coverage |
| 3 | 25 | ~1,500-2,000 | 🟢 support services |
| 4 | 15 | ~800-1,200 | 🟢 rare/CoE |

---

## 7. Owner signal gates

The autopilot halts at these points:

1. **Any safety rail violation** (13 rails) → HALT + report
2. **CMO veto** → HALT + report
3. **ZATCA CSID missing** → continue with mock, flag in closeout
4. **DB migration requires DROP** → HALT + owner approval
5. **`ops/live_deploy/*` modification requested** → HALT + owner approval
6. **`.ai_rules` or `AGENTS.md` modification** → HALT + owner approval

---

## 8. Output paths

- Blueprints: `.ai-brain/02_MODULES_NEW/<TIER>_<DEPT_ID>/` (60 files)
- Cross-area blueprints: `.ai-brain/99-upgrade/02-...03-.../`
- Skill files: `.ai-brain/skills/nm-<skill-name>/SKILL.md`
- State: `.ai-brain/99-state/current-phase.json`
- Index: `.ai-brain/INDEX.md`

---

## 9. Quality gates (L4 hard gates)

- [ ] All 13 safety rails respected
- [ ] All PII fields encrypted + RLS enabled
- [ ] Red flag check implemented
- [ ] Drug interaction check implemented
- [ ] Citation-first output enforced
- [ ] Test ≥80% coverage per engine
- [ ] Cross-tenant negative test passes
- [ ] Compliance mapped (CBAHI/NPHIES/PDPL/SFDA)
- [ ] i18n keys present (ar/en)
- [ ] OpenAPI 3.1 spec generated
- [ ] ERD (DBML) generated
- [ ] Migration up + down (non-destructive)
- [ ] 60 files complete (no truncation)

---

## 10. Default Commands

```bash
# Activate
load_skill: nm-autopilot-upgrade
load_skill: nm-token-saver-pack
load_skill: nm-7-expert-panel-orchestrator
load_skill: nm-loop-engineering-v2

# One-batch run
mode: MODE 2
tier: 1
scope: [CARD-001, PULM-001, GI-001, NEPH-001, ONC-001]

# Per file
template: TPL:DEPT (auto-selected)
output: .ai-brain/02_MODULES_NEW/<TIER>_<DEPT_ID>/
```

---

*Owner: ORC — version 1.0 — 2026-08-01*
