# nm-ai-brain-diagnostics-batch — Token-Saver Skill for Batch 2 (Diagnostics)

> **Purpose**: Generate `04_ux_ui_stitch.md`, `05_compliance_security.md`, `06_implementation_plan.md` for the 3 diagnostic departments (Laboratory, Radiology, Functional Tests) in one batch, using the canonical 04-06 structure of `surgical/general_surgery/`.

## 1. The 3 Target Departments

| Department | Path | Role Suffix | Risk Profile |
|---|---|---|---|
| **Laboratory (LIS)** | `.ai-brain/diagnostics/LABORATORY/` | `lab_specialist` | Critical value alerting, QC, genetic data PHI |
| **Radiology (RIS/PACS)** | `.ai-brain/diagnostics/RADIOLOGY/` | `radiologist` | DICOM PHI, critical findings, ALARA radiation safety |
| **Functional Tests** | `.ai-brain/diagnostics/FUNCTIONAL_TESTS/` | `functional_specialist` | ECG/EEG/PFT waveforms PHI, stress-test safety |

## 2. Generation Template (04_ux_ui_stitch.md)

Copy the structure of `surgical/general_surgery/04_ux_ui_stitch.md` and replace:
- "Surgical Command Center" → "<Department> Command Center"
- "Surgical Station" → "<Department> Station"
- Stitch component names from the department's `01_clinical_spec.md`
- User stories from the department's clinical protocols
- Safety gates from the department's `01_clinical_spec.md` Section 2 (KPIs) and Section 3 (Compliance)

Layout (3-column fluid grid):
- **Left**: order/worklist, patient prep, prior results
- **Center**: dynamic tabs (acquisition, result entry, validation)
- **Right**: AI-Brain panel, critical alerts, TAT

## 3. Generation Template (05_compliance_security.md)

Always include these 4 sections:
1. **Regulatory Framework** — cite the specific bodies (CLSI, ACR, ATS/ERS, AASM, ESC, ASGE, JCI, CBAHI, PDPL).
2. **Access Control** — `requireRole('<role>')` + hash-chained audit + segregation of duties.
3. **PHI Protection** — vault path (e.g. `phi_vault/dicom/`), DPAPI KEK envelope, access logging.
4. **Safety Gates** — specific to the domain (critical values, ALARA, contrast allergy, stress test cardiac clearance).

## 4. Generation Template (06_implementation_plan.md)

Always include these 4 phases:
1. **Phase 1: Database** — Migration `e80_lis_up.sql` / `e81_radiology_up.sql` / `e82_functional_tests_up.sql` + reverse files.
2. **Phase 2: Backend** — Extend the department's engine (e.g. `lis.js`, `radiology_engine.js`, `functional_test_engine.js`) + orchestrator.
3. **Phase 3: Frontend** — Build `<dept>-station.js` + integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
4. **Phase 4: QA** — Unit + integration + security audit.

## 5. Token-Saving Rules

- Read only the department's `brain.md` + `01-03` files (already loaded in session).
- Do NOT re-read canonical reference docs (hospital-ui-blueprint, rbac-privacy-audit, etc.) — they are referenced once per session.
- Use the `shared/snippets.md` for repeating sections (PHI vault, audit, RLS).
- Generate all 9 files (3 depts × 3 files) in one parallel tool call batch.

## 6. Output Checklist

For each of the 3 departments, confirm:
- [ ] `04_ux_ui_stitch.md` created with Stitch component names
- [ ] `05_compliance_security.md` created with 4 mandatory sections
- [ ] `06_implementation_plan.md` created with 4 phases
- [ ] Migration file name follows `e8X_<dept>_up.sql` convention
- [ ] `requireRole('<dept>_specialist')` is consistent across all 3 files
