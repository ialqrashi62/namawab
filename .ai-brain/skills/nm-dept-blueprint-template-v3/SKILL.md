---
name: nm-dept-blueprint-template-v3
description: The 44-bucket blueprint contract for each department. Generates a complete spec for one clinical or operational dept in ~3000 tokens (vs 10k+ naive). Combines snippet IDs + table-first.
version: 3.0.0
---

# nm-dept-blueprint-template-v3

## The 44 buckets per dept

| # | Bucket | Format | Snippet? |
|---|---|---|---|
| 1 | 01_brain.md | Markdown | partial |
| 2 | 02_clinical_spec.md | Markdown | partial |
| 3 | 03_ai_orchestration.md | Markdown | partial |
| 4 | 04_technical_architecture.md | Markdown | high |
| 5 | 05_ux_ui_stitch.md | Markdown | high |
| 6 | 06_compliance_security.md | Markdown | high |
| 7 | 07_implementation_plan.md | Markdown | partial |
| 8 | 08_prompt_engineering.md | Markdown | partial |
| 9 | 09_workflow_orchestration.md | Markdown | partial |
| 10 | 10_langchain_chains.md | Markdown | partial |
| 11 | 11_vector_mine.md | Markdown | partial |
| 12 | 12_api_openapi.yaml | YAML | partial |
| 13 | 13_data_erd.sql | SQL | partial |
| 14 | 14_data_migrations_up.sql | SQL | partial |
| 15 | 15_data_migrations_down.sql | SQL | partial |
| 16 | 16_data_seed.sql | SQL | partial |
| 17 | 17_rag_pipeline.py | Python | partial |
| 18 | 18_backend_models.py | Python | high |
| 19 | 19_backend_schemas.py | Python | high |
| 20 | 20_backend_service.py | Python | partial |
| 21 | 21_backend_router.py | Python | high |
| 22 | 22_frontend_page.tsx | TSX | high |
| 23 | 23_frontend_components.tsx | TSX | high |
| 24 | 24_frontend_api_client.ts | TS | high |
| 25 | 25_style_guide_tokens.json | JSON | high |
| 26 | 26_i18n_ar.json | JSON | high |
| 27 | 27_i18n_en.json | JSON | high |
| 28 | 28_test_unit.py | Python | high |
| 29 | 29_test_integration.py | Python | partial |
| 30 | 30_test_bdd.feature | Gherkin | high |
| 31 | 31_user_manual_ar.md | Markdown | partial |
| 32 | 32_user_manual_en.md | Markdown | partial |
| 33 | 33_training_video_script.md | Markdown | high |
| 34 | 34_legal_compliance.md | Markdown | high |
| 35 | 35_pmo_budget.md | Markdown | high |
| 36 | 36_seo_plan.md | Markdown | high |
| 37 | 37_helpdesk_plan.md | Markdown | high |
| 38 | 38_apm_logging.md | Markdown | high |
| 39 | 39_user_analytics.md | Markdown | high |
| 40 | 40_llm_observability.md | Markdown | high |
| 41 | 41_auth_sso.md | Markdown | high |
| 42 | 42_rbac_matrix.md | Markdown | partial |
| 43 | 43_pentest_plan.md | Markdown | high |
| 44 | 44_stitch_google.html | HTML | high |

**High snippet usage** = mostly reusable snippets
**Partial snippet** = ~30-50% dept-specific content
**No snippet** = full dept content

## How to invoke

```bash
/dept-blueprint --dept=DEP-001_cardiology
```

Or:
> "Use nm-dept-blueprint-template-v3 to generate all 44 buckets for DEP-XXX_name."

## Per-bucket template (dept-agnostic)

Each bucket follows this structure:
- **Header** — name + dept_id + last_updated + safety_rails
- **TL;DR** — 3-bullet summary
- **Section 1** — table or list
- **Section 2** — code/snippet block
- **Section 3** — references to other depts

## Token-saver examples

### Naive (verbose)
```markdown
The user logs in by submitting credentials. The server validates against bcrypt-hashed password...
[500 words]
```

### Token-saver v3 (table-first)
```markdown
| Step | Code | Snippet |
|---|---|---|
| 1. Login | `POST /api/auth/login` | [SNIP:authLogin] |
| 2. MFA | `POST /api/auth/mfa` | [SNIP:mfaTotp] |
```

**Savings: 80%**

## Mandatory dependencies

- `nm-token-saver-v3` — for snippet IDs
- `nm-stitch-medical-v2` — for HTML/UI snippets
- `nm-multi-agent-orchestrator-v3` — for parallel generation

## Quality gate

Before completing, verify:
- All 44 files exist
- Each file ≥ 500 bytes (no empty stubs)
- No placeholder TODO/FIXME in production-bound files
- Cross-links to 00_SYSTEM docs work
- Schema files compile (Python imports)
- YAML files parse (OpenAPI 3.0)
- SQL files parse (psql --no-psqlrc -f)
