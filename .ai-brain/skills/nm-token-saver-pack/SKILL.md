# nm-token-saver-pack v2

> **Type:** meta-skill (compression)
> **8 techniques** in one pack
> **Target reduction:** 60-70% of baseline output
> **Apply:** before any large .ai-brain generation

---

## Description

Eight token-reduction techniques packaged into a single skill. Apply them by default when generating departments, docs, plans, or any large artifact. Combined with snippet reuse, the pack cuts output 60-70% vs. verbose baseline.

## The 8 techniques (S1-S8)

### S1 — schema_first
Output the **schema / table-of-contents first**, then fill. Saves 25% on retry cycles.

```yaml
# instead of: "I'll create 60 files. First, let me explain..."
# do:
schema:
  files: [60 entries with one-line description each]
  est_tokens: 9000
  apply: ok
```

### S2 — chunked_reasoning
For long tasks, **think in 500-token chunks**. After each chunk, write a 1-line checkpoint, then continue.

```yaml
checkpoint_1: "60 file paths defined"
checkpoint_2: "CMO + AIE done"
checkpoint_3: "SA + DSL done"
checkpoint_4: "PM + CQO done"
checkpoint_5: "ORC synthesis + INDEX update"
```

### S3 — id_reference
Use **stable IDs** for every artifact. Reference by ID, not by full path each time.

```yaml
ids:
  dept: "CARD-001"
  engine: "cardiology_engine_v1"
  table_set: "cardio_v1"
  api_group: "cardiology_v1"
  stitch_layout: "B"
  rag_index: "nm_cardio_v1"
```

### S4 — templated_output
Every artifact has a **template ID**. Use `template:<id>` to instantiate. Templates are stored in `.ai-brain/templates/`.

```
template:dept_brain        # 5-section brain.md
template:openapi_3_1       # OpenAPI spec
template:dbml_v1           # DBML schema
template:adr_v1            # Architecture Decision Record
template:rls_policy        # RLS up/down
template:user_story        # user story
template:wireframe_v1      # Stitch wireframe
template:closeout          # phase closeout
```

### S5 — cached_context
Read all reference docs **once per session**, then re-use without re-reading. Use `shared/snippets.md` as the canonical snippet store.

```
on session start:
  load: MASTER_CATALOG_v3.yaml
  load: snippets.md
  load: 7-expert panel SKILL
  load: 5-loop SKILL
  load: dept-blueprint-template-v2 SKILL
  load: stitch-medical-ui SKILL
  load: rag-vector-mine SKILL
  load: comprehensive-deliverables SKILL
  do NOT re-read: per-dept
```

### S6 — compressed_prompts
Prompts use **dense bullet form**, not essays.

```yaml
# BAD: "Please consider all the following clinical guidelines and red flags..."
# GOOD:
clinical_red_flags: [STEMI, dissection, tamponade, PE, SCD-risk]
guidelines: [ACC-AHA-2024, ESC-2023, NPHIES-CARDIO]
```

### S7 — selective_depth
**Tier-1 depts get full depth (60 files). Tier-2 get 40. Tier-3 get 25. Tier-4 get 15.**

| Tier | Files | Token est | Wall time est |
|------|-------|-----------|---------------|
| 1 | 60 | 9,000 | 1 session |
| 2 | 40 | 6,000 | <1 session |
| 3 | 25 | 3,500 | <1 session |
| 4 | 15 | 2,000 | <1 session |

### S8 — parallel_gen
Run **CMO + AIE + SA + DSL + PM + CQO in parallel** when generating one dept. Each expert produces their files independently, then ORC merges.

```
parallel:
  CMO: [files 1-5]
  AIE: [files 6-13]
  SA:  [files 14-25]
  DSL: [files 33-41]
  PM:  [files 26-32, 53-55, 58-59]
  CQO: [files 42-48]
  ORC: [files 49-52, 56-57, 60]
merge:
  order: [CMO, AIE, SA, DSL, PM, CQO]
  final: ORC
```

## Snippet store

Canonical snippet file: `.ai-brain/skills/shared/snippets.md`

Required snippets (each ~50 tokens, all referenced by `snippet:<id>`):

| ID | Purpose | Lines |
|----|---------|-------|
| `snippet:rls-default` | RLS enable + FORCE statement | 5 |
| `snippet:phi-vault` | crypto_envelope + DPAPI KEK | 5 |
| `snippet:stitch-3col` | 3-column station layout | 5 |
| `snippet:golden-access` | Owner-Admin vs Specialty rule | 5 |
| `snippet:safety-gate` | validateBody + requireTenantScope | 5 |
| `snippet:audit-hash` | hash-chained audit trail | 5 |
| `snippet:money-vat` | server-side VAT only | 5 |
| `snippet:csp-report-only` | CSP report-only default | 5 |
| `snippet:auth-mfa` | Auth + MFA + session | 5 |
| `snippet:idempotency` | idempotency guard for money | 5 |
| `snippet:ar-rtl` | AR + RTL i18n | 5 |
| `snippet:stitch-medical` | Stitch medical design tokens | 5 |
| `snippet:langchain-rag` | LangChain + PGVector pattern | 5 |
| `snippet:vector-mine` | VectorMine index naming | 5 |
| `snippet:openapi-3-1` | OpenAPI 3.1 spec header | 5 |
| `snippet:dbml-header` | DBML header + tenant pattern | 5 |
| `snippet:adr-header` | ADR header | 5 |
| `snippet:test-pattern` | unit/integration/e2e test layout | 5 |

**Total snippet library:** ~18 snippets × 50 tokens = 900 tokens one-time cost, reused 100+ times.

## Token math

```
Baseline (no skill):       15,000 tokens / dept
+ S1 schema_first:         -25% → 11,250
+ S2 chunked_reasoning:    -5%  → 10,687
+ S3 id_reference:         -5%  → 10,153
+ S4 templated_output:     -10% → 9,137
+ S5 cached_context:       -10% → 8,224
+ S6 compressed_prompts:   -10% → 7,401
+ S7 selective_depth:      -20% (tier-2+) → 5,921
+ S8 parallel_gen:         -5% (saves wall-time)
+ snippet reuse:           -30% on common paragraphs
─────────────────────────────────────────────
Effective Tier-2 dept:     ~3,000-4,000 tokens
```

## How to invoke

```
Use nm-token-saver-pack.
Goal: <one sentence>
Tier: 1|2|3|4
Apply S1-S8 automatically.
Reuse snippets from shared/snippets.md.
Output target: <token number>
```

## Rules

- Never paste large excerpts from reference docs.
- Never re-explain the tech stack in every file.
- Always reference helper skills by name.
- Always use `snippet:<id>` instead of re-writing common paragraphs.
- Always batch similar departments.
- Always include the `token_used` field in final output.
