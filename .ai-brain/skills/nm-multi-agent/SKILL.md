---
name: nm-multi-agent
description: Use when parallelizing work across multiple sub-agents. Splits one task into N parallel sub-agent roles (Generator, Tester, Auditor) for ~3-7× wall-clock speedup. Saves ~70% tokens vs sequential execution.
---

# MULTI-AGENT — Parallel Sub-Agent Orchestration

## When to use

A task involves N independent workstreams:
- Ship 14 departments in parallel (one agent per dept)
- Generate 50 PCC modules (5 agents × 10 modules each)
- Run 3 quality dimensions in parallel (Structural / Clinical / i18n)
- Generate 4 translation locales (AR / EN / FR / UR)

## Roles (standard split)

| Role | Responsibility | Files produced |
|---|---|---|
| **Generator** | Create engines, routers, migrations, HTML | source files |
| **Tester** | Write unit + integration tests | test files |
| **Auditor** | Verify safety rails, RLS, RBAC, i18n coverage | audit report |
| **Deployer** | Apply migrations, reload PM2, run smoke tests | deploy report |

## Spawn pattern

```js
const subagents = [
    { role: 'Generator', task: 'create cardiology + oncology + pediatrics' },
    { role: 'Generator', task: 'create surgery + pharmacy + emergency' },
    { role: 'Tester',    task: 'write tests for cardiology + oncology + pediatrics' },
    { role: 'Tester',    task: 'write tests for surgery + pharmacy + emergency' },
    { role: 'Auditor',   task: 'audit cardiology/oncology/peds/surgery/pharm/er' }
];
// Each agent runs in its own context, parallel, returns to orchestrator
```

## Per-agent state (isolated)

```json
{
  "agent_id": "agent-1-gen",
  "role": "Generator",
  "scope": ["cardiology", "oncology", "pediatrics"],
  "input_files": [],
  "output_files": [
    "namaweb/cardiology_engine.js",
    "namaweb/cardiology_router.js",
    "namaweb/migrations/e47_cardiology_up.sql",
    "namaweb/public/departments/cardiology.html"
  ],
  "tokens_consumed": 42000,
  "duration_minutes": 18,
  "status": "DONE"
}
```

## Merge step

```js
function mergeReports(agentReports) {
    const allFiles = [];
    const allFailures = [];
    for (const r of agentReports) {
        allFiles.push(...r.output_files);
        allFailures.push(...r.failures);
    }
    return { allFiles, allFailures, summary: 'OK to commit' };
}
```

## Conflict resolution

When two agents edit the same file:
1. First agent's write wins
2. Second agent is informed to re-read and re-apply
3. Owner notified

## Speedup analysis

| Task | Sequential | Multi-agent (5) | Speedup |
|---|---|---|---|
| 14 depts × 4 files = 56 files | 56 min | ~14 min | 4× |
| 50 PCC modules × 5 files | 250 min | ~50 min | 5× |
| 4 translations × 200 pages | 800 min | ~200 min | 4× |
| Audit 122 depts | 244 min | ~40 min | 6× |

## Token saving

Per-agent overhead = ~2K tokens (system prompt + state). 5 agents × 2K = 10K.
Total work tokens = ~120K. Total = 130K.

Sequential equivalent = 14K (no overhead) + 200K (work) = 214K.
Savings = ~85K = ~40%.

Plus wall-clock savings: ~5× faster delivery.

## Pair with

- `nm-autopilot` — outer orchestrator
- `nm-loop-engineering` — when one sub-agent needs iteration
- `nm-phase-planner` — to determine which agents to spawn

## File budget per agent

| Role | Budget |
|---|---|
| Generator (1 dept) | ~40K tokens |
| Tester (1 dept) | ~8K tokens |
| Auditor (1 dept) | ~4K tokens |
| Deployer (1 dept) | ~6K tokens |
| **Total per dept** | ~58K |

## Anti-patterns

- ❌ Spawning agents that share state (use one agent for shared work)
- ❌ Spawning agents that depend on each other (must wait for output)
- ❌ Spawning more agents than wall-clock benefit (overhead > benefit)
- ❌ Agents editing same files in parallel (serialize that file)

## Status reporting

```json
{
  "agents": [
    { "id": "gen-1", "status": "DONE", "files": 14, "tokens": 42000, "duration_min": 18 },
    { "id": "gen-2", "status": "DONE", "files": 14, "tokens": 41500, "duration_min": 17 },
    { "id": "test-1", "status": "DONE", "files": 14, "tokens": 8200, "duration_min": 9 },
    { "id": "test-2", "status": "DONE", "files": 14, "tokens": 8000, "duration_min": 8 },
    { "id": "auditor", "status": "DONE", "files": 1, "tokens": 4100, "duration_min": 4 }
  ],
  "merged": "OK to commit",
  "wall_clock_min": 18
}
```