---
name: nm-loop-engineering
description: Use when iterating on a single feature/dept through Plan → Implement → Test → Verify. Caps loops at 4 attempts to avoid infinite iteration; after 4, escalates to owner. Saves ~60% tokens vs manual cycling.
---

# LOOP ENGINEERING — Plan → Implement → Test → Verify

## When to use

A single dept or feature needs iteration:
- Engine returns wrong value → fix logic → retest → verify
- Migration fails on live → fix → sandbox → verify
- Router returns 500 → add try/catch → retest → verify
- HTML page missing i18n keys → add keys → test → verify

## The 4-step loop (capped at 4 attempts)

```
for attempt in 1..4 {
    plan     = restateProblem + listAffectedFiles + proposeFix
    implement = apply fix to file(s)
    test     = run unit + integration
    verify   = confirm against acceptance criteria
    if (verify.pass) break
}
if (!verify.pass after 4) escalate(owner)
```

## File template (each iteration)

```markdown
## Loop attempt N — {Date}
### Problem (one sentence)
The GRACE engine returns 'moderate' for a clearly low-risk patient.

### Affected files (read first, do not assume)
- namaweb/cardiology_engine.js
- namaweb/cardiology_test.js

### Proposed fix (1-2 options)
**Option A:** Lower the threshold for low-risk from < 100 to < 80
**Option B:** Adjust Killip weighting

**Chosen:** Option A — matches 2024 GRACE 2.0 recalibration

### Implementation
- Edited `graceScore()` to use threshold 80
- Updated test fixture `grace_low` to assert score < 80

### Test results
- Unit: 12/12 pass
- Integration: 4/4 pass

### Verify
- [x] Returns 'low' for age 50, sbp 130, hr 75
- [x] Returns 'high' for age 75, sbp 95, hr 110, killip 3
- [x] Cite unchanged
- [x] Schema unchanged

### Status: PASS → advance
```

## Acceptance criteria checklist

| Check | Required |
|---|---|
| Engine returns expected value | yes |
| Engine schema unchanged (input/output shape) | yes |
| Tests pass | yes |
| Cite unchanged (no silent modification) | yes |
| No `...existing code...` shortcuts | yes |
| No new `console.log` of PHI | yes |
| No new dependency | yes (unless approved) |

## Loop cap

`MAX_LOOP_ATTEMPTS = 4`

Why 4?
- Attempt 1: obvious fix
- Attempt 2: refine after first failure
- Attempt 3: second-pass repair
- Attempt 4: last try
- Beyond 4: human escalation needed

## Escalation report

```markdown
## Loop escalated — {Date}
### Problem
{one sentence}

### Attempts
1. {what was tried}
2. {what was tried}
3. {what was tried}
4. {what was tried}

### Recommendation
{2-3 options for owner to pick}

### Files affected
- ...

### Asking owner to
- [ ] Approve Option A
- [ ] Approve Option B
- [ ] Pivot to new approach
```

## State persistence

After each loop, write `.ai-brain/03_AUTOPILOT/loops/{dept}-{date}.md` so the next
session can resume mid-loop without re-discovering.

## Pair with

- `nm-autopilot` — outer orchestrator
- `nm-multi-agent` — when running 3 depts in parallel
- `nm-systematic-debugging` — when debugging a specific bug

## Token saving

Manual debugging cycle = ~30K tokens per loop × 3 loops = ~90K. Structured LOOP
= ~12K per loop × 3 = ~36K. ~60% reduction.