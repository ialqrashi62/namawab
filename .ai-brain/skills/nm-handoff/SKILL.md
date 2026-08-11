---
name: nm-handoff
description: Use when handing off work to a new session, new agent, or new human. Loads the canonical handoff document template so no work is lost across session boundaries.
---

# Handoff Document — Token-Saver

## When to use

A session is closing and another needs to pick up:
- End of long-running task
- Different AI agent taking over
- Human returning after AI pause
- Multi-day work spans multiple sessions

## Handoff template

```markdown
# Session Handoff — {Date}

## TL;DR (1 paragraph)
We shipped {phase X} of {project}: {deliverables shipped}. Next: {next phase}.

## State at handoff
- Last commit: `a1b2c3d`
- Branch: `ops/jumanasoft-enterprise-facility-platform-staging-prep`
- PM2 process: `nama-medical-erp` online, uptime 6 days
- Live: jumanasoft.com verified working

## What was completed
1. ✅ Deployed 14 dept engines + routers
2. ✅ Applied migrations e47-e51
3. ✅ Created 14 Stitch pages
4. ✅ Wrote 14 dept benchmark docs
5. ✅ Created 14 token-saver skills
6. ❌ NOT done: 108 remaining depts (planned for next phase)

## What is in-flight
- AUTOPILOT phase PCC_P3_06: surgery + pharmacy + emergency
  - Engine files: written, awaiting test
  - Router files: written, awaiting mount
  - Migration files: written, awaiting sandbox test
  - Test files: 50% written

## What's blocked
- ZATCA Phase 2: blocked on real CSID/OTP credentials from owner
- NPHIES live submissions: blocked on NPHIES endpoint access

## Open questions for next session
1. Should we parallelize 3 sub-agents per phase, or sequential?
2. Confirm rollback plan if e47 migration causes production issue
3. Approve new color tokens for pediatric dept

## Files changed (last 24h)
- namaweb/cardiology_engine.js (added graceScore variant)
- namaweb/migrations/e52_critical_care_up.sql (new)
- public/departments/cardiology.html (Stitch scaffold applied)
- .ai-brain/skills/nm-stitch-scaffold/SKILL.md (new)
- docs/CHANGELOG.md (3 entries added)

## Key references
- AGENTS.md (read first)
- docs/ARCHITECTURE_MAP_AR.md
- .ai-brain/00-orchestrator/STATE.md (if present)
- Last closeout: docs/PHASE_A3_PHI_ENCRYPTION_VAULT/

## Commands to resume
```bash
git status
git log --oneline -5
pm2 list  # ssh root@204.168.144.74
node scripts/smoke.js
```

## Contact
- Owner: {name}
- Last touched: {date}
- Slack/email: {contact}
```

## State file (machine-readable)

```yaml
# .ai-brain/00-orchestrator/STATE.yaml
session_id: "2026-08-10-pcc-deploy"
last_update: "2026-08-10T19:00:00Z"
last_commit: "a1b2c3d"
branch: "ops/jumanasoft-enterprise-facility-platform-staging-prep"
phases:
  completed:
    - id: PCC_P3_01
      name: "Cardiology + Oncology + Pediatrics"
      closed_at: "2026-08-10T15:00:00Z"
    - id: PCC_P3_02
      name: "Surgery + Pharmacy + Emergency"
      closed_at: "2026-08-10T18:00:00Z"
  in_flight:
    - id: PCC_P3_03
      name: "Endocrine + Pulmonology + GI"
      progress: 0.6
      blocked: false
  blocked:
    - id: "ZATCA_PHASE_2"
      reason: "real CSID/OTP credentials needed"
deploys:
  last: "a1b2c3d"
  live_status: "online"
  uptime_hours: 144
metrics:
  tests_passing: 247
  tests_failing: 0
  coverage_pct: 87
  tokens_consumed_today: 184000
```

## Auto-generated handoff

At end of session, run:
```bash
node scripts/generate_handoff.js \
  --output=.ai-brain/00-orchestrator/HANDOFF_LATEST.md
```

This auto-extracts:
- Last git commit (log -1)
- Branch name
- Files changed today (git diff --name-only HEAD~5..HEAD)
- Open TODOs (grep TODO|FIXME)
- Failed tests (npm test --silent)
- PM2 status (via ssh)

## Required sections (checklist)

- [ ] TL;DR (1 paragraph)
- [ ] State at handoff (commit, branch, deploy status)
- [ ] What was completed
- [ ] What is in-flight
- [ ] What's blocked
- [ ] Open questions
- [ ] Files changed
- [ ] Key references
- [ ] Commands to resume

## Token saving

Each handoff from scratch = ~200 lines prose. With template = ~50 lines unique
(specific state, specific deliverables). ~75% reduction.