---
name: nm-autopilot-grand-final
description: End-to-end autopilot for the NamaMedical grand-final release. Use when the owner authorizes a full multi-dept rollout that combines ALL 44 buckets per dept + system-wide docs + skills + tests + push. Stops on first gate failure.
version: 1.0.0
---

# nm-autopilot-grand-final

## What it does

Runs the entire 44-bucket × N-departments ship pipeline without asking the owner between steps:

1. **Discover** — read `.ai-brain/MASTER_PLAN_*_AR.md` + enumerate depts
2. **Plan** — compute delta (missing buckets per dept × N depts)
3. **Code** — generate all missing files via token-saver scripts
4. **Test** — run guard tests if applicable
5. **Commit** — single commit with detailed body
6. **Push** — `git push origin <branch>`
7. **Close** — emit closeout summary

## How to invoke

```bash
# Activate via the /autopilot slash command or call directly
/autopilot --mode=grand-final --depts=all
```

Or in agent prompt:
> "Run nm-autopilot-grand-final to ship 44-bucket artifacts for all depts."

## Token-saver (table-first)

| Step | What runs | Token cost |
|---|---|---|
| Discover | read 1 master plan | ~1k |
| Plan | list dept dirs | ~200 |
| Code | 1 Python script × 9 file-templates | ~5k script + 0 per dept |
| Test | (optional) npm test | ~0 |
| Commit | single git commit | ~200 |
| Push | git push | ~50 |

Total: **~6.5k tokens** for 122 depts × 9 files = **1098 files**.

## Mandatory safety rails

- 13 safety rails from AGENTS.md §2.2 apply
- No force-push to protected branches
- No live-server commands
- No `.env`/PHI/secret commits
- Tenant isolation stays on

## Stop conditions

| Stop condition | Action |
|---|---|
| Master plan missing | Halt + ask owner |
| Dept dir missing | Skip + log warning |
| File write fails | Halt + show traceback |
| Pre-commit hook fails | Fix + retry (max 4) |
| Push fails | Halt + report network/auth |

## Pair with

- `nm-token-saver-v3` — reduces file-generation cost
- `nm-loop-engineering-v2` — iterates on QA failures
- `nm-multi-agent-orchestrator-v2` — splits work across sub-agents

## Example output

```
=== nm-autopilot-grand-final ===
[1/7] Discover... ok (master plan = .ai-brain/MASTER_PLAN_2026_08_10_AR.md)
[2/7] Plan... 122 depts × 9 missing buckets = 1098 files
[3/7] Code... 1098 files written (7.72 MB)
[4/7] Test... skipped (markdown/html artifacts)
[5/7] Commit... ok (a41ded76)
[6/7] Push... ok (c5977a93..a41ded76)
[7/7] Close... DONE
```
