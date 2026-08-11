---
name: nm-autopilot-wave-runner-v1
description: Runs a full wave (A→E) in autopilot mode with safety rails, loop checkpoints, and artifact logging. Token-saver orchestration skill.
---

# nm-autopilot-wave-runner-v1

## Purpose
تشغيل موجة كاملة تلقائياً (Phase A→E) مع تحقق gates وسجلات واضحة بدون إعادة اكتشاف السياق كل مرة.

## Inputs
- `waveId`
- `priorityGaps[]`
- `blockedByOwner[]`
- `tokenBudget`

## Output Artifacts
- `.ai-brain/15_EXECUTION/WAVE_<id>_PLAN.md`
- `.ai-brain/99-state/autopilot_wave<id>_state.json`
- `CHANGELOG.md` wave entry
- `/memories/repo/wave<id>_state.md`

## SP-AUTO snippets
- `SP-AUTO-01`: phase kick-off template
- `SP-AUTO-02`: gate checklist renderer
- `SP-AUTO-03`: blocker declaration formatter
- `SP-AUTO-04`: closeout summary formatter

## Safety
- Never deploy live without owner approval.
- Never bypass requireTenantScope or FORCE_RLS.
- Never include real secrets in code/docs.
