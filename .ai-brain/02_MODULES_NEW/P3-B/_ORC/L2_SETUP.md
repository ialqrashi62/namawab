<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
phase: P3-B-L2
title: L2_CRITIQUE — 7-Expert Panel review of 22 Tier-1 departments
date: 2026-07-24
status: STARTED
loop: L2_CRITIQUE
owner_signal: "1"
prior_phase: P3-B-TIER1 (L1_DRAFT, completed)
---

# P3-B L2_CRITIQUE — Setup

## 1. Goal

Apply the **7-Expert Panel methodology** to each of the 22 Tier-1
dept L1_DRAFT outputs and produce a structured **critique delta** that
will feed L3_REFINE.

> **L1 = "I think it covers everything"**
> **L2 = "What did I miss? Where is it weak?"**
> **L3 = "Here is the corrected version"**
> **L4 = "All 6 validation gates pass"**

## 2. The 7-Expert Panel (canonical)

| # | Expert | Acronym | Lens | Key questions |
|---|---|---|---|---|
| 1 | **Chief Medical Officer** | CMO | Clinical correctness | Are red flags complete? Are procedures evidence-based? Is the workflow realistic? |
| 2 | **AI Engineer** | AIE | AI/LLM/RAG | Are LangChain chains correctly architected? Is the LLM prompt safe? Is the engine deterministic? |
| 3 | **Solutions Architect** | SA | System design | Is the DBML sound? Are endpoints RESTful? Is middleware chain correct? |
| 4 | **Data / Schema Lead** | DSL | Database / ERD | Are tables normalized? Are RLS policies correct? Are FKs right? |
| 5 | **Product / PM** | PM | Scope & UX | Does the i18n cover the dept? Is the wireframe workflow complete? Is the user manual usable? |
| 6 | **Compliance / Quality Officer** | CQO | CBAHI / JCI / NPHIES / ZATCA / PDPL | Are all compliance gates met? Is audit logging complete? |
| 7 | **Master Orchestrator** | ORC | Cross-cutting | Does the dept harmonize with siblings? Are there conflicts? Is the blueprint internally consistent? |

## 3. Per-Dept Critique Output

For each of the 22 depts, the L2 deliverable is:

```
.ai-brain/02_MODULES_NEW/P3-B/{DEPT}/_L2_CRITIQUE.md
```

Containing:

1. **CMO critique** (clinical gaps, missing red flags, weak workflows)
2. **AIE critique** (RAG/LLM/engine issues)
3. **SA critique** (architecture concerns)
4. **DSL critique** (DBML/schema concerns)
5. **PM critique** (UX/i18n/scope concerns)
6. **CQO critique** (compliance gaps)
7. **ORC critique** (cross-cutting issues)
8. **Severity-ranked fix list** (P0/P1/P2)
9. **Cross-dept dependencies** (which other depts does this block?)
10. **L3 handoff summary** (what L3 must fix)

## 4. Per-Dept Critique Time Budget

| Dept complexity | Files | Time budget |
|---|---|---|
| Standard (e.g. ER-004 Chest Pain) | 34 | ~3-5 min |
| Complex (e.g. CARD-007 Cath Specialized) | 34 | ~5-8 min |
| Very complex (e.g. NNICU, BICU) | 34 | ~6-10 min |

**Total estimated time**: 22 depts × ~6 min avg = ~2-2.5 hours
of focused critique, OR parallelizable to ~30 min via 4-7 subagents.

## 5. Strategy (chosen)

To keep this tractable and reproducible, the L2_CRITIQUE will use
**3 parallelized critique passes per dept** (instead of 7 experts
writing separate critiques):

### Pass A — Clinical + Compliance (CMO + CQO combined)
Files reviewed:
- `01_clinical_workflows.md`
- `04_clinical_red_flags.md`
- `03_pdpl_nphies.md`
- `01_jci_checklist.md`
- `02_iso_9001_checklist.md`
- `03_legal_consent_forms.md`
- `03_icd10_snomed_map.md`

Output: **Clinical+Compliance Gap List** (red flags, CPT, ICD, consent, retention)

### Pass B — Architecture + Data (SA + DSL combined)
Files reviewed:
- `01_dbml_schema.md`
- `01_migration_up.sql`
- `01_migration_validate.sql`
- `02_migration_down.sql`
- `07_erd_diagram.md`
- `04_routes_api.md`
- `05_middleware_chain.md`
- `06_data_flow.md`
- `02_openapi_spec.md`
- `08_architecture_decision_record.md`

Output: **Architecture+Data Gap List** (table design, RLS, FKs, endpoints, middleware)

### Pass C — AI + UX + Cross-cutting (AIE + PM + ORC combined)
Files reviewed:
- `01_rag_chains.md`
- `02_vector_store_schema.md`
- `03_llm_prompts.md`
- `04_llm_observability.md`
- `03_engine_module.md`
- `01_unit_tests.md`
- `02_integration_tests.md`
- `03_e2e_tests.md`
- `01_stitch_layout.md`
- `02_wireframes.md`
- `01_user_manual.md`
- `02_training_video_script.md`
- `03_i18n_keys.md`
- `04_design_tokens.md`
- `04_helpdesk_runbook.md`
- `02_sub_dept_catalog.md`
- `README.md`

Output: **AI+UX Gap List** (RAG, prompts, engines, tests, UX, i18n)

## 6. Severity Tiers

| Tier | Meaning | L3 must address? |
|---|---|---|
| **P0** | Safety/compliance blocker (PHI leak, missing red flag, broken RLS, missing idempotency on money route) | YES, before any further work |
| **P1** | Quality issue that affects clinical/operational correctness (missing CPT, wrong table FK, weak LLM prompt) | YES, in L3 |
| **P2** | Polish issue (typo, i18n coverage, design token tweak) | NICE-TO-HAVE in L3 |
| **P3** | Out of scope for L3 (would need a deeper change) | DEFER to L4+ or next phase |

## 7. Acceptance for L2

- [ ] All 22 depts have `_L2_CRITIQUE.md`
- [ ] Each has 3 passes (Clinical+Compliance, Architecture+Data, AI+UX)
- [ ] Each has a severity-ranked fix list (P0/P1/P2)
- [ ] Cross-dept dependencies noted
- [ ] L3 handoff summary present
- [ ] No fabrication — critique must reference actual L1 content
- [ ] L2 does NOT modify the L1 files (read-only review)

## 8. Tooling

To stay within token budget and consistent quality:

- **Reusable critique templates** — `02_MODULES_NEW/P3-B/_ORC/CRITIQUE_TEMPLATE.md`
- **Cross-cutting checklist** — `02_MODULES_NEW/P3-B/_ORC/CRITIQUE_CHECKLIST.md`
- **Severity rubric** — defined above
- **Batch scripts** — same `WF` function as L1 generation
  (`generate_p3b_l2_critique.ps1` and successors)

## 9. Cross-Dependency Map (preliminary)

Some depts share critical interfaces and should be critiqued
together to surface interface conflicts:

| Cluster | Depts | Shared interface |
|---|---|---|
| **Cardiac cluster** | CARD-003..009 | `cardiac_procedure_log`, `cardiac_medication` |
| **Renal cluster** | NEPH-003..004, BICU (burn→CRRT) | `dialysis_session`, `crrt_session` |
| **Trauma cluster** | ER-003 (L2), TICU, ER-002 (L1) | `trauma_activations`, `mtp_log` |
| **Stroke cluster** | ER-005, TICU, CCU | `stroke_metrics`, `door_to_needle` |
| **Pediatric cluster** | ER-007, PICU, NNICU, NEPH-004 | `peds_dosing`, `growth_chart` |
| **Critical care cluster** | MICU, SICU, TICU, CCU, PICU, NNICU, BICU | `icu_daily`, `vent_settings`, `sepsis_bundle` |
| **Pharmacy-touching** | All (drug safety) | `medication_admin` |

## 10. Open Questions for Owner (if any)

None at this point. The critique is well-scoped and can proceed
without further input.

---
*ORC: P3-B L2_CRITIQUE setup complete. Ready to begin the 3-pass critique of 22 depts.*
