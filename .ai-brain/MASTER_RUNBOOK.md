# Master Runbook - How to use this AI Brain

## Project Structure
```
.ai-brain/
├── 00_SYSTEM/    # Engine, templates, skills (loaded once)
├── 01_DATA/      # Catalog of all 38 depts (source of truth)
├── 02_MODULES/   # Per-department generated modules (38+ files)
├── 03_AUTOPILOT/ # Runner that generates all
├── 04_EXAMPLES/  # Reference outputs (OpenAPI, SQL, etc.)
├── 05_SHARED/    # Compliance, infra, design (reusable)
├── 06_SHARED/    # AI observability
├── 07_DEPLOY/    # K8s, Terraform, Helm
├── 08_TESTING/   # Test plans, golden datasets
├── 09_DOCS/      # Architecture, security, deployment
├── 10_COMPLIANCE/# JCI, ISO, HIPAA, GDPR mappings
├── 11_TRAINING/  # User manuals, video scripts
├── 12_DATA/      # Migrations, seeders, FHIR examples
├── 13_AGILE/     # Scrum boards, user stories
└── 14_OBSERVABILITY/  # SLOs, dashboards
```

## 3 Ways to Use

### Mode 1: Get One Module (Most Common)
**Command**: "Generate CARD-001"
**Output**: Full module in 02_MODULES/CARD-001.yaml + 10 supporting files
**Tokens**: ~3,000 (vs 15,000 without skills)

### Mode 2: Generate All (Bulk)
**Command**: "Generate all 38 departments"
**Process**: AUTOPILOT runs 4-LOOP for each, parallel batches of 5
**Output**: 38 module files + 100+ supporting files
**Tokens**: ~80,000 (vs 600,000 without skills) - 87% reduction

### Mode 3: Custom Query
**Command**: "What does Oncology need for chemo safety?"
**Process**: AUTOPILOT detects scope, activates CMO + AIE + CQO
**Output**: Targeted response, no bloat

## The 4-LOOP Process (per module)

```
L1 DRAFT     -> 4 experts write in parallel (CMO, AIE, SA, PM+CQO)
   |
L2 CRITIQUE  -> Cross-review (find conflicts, gaps, risks)
   |
L3 REFINE    -> Orchestrator merges, resolves, normalizes
   |
L4 VALIDATE  -> Clinical safety gate, compliance gate, SLO gate
   |
   if fail -> Loop back to L2 (max 3 iterations)
```

## Token Savings Breakdown

| Skill | Saving | How |
|-------|--------|-----|
| S1 schema_first | 40% | $ref instead of repetition |
| S2 chunked_reasoning | 30% | Batch process, not all at once |
| S3 id_reference | 25% | CARD-001 vs "Cardiology General" |
| S4 templated_output | 35% | TPL:DEPT, fill fields |
| S5 cached_context | 50% | Reference prior by ID |
| S6 compressed_prompts | 20% | Abbreviations: CMO, AIE, etc. |
| S7 selective_depth | 60% | Surface for all, deep for critical |
| S8 parallel_gen | 70% wall-time | 4 parallel calls |

**Combined: ~80% token reduction**

## Next Step

Say one of:
1. "Generate **CARD-001**" (full Cardiology module)
2. "Generate **all 38**" (full ecosystem)
3. "Generate **Oncology**" (specific dept)
4. "Generate **[specific question]**" (custom)
5. "Show me **how L1-L4 works** for ER (Emergency)"

## CRITICAL QUESTIONS (answer to unlock AUTOPILOT)

Before I start full generation, I need 3 quick answers (to run AUTOPILOT accurately):

| # | Question | Why it matters |
|---|----------|----------------|
| 1 | Primary language? (Arabic / English / Both) | Sets i18n + prompts |
| 2 | Country/Region? (KSA / UAE / Egypt / Global) | Sets compliance (NPHIES / NABIDH / MOH / HIPAA) |
| 3 | Priority? (Cardiology / ER / Oncology / All) | Sets generation order |
