---
name: nm-token-saver-pack
description: Use on EVERY generation run for the NamaMedical AI-brain. Applies S1-S8 token-saver techniques + snippet reuse to keep dept blueprint generation between 3K-9K tokens. Default activation. Token saver.
---

# nm-token-saver-pack

> **Purpose:** Cut token consumption 60-80% without losing quality. 8 techniques + snippet reuse + tier-aware depth.

---

## Quick reference

| Skill | Rule | Saving |
|-------|------|--------|
| **S1** schema_first | Define JSON schemas once, reuse | 25% |
| **S2** chunked_reasoning | Process in batches of ≤5 | 5% |
| **S3** id_reference | `CARD-001` not "Cardiology General" | 5% |
| **S4** templated_output | Use `TPL:DEPT`, `TPL:API`, `TPL:ERD` | 10% |
| **S5** cached_context | Reference previous sections by ID | 10% |
| **S6** compressed_prompts | Abbr: `CMO, AIE, SA, DSL, PM, CQO, ORC` | 10% |
| **S7** selective_depth | Tier-aware depth | 20% |
| **S8** parallel_gen | 4-8 parallel calls | wall-time |
| **+ snippet reuse** | Use `.ai-brain/skills/shared/snippets.md` | 30% |

---

## S1 — schema_first

Always create JSON schema first, **then** reference everywhere.

```yaml
schema_id: SCHEMA:CARD:encounter
version: 1.0
required: [encounter_type, patient_id, clinician_id]
properties:
  encounter_type: { enum: [initial, follow_up, urgent, discharge] }
  ...
```

Reference: `$ref: SCHEMA:CARD:encounter` (don't paste the whole thing).

---

## S2 — chunked_reasoning

When listing items >5:
- Generate 5 at a time
- Merge after

---

## S3 — id_reference

Always use module IDs:
- ✅ `CARD-001`
- ❌ "the cardiology department"

Aliases mapping kept in `.ai-brain/01_DATA/DEPARTMENT_ALIAS_MAP.yaml`.

---

## S4 — templated_output

Use the canonical templates:

| Template ID | Used for |
|-------------|----------|
| `TPL:DEPT` | dept brain.md (60 files) |
| `TPL:PROMPT` | prompt engineering files |
| `TPL:API` | OpenAPI patterns |
| `TPL:ERD` | DBML diagrams |
| `TPL:WORKFLOW` | care pathways |
| `TPL:WIREFRAME` | Stitch page |
| `TPL:RAG` | RAG chains |
| `TPL:TEST` | test plans |
| `TPL:COMPLIANCE` | CBAHI/NPHIES/PDPL |
| `TPL:DEPLOY` | ops/deploy |
| `TPL:I18N` | ar/en keys |
| `TPL:CLOSE` | closeout report |

---

## S5 — cached_context

Always reference previous sections by ID:

```markdown
- See [§22 migration_up.sql](../../22_migration_up.sql)
- Per `[PROMPT_REGISTRY.yaml#PROMPT:CARD-001:initial_assessment]`
```

---

## S6 — compressed_prompts

Use these abbreviations in panel context:

| Code | Role |
|------|------|
| `CMO` | Chief Medical Officer |
| `AIE` | Chief AI Engineer |
| `SA` | Solution Architect |
| `DSL` | DevSecOps Lead |
| `PM` | Product Manager |
| `CQO` | Chief Quality/Compliance Officer |
| `ORC` | Master Orchestrator (synthesizer) |

Other useful short codes:
- `KSA`, `PDPL`, `CBAHI`, `NPHIES`, `ZATCA`, `SFDA`, `JCI`
- `RAG`, `TPM`, `RBAC`, `RLS`, `MFA`, `PHI`, `FHIR`
- `AMI`, `ACS`, `CVA`, `DKA`, `PE` (clinical standard)

---

## S7 — selective_depth (tier-aware)

| Tier | Depth | Files/dept | Output tokens (effective) |
|------|-------|-----------|---------------------------|
| **1** (critical) | full | 60 | ~9,000 |
| **2** (specialty) | medium | 40 | ~3,000-4,000 |
| **3** (support) | standard | 25 | ~1,500-2,000 |
| **4** (rare) | minimal | 15 | ~800-1,200 |

Critical files always go to max depth (clinical, security, compliances).

---

## S8 — parallel_gen

Run independent sections in parallel batches:

```
batch 1: [00_README, 01_discover, 02_plan]
batch 2: [clinical|ai|arch (parallel)]
batch 3: [ui|security|compliance (parallel)]
batch 4: [tests|deployment|closeout]
```

Use `multi_replace_string_in_file` or `multi_agent` dispatch.

---

## Snippet reuse (cross-cutting)

Path: `.ai-brain/skills/shared/snippets.md` and `.ai-brain/skills/shared/snippets_v2.md`

Examples of reusable snippets:

| ID | Content | Used in (example) |
|----|---------|-------------------|
| `SNIP:i18n:ar-rtl-policy` | RTL rules + ar/en table | all UI files |
| `SNIP:tenant-isolation` | tenant context rule | every backend file |
| `SNIP:phi-redaction` | PHI redaction patterns | every AI file |
| `SNIP:red-flag-list` | critical red flag templates | every clinical file |
| `SNIP:safe-html` | `escapeHTML` usage | every frontend file |
| `SNIP:rls-policy` | RLS policy template | every migration |
| `SNIP:csp-policy` | CSP default + plan overlay | every HTML file |
| `SNIP:openapi-header` | OpenAPI 3.1 header | every API file |
| `SNIP:dbml-erd` | DBML ERD pattern | every ERD file |
| `SNIP:test-data-dummy` | dummy data seeder | every seed file |

---

## Token Economy (effective)

| Action | Without Pack | With Pack | Saving |
|--------|--------------|-----------|--------|
| Single dept blueprint | 15,000 tok | 3,000-9,000 tok | 60-80% |
| Single batch (5 depts) | 75,000 tok | 18,000-30,000 tok | 60-75% |
| Multi-batch (20 depts) | 300,000 tok | 90,000-180,000 tok | 40-70% |
| Wall-time (parallel) | sequential | -70% | wall-time |

---

## Operating Rules

1. **Always**: load snippets once per session
2. **Always**: define schema first
3. **Always**: use tier to control depth
4. **Always**: parallel-call independent sections
5. **Always**: id-reference modules
6. **Rarely**: chunk_reasoning >5 items
7. **Never**: paste full schema twice
8. **Never**: skip snippet reuse when one fits

---

*Owner: ORC — version 1.0 — 2026-08-01*
