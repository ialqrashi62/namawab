# nm-ai-brain-phd-template — Token-Saver Skill for 04-06 Generation

> **Purpose**: Reusable template pack so we never re-write 04_ux_ui_stitch / 05_compliance_security / 06_implementation_plan from scratch. The whole pattern is below; replace only the **variable** lines.

## 1. 04_ux_ui_stitch.md — Variable Map

| Line in template | Variable | Source to read |
|---|---|---|
| Title | `<Department Name>` | department folder name |
| Design Philosophy | `<Domain> Command Center` | derived from brain.md Section 1 |
| Stitch components | pull names from brain.md Section 3 (Stitch Tokens list) |
| User story | pulled from brain.md Section 3 (User Stories) |
| Safety-gated interactions | pulled from brain.md Section 5 (Safety Rails) |

## 2. 05_compliance_security.md — Fixed Skeleton

```
# 05_compliance_security.md - <Department> Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- Saudi PDPL: encryption of <PHI type> stored in phi_vault/.
- JCI: <specific safety domain>.
- <Domain body>: <standard>.

## 2. Access Control
- Golden Access Rule: requireRole('<role>').
- Audit: <key records> hash-chained.
- SoD: <who can edit vs read>.

## 3. PHI Protection
- Vaulting: <path>.
- Encryption: DPAPI KEK envelope.
- Access Logging: every view writes ACCESS_EVENT.

## 4. Safety Gates
- <list 3-5 specific gates from brain.md Section 5>.
```

## 3. 06_implementation_plan.md — Fixed Skeleton

```
# 06_implementation_plan.md - <Department> Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: e8X_<dept>_up.sql.
- Tables: <list from brain.md Section 2 Data Model>.
- Reverse: e8X_<dept>_down.sql (non-destructive).

## 2. Phase 2: Backend
- Extend <dept>_engine.js.
- Implement ai_<dept>_orchestrator.js.
- Routes with requireRole('<role>') + requireTenantScope.

## 3. Phase 3: Frontend
- Build <dept>-station.js with Stitch.
- Integrate into app.js NAV_ITEMS + FACILITY_ALLOWED.
- Add RTL/LTR + Arabic labels.

## 4. Phase 4: QA
- Unit tests for <domain rules>.
- Integration tests for <external links>.
- Security audit for Golden Access + PHI vault.
```

## 4. Brain.md Skeleton (for missing brain.md cases like PLASTIC_SURGERY originally)

```
# Brain: <Department>
## Cognitive Core: Ultra-Specialized <Domain> Precision

### 1. Clinical Domain & Scope
- Focus: <list from 01_clinical_spec>.
- Key Workflows: <list 3-5>.

### 2. RAG Strategy & Global Guidelines
- Primary Sources: <bodies>.
- VectorMine Indexing: <collections>.

### 3. Technical Implementation (Backend)
- Database Tables: <list>.
- API Endpoints: <list>.

### 4. UI/UX (Stitch Google Design System)
- Visuals: <list>.
- Components: <list>.

### 5. Safety Rails & Compliance
- Critical Alert: <rule>.
- Tenant Isolation: requireTenantScope on <entity>.
- Audit: hash-chained logs for <records>.
```

## 5. Parallel-Generation Rule

Always create 9 files (3 depts × 3 files) in ONE parallel tool call batch — saves 8 round-trips.
