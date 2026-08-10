---
name: nm-token-saver-v3
description: Token-saver for repeated AI-brain blueprint patterns. Use when generating per-department docs (60+ depts × 35+ files = 2100+ docs) to slash token consumption by 60-70%. Replaces verbose prose with shared snippet IDs, table-first documentation, incremental loading.
version: 3.0.0
---

# nm-token-saver-v3

## Problem

Generating 60+ dept × 35-44 files = **2100-2600 docs**. Naive generation costs ~10k tokens per dept = **210k-260k total tokens**. With Opus at $15/M, that's $3.15K-$3.90K per rollout.

## Solution: snippet IDs + table-first

| Token-saver technique | Savings |
|---|---|
| **Shared snippet IDs** (e.g., `[SNIP:requirePermission]`) | ~30% |
| **Table-first docs** (instead of long prose) | ~20% |
| **Incremental loading** (skip static sections) | ~15% |
| **Compressed YAML over JSON** | ~10% |
| **Inline anchors** (`§3.2` instead of "see section 3.2") | ~5% |
| **TOTAL** | **~60-70%** |

## Shared snippet library (`.ai-brain/skills/snippets/`)

| Snippet ID | Purpose | Tokens saved |
|---|---|---|
| `[SNIP:requirePermission]` | RBAC middleware pattern | ~150 |
| `[SNIP:requireTenantScope]` | Tenant isolation middleware | ~120 |
| `[SNIP:idempotencyGuard]` | Money/PHI write protection | ~140 |
| `[SNIP:validateBody]` | Fail-closed input validation | ~130 |
| `[SNIP:cryptoEnvelope]` | PHI encryption wrapper | ~110 |
| `[SNIP:auditMiddleware]` | Hash-chained audit log | ~150 |
| `[SNIP:stripeRls]` | RLS policy template | ~200 |
| `[SNIP:helmet]` | Security headers | ~80 |
| `[SNIP:rateLimit]` | Express rate limit | ~70 |
| `[SNIP:i18nBundle]` | AR/EN/FR/UR translations | ~100 |
| `[SNIP:stitchButton]` | Button component (Stitch) | ~50 |
| `[SNIP:stitchTable]` | Table component (Stitch) | ~80 |
| `[SNIP:stitchForm]` | Form component (Stitch) | ~100 |
| `[SNIP:budgetCalc]` | Token cost + ROI calc | ~70 |
| `[SNIP:ganttChart]` | Phase timeline ASCII | ~60 |

## Table-first template

Instead of:
> "The user logs in by submitting credentials to /api/auth/login. The server validates the credentials against the bcrypt-hashed password in the database. If valid, a session is created..."

Use:
> "Auth flow: `POST /api/auth/login` → bcrypt.verify → session.create → setCookie. See [SNIP:authLogin]."

## Incremental loading

For each dept blueprint, only sections that change per dept are inline:
- 01_brain.md → dept-specific (inline)
- 04_technical_architecture.md → mostly snippet references
- 31_user_manual.md → mostly snippet + dept name

## Per-dept cost

| Approach | Tokens per dept |
|---|---|
| Naive prose | ~10,000 |
| Token-saver v3 | **~3,000** (70% reduction) |

For 60 depts × 35 files = 2100 files:
- Naive: $3.15K (Opus) / $0.63K (Sonnet)
- **Token-saver: $0.95K (Opus) / $0.19K (Sonnet)**

## Required companion skills

- `nm-autopilot-grand-final` — runs the bulk script
- `nm-dept-blueprint-template-v2` — defines the 44-bucket template
- `nm-loop-engineering-v3` — fixes issues between iterations
- `nm-multi-agent-orchestrator-v3` — parallel 7-expert panel
