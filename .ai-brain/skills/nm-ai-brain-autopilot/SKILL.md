# nm-ai-brain-autopilot

## Description
Autopilot orchestration skill for large-scale `.ai-brain` department generation. Use this skill when the user wants to generate many department files across multiple groups with minimal per-turn guidance.

## When to use
- User says "اعمل كل الأقسام", "complete all departments", "autopilot the brain files", or "fill missing .ai-brain".
- Context is large and token conservation is critical.

## Autopilot workflow
1. **Load canonical references once** (see `nm-ai-brain-department-generator`).
2. **Read `DEPARTMENT_COVERAGE_MAP.md`** to identify missing files.
3. **Batch by group and similarity**:
   - Group A: Internal medicine subspecialties (cardiology, pulmonology, gastro, nephro, endocrine, rheuma, derm, infectious, oncology).
   - Group B: Surgical subspecialties (general, orthopedics, neurosurgery, cardiothoracic, ent, ophthalmology, urology, plastic_burns).
   - Group C: OBGYN/Peds/Pediatric subspecialties.
   - Group D: Diagnostics (lab, radiology, functional tests).
   - Group E: Critical Care (er, icu, anesthesia, pacu, nicu).
   - Group F: Support/Admin/Rehab/Integrative/Rare/Oncology Therapeutics.
4. **Generate skeletons first**: For each missing department, create `brain.md` only.
5. **Fill 01-06 in second pass**: Group similar departments and generate all 6 files in one turn per group.
6. **Update INDEX.md and DEPARTMENT_COVERAGE_MAP.md** in final pass.
7. **Stop for user approval** between passes if requested.

## Token rules
- Never re-read reference docs inside a generation pass.
- Use `skills/shared/snippets.md` for common paragraphs.
- Reference canonical docs by name/section, never quote them.
- Generate files directly; skip verbose intros.

## Safety rails
- Planning-only; do not modify `namaweb/` code unless explicitly asked.
- No hardcoded secrets, no PHI, no production deploy commands.
- All generated docs must reference `requireTenantScope`, RLS, PHI vault, Golden Access Rule.
