# nm-ai-brain-department-generator

## Description
Generate standardized `.ai-brain` department documentation for NamaMedical / jumanaMedical ERP. Use this skill when asked to create or complete `brain.md` and the 01-06 spec files for a clinical/operational department. It compresses the global reference docs (sidebar inventory, master catalog, gap analysis, workflows, UI blueprint, requirements, API/data plan, RBAC/privacy, clinical safety, QA, reference data) into a single reusable prompt so the model does not need to re-read them every turn.

## When to use
- User asks to "fill missing brain.md files", "complete department docs", "generate AI brain for a department", or any task that produces `.ai-brain/<department>/brain.md` plus optional `01_clinical_spec.md`, `02_ai_orchestration.md`, `03_technical_arch.md`, `04_ux_ui_stitch.md`, `05_compliance_security.md`, `06_implementation_plan.md`.

## Inputs required from user
1. Department group/category (e.g. `internal_medicine`, `surgical`, `obgyn`, `pediatrics`, `diagnostics`, `critical_care`, `rehabilitation`, `support_services`, `admin_academic`, `oncology_therapeutics`).
2. Specific department/sub-department name (e.g. `cardiology`, `orthopedics`, `nicu`, `anesthesia`, `laboratory`).
3. Which files to generate: `brain.md` only, or `brain.md + 01 + 02 + 03`, or full set `01-06`.
4. Whether to include business-flow scenarios / dataflow for the group.

## Canonical references (read once per session, not per department)
The skill loads these files into context automatically. Do NOT re-read them for every sub-department:
- `.ai-brain/templates/DEPARTMENT_BRAIN_TEMPLATE.md`
- `.ai-brain/hospital-sidebar-inventory-ar.md`
- `.ai-brain/hospital-master-department-catalog-ar.md`
- `.ai-brain/hospital-global-gap-analysis-ar.md`
- `.ai-brain/hospital-workflow-scenarios-ar.md`
- `.ai-brain/hospital-workflows-dataflow-ar.md`
- `.ai-brain/hospital-ui-blueprint-ar.md`
- `.ai-brain/hospital-ui-ux-actions-menus-ar.md`
- `.ai-brain/hospital-requirements-blueprint-ar.md`
- `.ai-brain/hospital-data-api-integration-ar.md`
- `.ai-brain/hospital-rbac-privacy-audit-ar.md`
- `.ai-brain/hospital-clinical-nursing-safety-ar.md`
- `.ai-brain/hospital-qa-testing-acceptance-ar.md`
- `.ai-brain/hospital-reference-data-catalog-ar.md`
- `.ai-brain/hospital-final-audit-report-ar.md`

## Output conventions
1. Use the exact 5-section `brain.md` template from `DEPARTMENT_BRAIN_TEMPLATE.md`:
   - 1. Prompt Engineering (Cognitive Layer)
   - 2. Backend & Logic (Engine)
   - 3. Frontend / UI-UX (Interface)
   - 4. Infrastructure & Quality (Guardrails)
   - 5. Operational Assets
2. For `01_clinical_spec.md` use CMO voice; for `02_ai_orchestration.md` use Lead AI Engineer voice; for `03_technical_arch.md` use Principal Software Architect voice; for `04_ux_ui_stitch.md` use Product Manager & UX Lead voice; for `05_compliance_security.md` use Compliance & Quality Officer voice; for `06_implementation_plan.md` use DevOps Lead voice.
3. All clinical content must be grounded in the reference docs above. Do not invent unsupported workflows.
4. Every API/table suggestion must include `tenant_id` and reference `requireTenantScope` / RLS / Golden Access Rule.
5. Keep files concise but complete; avoid truncation markers (`// ... rest of code`).
6. Write in Arabic for clinical/operational sections; English is allowed for API paths, table names, and component IDs.
7. After generating files, update `.ai-brain/INDEX.md` if it exists, or note the need to create it.

## Token-reduction rules
- Do NOT paste large excerpts from the reference docs into the generated files.
- Reference the canonical docs by name/section only (e.g. "See hospital-ui-blueprint-ar.md §3.1 for station layout").
- Re-use the same table/API naming patterns across departments; do not re-explain RLS, PHI vault, or Stitch tokens each time.
- Group similar sub-departments into one generation pass when possible.

## Safety rails (non-negotiable)
- No hardcoded secrets.
- No real PHI or patient data.
- All money/VAT calculations stay server-side.
- Tenant isolation stays on.
- No production deployment commands without owner approval.
- All generated docs are planning-only; do not execute DDL or modify `namaweb/server.js` unless explicitly asked in a separate step.
