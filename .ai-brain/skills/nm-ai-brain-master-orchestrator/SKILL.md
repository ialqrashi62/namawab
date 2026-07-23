:no-copilot
# nm-ai-brain-master-orchestrator

## Description
Master orchestration skill that combines all `.ai-brain` skills into a single workflow. Use this skill when the user gives a large multi-step request like the original prompt: "Act as a Panel of World-Class Experts... for every section... Master Orchestrator synthesizes..."

## When to use
- Large requests spanning many departments.
- Requests requiring panel-of-experts + LOOP ENGINEERING + AUTOPILOT + token saving.

## Master workflow
1. **Token-saver setup**: ensure `skills/shared/snippets.md` is loaded.
2. **Station-matcher pass**: map existing stations vs. brain docs.
3. **Coverage-map pass**: identify missing brain.md and 01-06 files.
4. **Multi-Agent pass**: for each department, run CMO/AI/Architect/UX/Compliance/DevOps agents in parallel via `nm-ai-brain-multi-agent`.
5. **Autopilot pass**: generate missing docs in batches.
6. **Loop-engineering pass**: refine each doc with audit → prompt → backend → frontend → QA.
7. **Workflow-scribe pass**: generate scenarios and dataflow.
8. **Index-manager pass**: update INDEX.md and DEPARTMENT_COVERAGE_MAP.md.
9. **Frontend-bridge pass** (only if requested): create station.js files.

## Execution modes
- **Plan-only**: generate `.ai-brain` docs only (default).
- **Plan + UI**: generate docs + station.js skeletons.
- **Plan + UI + Backend**: generate docs + station.js + routes/schemas notes (requires explicit approval).

## Token rules
- Load canonical references once per session.
- Use snippets for repeated paragraphs.
- Batch similar departments.
- Reference, don't quote.

## Safety rails
- No production deploy commands.
- No hardcoded secrets or PHI.
- Do not modify `namaweb/server.js` or `db_postgres.js` unless explicitly approved.
