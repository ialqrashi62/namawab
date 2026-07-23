# nm-ai-brain-loop-engineering

## Description
Apply Loop Engineering (audit → prompt → backend → frontend → QA → compliance) to every `.ai-brain` department spec. Use this skill when the user explicitly asks for "LOOP ENGINEERING" or "Act as a Panel of Experts".

## When to use
- User requests panel-of-experts output.
- User asks for adversarial audit, gap analysis, or iterative refinement per department.

## Loop steps
For each department, cycle through:
1. **Audit & Gap Analysis** — what exists vs. global standard.
2. **Prompt Engineering** — system prompt, context, RAG workflow.
3. **Backend & Logic** — APIs, data model, business rules.
4. **Frontend / UI-UX** — Stitch components, user stories, wireframes.
5. **QA & Compliance** — unit tests, security, JCI/PDPL/CBAHI.

## Output
- One `brain.md` per department synthesizing all 5 voices.
- Optional `01-06` files if requested, each with a single expert voice.

## Token rules
- Re-use `skills/shared/snippets.md`.
- Reference canonical docs by name/section.
- Do not re-explain the tech stack per file.
