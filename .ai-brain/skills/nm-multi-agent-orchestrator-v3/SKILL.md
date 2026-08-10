---
name: nm-multi-agent-orchestrator-v3
description: Token-saver for parallel multi-agent orchestration. Splits one task into N sub-agents (researcher/coder/tester/auditor) running concurrently. Use when "parallel", "multi-agent", "split task", "faster delivery".
version: 3.0.0
---

# nm-multi-agent-orchestrator-v3

## The 7-Expert Panel pattern

For 44-bucket dept blueprints, split work into 7 parallel agents:

| Agent | Files |
|---|---|
| **CMO** (clinical) | 01_brain, 02_clinical_spec, 31_user_manual_ar, 32_user_manual_en |
| **AI engineer** | 03_ai_orchestration, 08_prompt_engineering, 10_langchain_chains, 17_rag_pipeline |
| **Architect** | 04_technical_architecture, 12_api_openapi, 13_data_erd, 25_style_guide |
| **DevOps** | 06_compliance_security, 38_apm_logging, 40_llm_observability, 43_pentest |
| **UX/UI** | 05_ux_ui_stitch, 22_frontend_page, 23_frontend_components, 44_stitch_google |
| **Compliance** | 26_i18n_ar, 27_i18n_en, 34_legal_compliance, 42_rbac_matrix |
| **PM/QA** | 07_implementation_plan, 28_test_unit, 29_test_integration, 30_test_bdd, 35_pmo |

Each runs concurrently → 7× speedup.

## Token cost (parallel)

| Without multi-agent | With multi-agent |
|---|---|
| 7 × 5k tokens sequential = 35k total | max(5k per agent) = 5k total |
| Time: 7 × 30s = 210s | Time: 30s |

**~7× speedup + same token cost** because each agent sees only its own files.

## How to invoke

In agent prompt:
> "Use 7-Expert Panel pattern: split dept blueprint into 7 sub-agents, run in parallel, merge results."

Or:
```bash
/agents --panel=7 --task=generate-dept-blueprint --dept=DEP-001_cardiology
```

## Mandatory safety rails

- 13 safety rails from AGENTS.md §2.2 apply
- All agents read-only access to `.ai-brain/00_SYSTEM/` (no edits)
- All agents write-only to their assigned file prefix
- Final merge step validates no schema conflicts

## Sub-agent contract

Each agent gets:
- Master plan path
- Dept folder path
- List of files to write
- Style guide (token-saver snippet)
- Safety rails reminder
