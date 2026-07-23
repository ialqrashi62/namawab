# PEDS-002 — Middleware Chain

## Layered Security
```js
// 1. requireAuth
// 2. requireTenantScope
// 3. requireRole
// 4. validateBody (FAIL-CLOSED)
// 5. highAlertGuard (for high-alert meds: insulin, vasoactive, opioid)
// 6. weightCheckGuard (re-verify weight + dose)
// 7. auditMiddleware
```

## NICU Roles
- `neonatologist` — full access
- `fellow_neonatology` — limited
- `nicu_nurse` — vitals, feeds, documentation
- `rt` (Respiratory Therapist) — vent
- `lactation_consultant` — breastfeeding
- `nicu_social_worker` — psychosocial
- `nicu_pharmacist` — medication review
- `admin` — read-only

## High-Alert Guard
- **Drugs:** Insulin, vasopressors, opioids, paralytics, prostaglandin E1 (alprostadil for PDA), K+ concentrate
- **Double-check:** Verbal + visual confirmation
- **Co-sign:** Attending required

## Weight Check Guard
- **Verify weight:** Current vs birth weight
- **Recalculate dose:** mg/kg/day, mL/kg
- **Range check:** vs max safe dose
- **Alert if exceeds max**

## Special Considerations
- **Blood products:** Volume = 10-15 mL/kg (packed RBC)
- **Parenteral nutrition:** Compounded by pharmacy
- **Surfactant:** Refrigerated, single-dose
- **Prostaglandin E1:** Continuous infusion, line dedicated

## Idempotency
- Medication order (no duplicate)
- Respiratory support change
- Feed order

## Tenant Isolation
- Per AGENTS.md §2.2 rail #5
- Mother-baby link: mother in OBG, baby in PEDS
- Link via patient_id + birth record (no cross-tenant)

## Audit
- All admissions
- All critical events
- All medication orders
- All parental communications
