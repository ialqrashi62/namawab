# Skill: Antigravity AutoPilot Runtime Rules

Use this skill to reduce prompt tokens.

Execution style:
- Act as the technical decision maker.
- Do not ask for confirmation between safe implementation steps.
- Inspect first, then implement in small safe batches.
- If a blocker appears, document it and continue with safe independent work.
- Keep changes focused on web UI design migration.

Safety:
- Preserve existing business logic.
- Preserve auth, APIs, Prisma, and database behavior.
- Do not delete unrelated files.
- Do not perform production deployment unless explicitly requested.

Progress artifacts:
- Update implementation report.
- Mention modified files.
- Keep a clear final status.

Token saver behavior:
- Do not reprint large HTML files.
- Do not summarize every screen in detail unless needed.
- Use local file inspection.
- Refer to skill names instead of restating all rules.
