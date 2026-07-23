# Loop Engineering Playbook — NamaMedical .ai-brain

> **الهدف**: تطبيق Loop Engineering (Audit → Prompt → Backend → Frontend → QA/Compliance) على كل قسم.
> **آخر تحديث**: 2026-07-22

---

## The Loop

```
Audit & Gap Analysis
        ↓
Prompt Engineering
        ↓
Backend & Logic
        ↓
Frontend / UI-UX
        ↓
QA & Compliance
        ↓
(Back to Audit if gaps found)
```

---

## 1. Audit & Gap Analysis

### Questions
- What is the current state in `.ai-brain`?
- What is the current state in `namaweb/`?
- What is the global standard for this department?
- What is missing?

### Output
- `brain.md` section 1 intro: current state, global standard, gap.

---

## 2. Prompt Engineering

### Questions
- What is the AI persona?
- What is the context window?
- What is the workflow orchestration?
- What should VectorMine index?

### Output
- `brain.md` section 1 + `02_ai_orchestration.md`.

---

## 3. Backend & Logic

### Questions
- What APIs are needed?
- What tables are needed?
- What are the CDS rules?
- What are the safety gates?

### Output
- `brain.md` section 2 + `03_technical_arch.md`.

---

## 4. Frontend / UI-UX

### Questions
- What Stitch components are needed?
- What are the user stories?
- What is the wireframe layout?

### Output
- `brain.md` section 3 + `04_ux_ui_stitch.md`.

---

## 5. QA & Compliance

### Questions
- What unit tests are needed?
- What integration tests are needed?
- What JCI/PDPL/CBAHI requirements apply?
- What RBAC/audit/PHI rules apply?

### Output
- `brain.md` section 4 + `05_compliance_security.md` + `06_implementation_plan.md`.

---

## Loop Exit Criteria

- All 5 sections of `brain.md` are complete.
- All 01-06 files are complete.
- No unresolved gaps.
- Safety rails verified.

---

## Expert Voice Mapping

| Loop Stage | Expert | File |
|---|---|---|
| Audit | Master Orchestrator | `brain.md` |
| Prompt | Lead AI Engineer | `02_ai_orchestration.md` |
| Backend | Principal Software Architect | `03_technical_arch.md` |
| Frontend | Product Manager & UX Lead | `04_ux_ui_stitch.md` |
| QA/Compliance | Compliance & Quality Officer + DevOps Lead | `05_compliance_security.md` + `06_implementation_plan.md` |
| Clinical Scope | CMO | `01_clinical_spec.md` |
