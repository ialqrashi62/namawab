# CARD-302_ADHF — Token Budget

## Per-File Estimate (Compressed with Skills)

| File | Tokens |
|---|---|
| 01-07 (Docs, prompts, RAG) | 2,500 |
| 08_engine.js | 1,000 |
| 09_router.js | 800 |
| 10_data_model.md | 350 |
| 11-12 (Migrations) | 550 |
| 13_vector_table.sql | 500 |
| 14_rag_pipeline.js | 500 |
| 15-18 (Stitch HTML) | 600 |
| 19-22 (Infra/CI) | 600 |
| 23-25 (Tests) | 1,000 |
| 26-29 (Docs) | 1,500 |
| 30-34 (Docs) | 1,500 |
| 35_style_guide.json | 250 |
| 36-39 (i18n 4 locales) | 800 |
| 40_seeder.js | 300 |
| 41-42 (Manuals) | 1,000 |
| 43-44 (Training, Legal) | 700 |
| 45-46 (PM, Tasks) | 500 |
| 47_budget_tokens.md | 200 |
| 48-51 (APM, Analytics, LLM, SEO) | 700 |
| **TOTAL** | **~14,000** |

## Total vs 51-file dept library
- 51 files × 240 avg tokens = ~12,250 baseline
- ADHF (more clinical complexity) = +15% = ~14,000

## Skill Savings

| Skill | Files | Saving |
|---|---|---|
| nm-token-saver-pack-v2 | All | 25% |
| (S1) schema_first | DB | 40% |
| (S3) id_reference | All | 25% |
| (S4) templated_output | All | 35% |
| (S7) selective_depth | Docs | 60% |
| (S8) parallel_gen | 4 parallel | 70% wall-time |

## Cumulative (3 depts built)

| Dept | Tokens |
|---|---|
| TIER3_CARD-301_STROKE | 12,950 |
| TIER3_CARD-302_ADHF | 14,000 |
| TIER3_CARD-303_ONCO (next) | ~14,000 |
| **Total so far** | **~40,950** |

## 122-Dept Total Estimate
- 122 × 14,000 avg = 1,708,000 raw tokens
- With 60-70% skill savings = **~512K-680K tokens**
