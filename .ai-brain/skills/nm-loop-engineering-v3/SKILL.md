---
name: nm-loop-engineering-v3
description: Iterate Plan → Implement → Test → Verify with hard cap of 4 loops. After 4 failures, escalate to owner with full context. Use when "iterate", "loop", "refine until passes", "try again", "fix and retry".
version: 3.0.0
---

# nm-loop-engineering-v3

## Loop contract

```
loop:
  plan → implement → test → verify
  if fail: refine prompt + retry (max 4)
  if pass: emit artifact + close
  if max reached: escalate to owner
```

## Per-iteration budget

| Action | Tokens | Time |
|---|---|---|
| Plan | ~1k | < 5s |
| Implement | ~10k | < 30s |
| Test | ~2k | < 60s |
| Verify | ~500 | < 5s |

## Why cap at 4?

- More iterations usually means wrong approach (not wrong code)
- Owner should re-direct strategy after 4 attempts
- Prevents runaway token spend

## Refinement strategy per iteration

| Iter | Likely root cause | Refinement |
|---|---|---|
| 1 | (first try) | — |
| 2 | Wrong schema | Add explicit schema example |
| 3 | Wrong context | Add surrounding context |
| 4 | Wrong tool | Try alternative tool |

After 4, **stop and ask owner**.

## Pairs with

- `nm-autopilot-grand-final`
- `nm-multi-agent-orchestrator-v2`

## Usage in code

```python
def loop_until_passes(action_fn, max_iters=4):
    last_err = None
    for i in range(1, max_iters + 1):
        plan = plan_action()
        try:
            result = action_fn(plan)
            verify(result)
            return result
        except Exception as e:
            last_err = e
            plan = refine(plan, e, i)
    raise MaxIterationsReached(last_err)
```
