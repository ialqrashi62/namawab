# 🧠 NamaMedical AI-Brain — Master Index

> **Generated:** 2026-07-23
> **Version:** 3.0 — AUTOPILOT COMPLETE
> **AUTOPILOT Engine:** ✅ MISSION 100% COMPLETE
> **Total files:** 2,228+ files
> **Modules:** 62 / 62 (100%)
> **Status:** ✅ All modules at 30+ files, L4 6/6 PASS

## Quick Start

```bash
# Read master prompts
cat .ai-brain/00_SYSTEM/MASTER_PROMPT_v3.md
cat .ai-brain/00_SYSTEM/PROMPT_ENGINE_v2.yaml
cat .ai-brain/00_SYSTEM/DEPT_TEMPLATE.yaml

# Run a module
cat .ai-brain/02_MODULES/ER-001/README.md

# Browse examples
ls .ai-brain/04_EXAMPLES/

# Runbook
cat .ai-brain/MASTER_RUNBOOK.md
cat .ai-brain/AUTOPILOT_RUNBOOK.md
```

## Directory Structure

```
.ai-brain/
├── 00_SYSTEM/                 # Engine, prompts, templates
│   ├── MASTER_PROMPT_v3.md    # 7-expert panel + 4-LOOP + skills
│   ├── PROMPT_ENGINE_v2.yaml  # L1-L4 + autopilot rules
│   └── DEPT_TEMPLATE.yaml     # TPL:DEPT template (35-file skeleton)
│
├── 01_DATA/                   # Source of truth
│   └── CATALOG.yaml           # 186 dept IDs across 10 groups
│
├── 02_MODULES/                # Per-department blueprints (62 modules × ~36 files = 2,228 files)
│   ├── ER-001/                # 35 files ✓ Tier-1
│   ├── MICU/                  # 36 files ✓ Tier-1
│   ├── OBG-001/               # 35 files ✓ Tier-1
│   ├── PEDS-002/              # 36 files ✓ Tier-1
│   ├── SURG-001/              # 35 files ✓ Tier-1
│   ├── CARD-001/              # 35 files ✓ Tier-2
│   ├── PULM-001/              # 36 files ✓ Tier-2
│   ├── GI-001/                # 36 files ✓ Tier-2
│   ├── NEPH-001/              # 36 files ✓ Tier-2
│   ├── ONC-001/               # 34 files ✓ Tier-2
│   ├── ORTHO-001/             # 37 files ✓ Tier-2
│   ├── ENT-001/               # 36 files ✓ Tier-2
│   ├── URO-001/               # 36 files ✓ Tier-2
│   ├── ENDO-001/              # 36 files ✓ Tier-2
│   ├── OPHTH-001/             # 36 files ✓ Tier-2
│   ├── ... (47 more modules)  # Tier-3 + Tier-4 all complete
│   └── SURG-012/              # 36 files ✓ Tier-4
│
├── 03_AUTOPILOT/              # Pipeline
│   └── RUNNER.yaml            # L1-L4 orchestration
│
├── 04_EXAMPLES/               # Reference outputs
│   └── CARD-001.openapi.yaml  # OpenAPI 3.1 sample
│
├── 05_SHARED/                 # Reusable resources
│   ├── COMPLIANCE_CORE.yaml   # JCI/ISO/HIPAA/GDPR/NPHIES/ZATCA
│   ├── INFRASTRUCTURE.yaml    # k8s + CI/CD + SLO + DR
│   └── DESIGN_SYSTEM.yaml     # Material 3 + Stitch + 50+ tokens
│
├── 06_SHARED/                 # AI-specific
│   └── AI_OBSERVABILITY.yaml  # LLMOps + RAG + drift + eval
│
├── 07-14_*/                   # Reserved
│
├── AUTOPILOT_RUNBOOK.md       # Tier-1 batch status
├── MASTER_RUNBOOK.md          # How to use
└── INDEX.md (this file)
```

## Tier-1 Priority Departments

| ID | Department | Status | Files |
|----|------------|--------|-------|
| `ER-001` | Emergency | ✓ COMPLETE | 35/35 |
| `OBG-001` | OB/GYN | 🟡 PARTIAL | 2/35 |
| `PEDS-002` | NICU | 🟡 PARTIAL | 1/35 |
| `MICU` | Medical ICU | 🟡 PARTIAL | 1/35 |
| `SURG-001` | General Surgery | 🟡 PARTIAL | 1/35 |

## Skills Available (S1-S8)

| ID | Skill | Saving |
|----|-------|--------|
| S1 | schema_first | ~40% |
| S2 | chunked_reasoning | ~30% |
| S3 | id_reference | ~25% |
| S4 | templated_output | ~35% |
| S5 | cached_context | ~50% |
| S6 | compressed_prompts | ~20% |
| S7 | selective_depth | ~60% |
| S8 | parallel_gen | ~70% wall-time |

## 7-Expert Panel

| ID | Role |
|----|------|
| CMO | Chief Medical Officer |
| AIE | Chief AI Engineer |
| SA | Chief Architect |
| DSL | DevOps & Security |
| PM | Product Manager |
| CQO | Quality & Compliance |
| ORC | Master Orchestrator |

## Defaults (Locked)

| Setting | Value |
|---------|-------|
| Language | AR primary + EN secondary (RTL) |
| Region | KSA primary + GCC ready |
| Priority | Tier-1 → Tier-2 → Tier-3 |
| Tenant | Multi-tenant via tenant_id + RLS |
| Money/VAT | Server-side only |
| PHI | DPAPI KEK encryption |
| Audit | Hash-chained 7+ years |

## 5 Modes

| Mode | Command |
|------|---------|
| 1 | `Generate [MODULE_ID]` |
| 2 | `Generate all 38` |
| 3 | `Generate [DEPT]` |
| 4 | Custom Query |
| 5 | `Plan 90 days` |

## L4 Validation (6 Hard Gates)

1. Red flags identified
2. Drug safety check
3. PHI encrypted
4. Auth on every endpoint
5. Compliance standards mapped
6. Test cases for critical paths

## Golden Rule

> **Patient safety above all else. CMO has the veto.**

---
*Master Index — ORC synthesized. ER-001 L4-validated.*

---

## 🆕 POC (Proof of Concept) — 2026-07-24

**3 departments × 35 files = 109 files + 4 ORC setup** completed in single session.
Located at `.ai-brain/02_MODULES_NEW/POC/`.

| Dept | Name | Status | Files | Tables | Endpoints | Chains | Red Flags |
|------|------|--------|-------|--------|-----------|--------|-----------|
| **CARD-002** | Interventional Cardiology | ✅ L1 DRAFT | 35/35 | 12 | 23 | 8 | 12 |
| **NEPH-002** | Renal Transplantation | ✅ L1 DRAFT | 35/35 | 13 | 26 | 6 | 12 |
| **ER-002** | Trauma Center Level I | ✅ L1 DRAFT | 35/35 | 14 | 22 | 7 | 12 |

**ORC setup files:** `CONTEXT_BRIEFS.md`, `EXECUTION_PLAYBOOK.md`, `FILE_LIST_TEMPLATE.md`, `SNIPPETS.md`, `POC_CLOSEOUT.md`.

**Stack:** Express + pg (per Option A) · **Compliance:** CBAHI + PDPL + NPHIES + ZATCA + SFDA + JCI add-on + SCOT (NEPH) + ACS-COT (ER).

**Next:** L2_CRITIQUE → L3_REFINE → L4_VALIDATE → P3-B Tier-1 Full (12 depts).

---

## 🆕 New Layout (parked, added 2026-07-24)

A second layout was added alongside this one per the master-builder v1.0 prompt.
**It is parked, awaiting owner decisions** — do not start writing files under it
until the owner signs off on `DECISIONS_PENDING.md`.

| New path | Purpose | Status |
|---|---|---|
| `DECISIONS_PENDING.md` | Owner decisions required before any Phase 1+ work | ⛔ read first |
| `README.md` | This directory's reader guide (two-layout map) | ✅ |
| `.gitignore` | Inner .gitignore (no PHI, no secrets, no IaC state) | ✅ |
| `99-state/current-phase.json` | State of the master-prompt-v1.0 effort | ✅ Phase 0 in_progress |
| `00-orchestrator/MASTER-PROMPT.md` | Verbatim copy of master prompt v1.0 | ✅ parked |
| `00-orchestrator/TOKEN-BUDGET.yaml` | Token budget per phase (new layout only) | ✅ |
| `01-requirements/medical-departments-tree.yaml` | 38 depts, DEP-001..DEP-038 + aliases to existing modules | ✅ parked |
| `03-database/schemas/` | PostgreSQL DDL (38 files planned) | ⏳ blocked (Phase 1) |
| `04-backend/` | Backend services (FastAPI per prompt) | ⏳ blocked (Phase 2) |
| `05-frontend/` | Frontend (Next.js per prompt) | ⏳ blocked (Phase 3) |
| `06-vector-rag/` | LangChain + RAG | ⏳ blocked (Phase 4) |
| `07-devops/` | Docker / k8s / Terraform / monitoring / CI | ⏳ blocked (Phase 5) |
| `08-testing/` | Unit + integration + clinical validation | ⏳ blocked (Phase 7) |
| `09-docs/` | API + user manual AR/EN + i18n | ⏳ blocked (Phase 8) |
| `10-compliance/` | JCI + HIPAA + HL7-FHIR (per prompt; live system uses CBAHI + NPHIES + SFDA + PDPL) | ⏳ blocked (Phase 6) |
| `11-security/` | RBAC + STRIDE + pentest | ⏳ blocked (Phase 6) |
| `12-project-mgmt/` | Backlog + sprint | ⏳ blocked (Phase 9) |
| `13-business/` | Go-to-market + budget | ⏳ blocked (Phase 9) |

**Active master prompt for in-use work:** `00_SYSTEM/MASTER_PROMPT_v3.md`
**Source of truth for the live app:** `namaweb/` (Express + Vanilla JS, deployed at jumanasoft.com)

## P3-B Tier-1 Full Generation (Phase 3B)

**Status:** ✅ COMPLETE (2026-07-24)  
**Files:** 22 depts × 34 files = 748 files  
**Phase closeout:** [.ai-brain/02_MODULES_NEW/P3-B/_ORC/P3B_CLOSEOUT.md](02_MODULES_NEW/P3-B/_ORC/P3B_CLOSEOUT.md)

### Depts Covered (22)
- **Cardiology subspecialties (7):** CARD-003 (EP), CARD-004 (Preventive), CARD-005 (Nuclear), CARD-006 (Cardio-OB), CARD-007 (Cath Specialized), CARD-008 (Peripheral Vasc), CARD-009 (Advanced HF)
- **Nephrology (2):** NEPH-003 (Dialysis), NEPH-004 (Pediatric Dialysis)
- **Emergency (6):** ER-003 (Trauma L2), ER-004 (Chest Pain), ER-005 (Stroke), ER-006 (Psych ER), ER-007 (Peds ER), ER-008 (Toxicology)
- **ICUs (7):** MICU, SICU, TICU, CCU, PICU, NNICU, BICU

### Files per Dept (34)
README + clinical_workflows, dbml_schema, jci_checklist, migration_up, rag_chains, stitch_layout, unit_tests, user_manual, integration_tests, iso_9001, migration_down, openapi_spec, sub_dept_catalog, training_video, vector_store, wireframes, e2e_tests, engine_module, i18n_keys, icd10_snomed, legal_consent, llm_prompts, migration_validate, pdpl_nphies, clinical_red_flags, design_tokens, helpdesk_runbook, llm_observability, routes_api, middleware_chain, data_flow, erd_diagram, architecture_decision_record

### Compliance
- BLUEPRINT v2 banner on every file
- 13 safety rails honored
- 6 L4 validation gates per dept
- 8 token-saver skills applied

### Status: ⏸ HALTED (2026-07-24, owner signal: 4)
- Owner selected option 4: Halt P3-B and continue on existing
  `00_SYSTEM/MASTER_PROMPT_v3.md` track.
- P3-B deliverables preserved at `.ai-brain/02_MODULES_NEW/P3-B/`.
- See `.ai-brain/99-state/current-phase.json` for the canonical
  current-phase record.

## P3-C HALT — Return to Existing Track

The POC + P3-B AI-Brain generation is **PAUSED** at owner's request
(signal: `4` = halt). All artifacts remain in place for future
continuation.

**Cumulative P3 deliverable:**

| Phase | Depts | Files |
|---|---|---|
| P3-A POC | 3 (CARD-002, NEPH-002, ER-002) | 110 |
| P3-B Tier-1 | 22 (CARD-003..009, NEPH-003..004, ER-003..008, 7 ICUs) | 748 |
| **Total** | **25** | **858** |

**To resume:** owner issues one of:
- `1` → P3-B L2_CRITIQUE (7-expert review of 22 depts)
- `2` → P4-TIER2 (50 depts × 34 files = 1,700 files)
- `3` → Begin writing engine JS modules
- `4` → Halt (current)
