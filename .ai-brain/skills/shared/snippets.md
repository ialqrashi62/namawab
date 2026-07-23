# Shared Snippets for .ai-brain Department Docs

> **Purpose**: Drop-in snippets so we never re-write common paragraphs. Each snippet is a stand-alone markdown block.

---

## RLS / Tenant Isolation
All tables include `tenant_id INTEGER NOT NULL`. All routes use `requireTenantScope` middleware. PostgreSQL RLS policies (`FORCE_RLS=150`) enforce tenant isolation at the database layer.

## PHI Vault
Sensitive files (images, waveforms, videos, genetic reports) are stored in `phi_vault/` outside the webroot and served via `/api/phi-files/:id` with authentication + RLS + audit logging. See `hospital-final-audit-report-ar.md` Phase A3A.

## Stitch 3-Column Station Layout
Clinical stations follow the `ds-*` / `ns-*` 3-column grid: worklist (RTL right), active workspace with tabs (center), actions/AI insights panel (RTL left). See `hospital-ui-blueprint-ar.md` §3.

---

## SNIP-01: PHI Vault Default

```markdown
## 3. PHI Protection
- **Vaulting:** <PHI type> stored in `phi_vault/` outside webroot.
- **Encryption:** DPAPI KEK envelope for all <PHI> records.
- **Access Logging:** Every view of <PHI> writes an `ACCESS_EVENT` to the audit trail.
```

---

## SNIP-02: Hash-Chained Audit Default

```markdown
- **Audit:** All <key records> are hash-chained (audit_middleware.js pattern).
- **Retention:** 7+ years per Saudi MOH / CBAHI.
```

---

## SNIP-03: Golden Access Rule Default

```markdown
- **Golden Access Rule:** Enforced via `requireRole('<role>')`.
- **Segregation of Duties:** Only <role> may <action>; <other role> may only <read action>.
```

---

## SNIP-04: Tenant Isolation Default

```markdown
- **Tenant Isolation:** `requireTenantScope` on every protected route.
- **RLS:** All <entity> tables are FORCE RLS enabled (FORCE_RLS=1).
```

---

## SNIP-05: 04_ux_ui_stitch Header

```markdown
# 04_ux_ui_stitch.md - <Department> UI/UX Design
**Expert: Product Manager & UX Lead**

## 1. Design Philosophy: "<Domain> Command Center"
Focus on <domain KPIs>.

### A. The <Department> Station
- **Layout:** 3-column fluid grid.
    - **Left:** <worklist content>.
    - **Center:** Dynamic tabs for <tabs>.
    - **Right:** AI-Brain panel showing <AI output>.
```

---

## SNIP-06: 04 Safety-Gated Interactions

```markdown
## 4. Safety-Gated Interactions
- <gate 1>
- <gate 2>
- <gate 3>
```

---

## SNIP-07: 05 Header

```markdown
# 05_compliance_security.md - <Department> Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of <PHI>.
- **JCI:** <safety rule>.
- **<Domain body>:** <standard>.
```

---

## SNIP-08: 06 Phase 1

```markdown
## 1. Phase 1: Database
- Migration: `e8X_<dept>_up.sql`.
- Tables: <list>.
- Reverse: `e8X_<dept>_down.sql` (non-destructive, keeps historical data).
```

---

## SNIP-09: 06 Phase 2

```markdown
## 2. Phase 2: Backend
- Extend `<dept>_engine.js`.
- Implement `ai_<dept>_orchestrator.js` (<capability>).
- Add routes to `server.js` with `requireRole('<role>')` and `requireTenantScope`.
```

---

## SNIP-10: 06 Phase 3

```markdown
## 3. Phase 3: Frontend
- Build `<dept>-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add RTL/LTR support and Arabic labels.
```

---

## SNIP-11: 06 Phase 4

```markdown
## 4. Phase 4: QA
- Unit tests for <domain rules>.
- Integration tests for <external links>.
- Security audit for Golden Access Rule and PHI vault access.
```

---

## SNIP-12: Migration Naming Convention

| Series | Range | Domain |
|---|---|---|
| `e70-e79` | Surgical subspecialties | surgical/ |
| `e80-e82` | Diagnostics (LIS, RIS, Functional) | diagnostics/ |
| `e83-e87` | Critical care (ER, ICU, Anesthesia, PACU, NICU) | critical_care/ |
| `e88+` | Reserved for future groups | — |

---

## SNIP-13: 04 Stitch Component Naming

| Pattern | Example |
|---|---|
| `Stitch-Chart-<Type>` | `Stitch-Chart-Waveform`, `Stitch-Chart-Heatmap`, `Stitch-Chart-Line` |
| `Stitch-Anatomy-<Area>` | `Stitch-Anatomy-Heart`, `Stitch-Anatomy-Brain`, `Stitch-Anatomy-Eye` |
| `Stitch-Form-<Type>` | `Stitch-Form-ASIA`, `Stitch-Form-Biometry`, `Stitch-Form-AOOTA` |
| `Stitch-Data-Table-Premium` | Universal data grid |
| `Stitch-Interactive-Checklist` | WHO checklist, safety checklist |
| `Stitch-Range-Clinical` | Sliders for clinical values (IOL power, ROM) |
| `Stitch-Timer-Critical` | Bypass timer, resuscitation timer |
| `Stitch-Calculator-Fluid` | Parkland formula, burn resuscitation |
| `Stitch-Banner-Alert` | Critical findings banner |

## Golden Access Rule
Owner/Admin has absolute access. Doctors/Staff have specialty-based access only. Cross-specialty access requires explicit permission. Enforced via `requireRole('<specialty>')`.

## Safety-Gate Pattern
Safety-critical actions are blocked until checklist/verification is complete. Examples: WHO Surgical Safety Checklist before incision, Aldrete ≥ 9 before PACU discharge, dual verification before blood transfusion.

## Audit Trail
Every PHI access, clinical order, medication administration, and financial transaction is written to the hash-chained audit log with `tenant_id`, `user_id`, `action`, `patient_id`, `record_id`, `details`, `client_ip`, `created_at`.
