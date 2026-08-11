---
name: nm-gap-analysis
description: Use when identifying what's missing in a department, system, or workflow. Generates prioritized gap list ranked by impact × safety-rail relevance, divided by effort × risk.
---

# Gap Analysis — Token-Saver

## When to use

A new requirement comes in or a baseline is established:
- "We need to add AI co-pilot to all clinical modules"
- "We're missing several PCC modules"
- "Need to comply with new CBAHI standard"
- "Patient portal has UX gaps"

## Pipeline

```
Baseline → Goals → Gap list → Prioritize → Plan
```

## Step 1 — Establish baseline

| Asset | Count | Owner |
|---|---|---|
| Engines | 47 | backend |
| Routers | 47 | backend |
| Migrations | 401 | backend |
| Tests | 283 | qa |
| HTML pages | 16 | frontend |
| i18n keys | 5000 | frontend |
| Skills | 106 + 30 (in this batch) = ~136 | docs |
| Departments documented | 14/122 | docs |
| Departments shipped | 14/122 | deploy |

## Step 2 — Define goals

For example, "ship 122 PCC modules":
- 122 - 14 = 108 departments remaining
- Each requires: engine + router + migration + test + 5 HTML pages + 35 docs
- Budget per dept: ~60K tokens

## Step 3 — Identify gaps

```yaml
gaps:
  - id: PCC_001
    title: "Cardiology: missing TNM staging module"
    dept: cardiology
    severity: high
    impact: clinical decisions
    safety_rails: [RAIL-5, RAIL-13]
    effort: medium
    risk: low
    score: 9.2        # impact × safety / effort × risk

  - id: PCC_002
    title: "Oncology: missing chemotherapy dose calculator"
    dept: oncology
    severity: critical
    impact: patient safety
    safety_rails: [RAIL-1, RAIL-5, RAIL-13]
    effort: medium
    risk: medium
    score: 8.7
```

## Step 4 — Prioritize

Formula: `priority = (impact × safety_rail_relevance) / (effort × risk)`

| Score | Priority |
|---|---|
| ≥ 8.0 | P0 (this sprint) |
| 6.0-7.9 | P1 (next sprint) |
| 4.0-5.9 | P2 (this quarter) |
| 2.0-3.9 | P3 (next quarter) |
| < 2.0 | P4 (backlog) |

## Step 5 — Plan by priority

```yaml
sprint_X:
  P0:
    - PCC_002  # chemo dose calc
    - PCC_001  # TNM staging
  P1:
    - PCC_010  # pediatric growth chart
    - PCC_011  # pregnancy tracker

sprint_X+1:
  P0:
    - PCC_020  # blood bank compatibility
  P1:
    - PCC_021  # dialysis adequacy
    - PCC_022  # respiratory weaning

sprint_X+2:
  P0: []
  P1:
    - PCC_030  # stroke scale
    - PCC_031  # trauma score
```

## Output: Wave-by-wave rollout

| Wave | Scope | ETA | Tokens |
|---|---|---|---|
| Wave 1 (this week) | 3 P0 gaps | 2 days | 180K |
| Wave 2 (next week) | 5 P1 + P2 | 4 days | 320K |
| Wave 3 (this month) | 10 P2 | 7 days | 600K |
| Wave 4 (next month) | 20 P3 | 14 days | 1.2M |

## Template

```markdown
# Gap Analysis — {Project/Area}

## Baseline
- Total scope: {X items}
- Shipped: {Y items} ({Y/X * 100}%)
- Coverage: {Z%}

## Goals
{1-2 sentences}

## Top 10 gaps (P0/P1)

### Gap 1: {title}
- **Severity:** critical/high/medium/low
- **Impact:** {clinical/safety/UX/billing}
- **Safety rails:** {list}
- **Effort:** trivial/small/medium/large
- **Risk:** low/medium/high
- **Score:** {N.N}
- **Files:** {list of files to touch}
- **Acceptance:** {criteria}

### Gap 2: {title}
...

## Plan

| Wave | Scope | ETA | Budget |
|---|---|---|---|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |

## Owners
- {Gap 1}: {owner}
- {Gap 2}: {owner}
```

## Token saving

Each gap analysis from scratch = ~300 lines. With template = ~60 lines unique
(specific gaps, specific scores). ~80% reduction.