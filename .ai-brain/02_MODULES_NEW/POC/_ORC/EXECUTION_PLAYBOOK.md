<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# EXECUTION_PLAYBOOK — POC AUTOPILOT

> **Goal:** Produce 35 files × 3 departments = **105 files** in `.ai-brain/02_MODULES_NEW/POC/{CARD-002,NEPH-002,ER-002}/`.
> **Method:** 4-LOOP Engineering (L1_DRAFT → L2_CRITIQUE → L3_REFINE → L4_VALIDATE).
> **Skills active:** S1-S8 Token Saver (~70% saving).
> **Source of truth:** `CONTEXT_BRIEFS.md` in this folder (3 consolidated briefs).
> **Status:** 2026-07-24 — Phase 3-A (POC) starting.

---

## Phase 1: Setup (1 turn, ~2K tokens)

1. Verify folders exist:
   ```
   .ai-brain/02_MODULES_NEW/POC/_ORC/        ✅ (created)
   .ai-brain/02_MODULES_NEW/POC/CARD-002/    ✅
   .ai-brain/02_MODULES_NEW/POC/NEPH-002/    ✅
   .ai-brain/02_MODULES_NEW/POC/ER-002/      ✅
   ```
2. Read canonical references ONCE (per `nm-ai-brain-department-generator`):
   - `.ai-brain/02_MODULES/ER-001/README.md` (template example)
   - `.ai-brain/00_SYSTEM/MASTER_PROMPT_v3.md` (7-Expert + 4-LOOP + S1-S8)
   - `.ai-brain/00_SYSTEM/DEPT_TEMPLATE.yaml` (14-section [TPL:DEPT])
   - `.ai-brain/05_SHARED/COMPLIANCE_CORE.yaml`
   - `.ai-brain/05_SHARED/DESIGN_SYSTEM.yaml`
   - `.ai-brain/06_SHARED/AI_OBSERVABILITY.yaml`
   - `.ai-brain/02_MODULES_NEW/POC/_ORC/SNIPPETS.md` (✅ created)
   - `.ai-brain/02_MODULES_NEW/POC/_ORC/FILE_LIST_TEMPLATE.md` (✅ created)
3. (Optional) Read `CONTEXT_BRIEFS.md` if detailed dept content is needed.

---

## Phase 2: L1_DRAFT (3 subagents in PARALLEL, ~30K tokens)

For each department, launch one **Explore subagent** with the prompt:

```
You are the L1_DRAFT agent for the {DEPT_ID} module.

Read these 3 files:
1. .ai-brain/02_MODULES_NEW/POC/_ORC/CONTEXT_BRIEFS.md (find the section for {DEPT_ID})
2. .ai-brain/02_MODULES_NEW/POC/_ORC/FILE_LIST_TEMPLATE.md (35-file pattern)
3. .ai-brain/02_MODULES_NEW/POC/_ORC/SNIPPETS.md (shared paragraphs)

Generate all 35 files for .ai-brain/02_MODULES_NEW/POC/{DEPT_ID}/.

Rules:
- Each file 50-300 lines (some 01_* can be 400+)
- Use $ref and id_reference (S3) liberally to reduce repetition
- Cite paths back to CONTEXT_BRIEFS section (§X.Y)
- Files must be complete (NO `// ... rest of code` markers)
- First line of each file: `<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->`
- Use SNIPPETS.md for RLS, PHI vault, Stitch, etc. (do not re-write them)
- Specialty: use the DEPT-SPECIFIC content from CONTEXT_BRIEFS §2 (clinical), §3 (AI), §4 (architecture), §5 (UX), §6 (compliance), §8 (engine)
```

**Parallel execution:** Launch all 3 subagents in the SAME tool call (S8 parallel_gen).

---

## Phase 3: L2_CRITIQUE (3 subagents in PARALLEL, ~15K tokens)

**Swap-pair review** — each subagent reviews a different dept's output (catches issues the original agent missed):

| Subagent | Reviews | Reference (for pattern) |
|---|---|---|
| A | NEPH-002 (looking for issues) | CARD-002 |
| B | ER-002 | NEPH-002 |
| C | CARD-002 | ER-002 |

Each critique subagent:
1. Lists all 35 files in the target dept folder
2. Reads each file (skim ~50-200 lines per file)
3. Identifies: missing safety rails, inconsistent i18n, ERD gaps, OpenAPI errors, red flag coverage, test gaps
4. Writes `.ai-brain/02_MODULES_NEW/POC/_ORC/L2_CRITIQUE_{DEPT_ID}.md` with:
   - ✅ List of files that pass
   - ⚠️ List of files with minor issues
   - ❌ List of files with blocking issues
   - Specific line-number references for each finding

---

## Phase 4: L3_REFINE (1 ORC subagent, ~5K tokens)

1. Read all 3 L2_CRITIQUE files.
2. For each dept with findings, list the EXACT fixes needed.
3. Re-launch 3 subagents in parallel (one per dept) with the L2 critique as input.
4. Each subagent: "Read L2_CRITIQUE_{DEPT_ID}.md. Apply the fixes. Do not regenerate from scratch — only fix the listed issues."

---

## Phase 5: L4_VALIDATE (3 subagents in PARALLEL, ~9K tokens)

**6 hard gates per dept** (per `MASTER_PROMPT_v3.md`):

| Gate | Check | File to verify |
|---|---|---|
| 1. Red flags identified | ≥5 items in `04_clinical_red_flags.md` | Trigger/Response/Time fields |
| 2. Drug safety | High-alert list with 2-RN double-check mechanism | `01_clinical_workflows.md` + `04_clinical_red_flags.md` |
| 3. PHI encrypted | Every table has tenant_id + RLS + FORCE RLS | `01_dbml_schema.md` + `01_migration_up.sql` |
| 4. Auth on every endpoint | `requireTenantScope` + `requireRole` + `validateBody` | `04_routes_api.md` + `02_openapi_spec.md` |
| 5. Compliance mapped | JCI + CBAHI + NPHIES + ZATCA + PDPL + SFDA | `01_jci_checklist.md` + `03_pdpl_nphies.md` |
| 6. Tests present | Unit + Integration + E2E with non-trivial assertions | `01_unit_tests.md` + `02_integration_tests.md` + `03_e2e_tests.md` |

Each validator writes `.ai-brain/02_MODULES_NEW/POC/_ORC/L4_VALIDATION_{DEPT_ID}.md` with PASS/FAIL per gate + evidence.

---

## Phase 6: Closeout (1 ORC, ~2K tokens)

1. Write `.ai-brain/02_MODULES_NEW/POC/_ORC/POC_CLOSEOUT.md`:
   - Total files generated (105 expected)
   - Total lines (~15K-20K)
   - L4 pass rate (3/3 expected)
   - Token consumption (target ~63K)
   - Tables added (39 expected: CARD=12, NEPH=13, ER=14)
   - Endpoints added (71 expected: CARD=23, NEPH=26, ER=22)
   - Next steps: P3-B Tier-1 Full (12 depts, ~480 files)

2. Update `.ai-brain/INDEX.md`:
   - Add POC section with 3 dept entries + L4 status

3. Update `.ai-brain/DEPARTMENT_COVERAGE_MAP.md`:
   - Mark CARD-002, NEPH-002, ER-002 as POC-complete (35/35)

4. Update `.ai-brain/99-state/current-phase.json`:
   - Set P3-A status = `completed`
   - Add P3-B as `in_progress` (pending owner go)

5. Create 3 placeholder files in `.ai-brain/02_MODULES_NEW/POC/{DEPT}/` for engine modules:
   - `ENGINE_LINK.md` — points to where the new engine file should live in `namaweb/`
   - `STATION_LINK.md` — points to where the new `*-station.js` should live in `namaweb/public/js/`

---

## Token budget (consolidated)

| Phase | Estimated tokens |
|---|---|
| 1. Setup | 2K |
| 2. L1 (3 subagents × 10K) | 30K |
| 3. L2 (3 subagents × 5K) | 15K |
| 4. L3 (3 fix subagents × 2K + 1 ORC 2K) | 8K |
| 5. L4 (3 validators × 3K) | 9K |
| 6. Closeout | 2K |
| **Total** | **~66K** |

S1-S8 savings: 70% vs unstructured (~220K unstructured). Target hit.

---

## Safety rails (NON-NEGOTIABLE — per AGENTS.md §2.2)

- ❌ No modification of `namaweb/`, `namaweb-ovr-audit-independent/`, `ops/`, `.env`, `.env.example`.
- ❌ No secrets in tracked files (only `__CHANGE_ME__` placeholders).
- ❌ No PHI in commits (sandbox-only dummy data).
- ❌ No `pm2 restart`, no force-push, no merge to main.
- ❌ No DELETE/DROP on production without backup.
- ❌ No `console.log` of req.body, headers, or DB rows.
- ✅ Every file: `BLUEPRINT v2` banner + `tenant_id` + RLS + FORCE RLS.
- ✅ Every endpoint: `requireAuth + requireTenantScope + requireRole + validateBody`.
- ✅ Money routes: `idempotencyGuard` (GATE7).
- ✅ All output to `.ai-brain/02_MODULES_NEW/POC/` ONLY.

---

## Cross-references

| Doc | Purpose |
|---|---|
| `CONTEXT_BRIEFS.md` | 3 consolidated briefs (CARD-002, NEPH-002, ER-002) + ORC cross-cutting notes |
| `SNIPPETS.md` | 12 shared paragraphs (rails, RLS, PHI, Stitch, RBAC, money, idempotency, audit, safety gate, CSP, observability, i18n) |
| `FILE_LIST_TEMPLATE.md` | 35-file template + per-dept differentiation table |
| `MASTER_PROMPT_v3.md` | 7-Expert + 4-LOOP + S1-S8 |
| `AGENTS.md §2.2` | 13 safety rails |
| `DECISIONS_PENDING.md` | Owner decisions (Option A = Express+pg+CBAHI+PDPL+JCI add-on) |

---

## ORC sign-off
Ready for execution. 6 phases mapped. Token budget within limits. Safety rails enforced. — ORC, 2026-07-24
