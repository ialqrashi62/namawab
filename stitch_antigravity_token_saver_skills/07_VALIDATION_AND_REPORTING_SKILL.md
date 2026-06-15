# Skill: Validation and Arabic Reporting

After every implementation batch, run available checks safely.

Preferred commands when present:
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test` only if reasonable and not destructive
- `npx tsc --noEmit` if no typecheck script exists

Do not run destructive database commands.
Do not change production env.
Do not run migrations unless the task explicitly needs schema changes.

Required report:
Create or update:
- `docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md`

Report must include:
- Stitch package location
- Skills used
- Design screens reviewed
- Tokens extracted
- Components created/updated
- Pages redesigned
- Routes affected
- Files changed
- Validation commands and results
- Remaining pages for later phases
- Risks and notes
- Final status

Suggested final statuses:
- `STITCH_UI_PHASE_1_COMPLETED`
- `STITCH_UI_PARTIAL_WITH_BLOCKERS`
- `STITCH_UI_VALIDATION_FAILED_NEEDS_FIX`

Arabic encoding rule:
- Save Arabic reports as UTF-8.
- Avoid mojibake/garbled Arabic.
