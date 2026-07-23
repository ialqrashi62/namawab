# nm-ai-brain-workflow-scribe

## Description
Generate business-flow scenarios and data-flow documentation for a NamaMedical department group. Use this skill when asked to add "سيناريو عمل", "فلو بيانات", or "workflow scenarios" for a department or group.

## When to use
- User asks for workflow scenarios, data flow, end-to-end scenarios, or business process documentation for a department group.

## Inputs required
1. Group name (e.g. Internal Medicine, Surgical, OBGYN/Peds, Diagnostics, Critical Care).
2. Key departments in the group.
3. Whether to produce a standalone file or append to an existing group doc.

## Output format
A markdown file with:
1. Trigger / Actor / Departments / Safety Gate table.
2. Step-by-step table: #, Step, Actor, Screen/Button, Input→Output, API, Tables, Audit.
3. Governance section: permissions, alerts, billing/insurance, safety gates.
4. Failure cases.
5. Acceptance criteria (AC-*).

## Rules
- Re-use the scenario style from `hospital-workflow-scenarios-ar.md`.
- Reference existing APIs/tables from `hospital-data-api-integration-ar.md` and `hospital-requirements-blueprint-ar.md`.
- Mark each capability as ✅ built / 🟡 partial / 🔴 missing.
- Keep Arabic clinical text; English for API paths and table names.
