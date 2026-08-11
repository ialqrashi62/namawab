---
name: nm-rbac-default
description: Use when defining role permissions for any new feature or endpoint. Loads the canonical RBAC matrix from rbac.js so every route inherits the right roles. Enforces Golden Access Rule (RAIL-13).
---

# RBAC Default Matrix

## Roles (in priority order)

1. `owner` — absolute access (Golden Access Rule)
2. `admin` — facility-wide config
3. `doctor` — clinical writes
4. `nurse` — clinical observation writes, meds admin
5. `lab` — lab result entry
6. `radiology` — imaging read/write
7. `pharmacy` — medication dispense
8. `receptionist` — appointment/scheduling only
9. `patient` — own records only

## Default matrix per resource

| Resource | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| Patient demographics | doc,nurse,reception,admin,owner | admin,owner | admin,owner | owner |
| Vitals | doc,nurse,admin,owner | doc,nurse | doc,nurse | admin,owner |
| Lab orders | doc,lab,admin,owner | doc,admin | lab,admin | doc,admin,owner |
| Lab results | doc,lab,nurse,admin,owner | lab,admin | lab,admin | admin,owner |
| Imaging orders | doc,radio,admin,owner | doc,admin | radio,admin | admin,owner |
| Imaging results | doc,radio,admin,owner | radio,admin | radio,admin | admin,owner |
| Medication orders | doc,pharm,admin,owner | doc,admin | pharm,doc,admin | admin,owner |
| Med admin | doc,nurse,pharm,admin,owner | nurse,pharm | nurse,pharm,doc | admin,owner |
| Surgery scheduling | doc,surgery,admin,owner | surgery,admin | surgery,doc,admin | admin,owner |
| Billing | admin,finance,owner | admin,finance | admin,finance | admin,owner |
| Claims (NPHIES) | admin,finance,owner | admin,finance | admin,finance | owner |
| Audit log | owner | (no POST allowed; automated only) | (no PUT) | (no DELETE) |
| Department config | owner,admin | owner | owner | owner |
| Tenant onboarding | owner | owner | owner | owner |
| AI co-pilot chat | doc,nurse,owner | doc,nurse,owner | (no PUT) | (no DELETE) |
| Vector search | doc,nurse,admin,owner | (no POST) | (no PUT) | (no DELETE) |

## Golden Access Rule (RAIL-13)

- Owner → absolute access (bypasses all checks)
- Admin → facility-wide access
- Doctor/Nurse → **strict specialty-based access**: cannot access other specialties
  without explicit cross-specialty permission
- Cross-specialty request requires a `cross_specialty_grants` table row with
  `(grantee_user_id, specialty_id, expires_at, granted_by)`

## Usage

```js
const { requireRole, requireSpecialtyAccess } = require('./mw');

router.post('/assessments/foo',
    requireAuth,
    requireTenantScope,
    requireRole('doctor'),                                  // RBAC
    requireSpecialtyAccess('cardiology'),                    // Golden Access Rule
    validateBody(RS.fooCreate),
    idempotencyGuard,
    handler
);
```

## Forbidden combinations (rejected at code review)

- ❌ `requireRole('doctor', 'patient')` — patients don't write clinical data
- ❌ Allowing `requireRole('nurse')` to read other specialties without `requireSpecialtyAccess`
- ❌ Any route without `requireRole` for clinical writes
- ❌ Skipping `requireSpecialtyAccess` on cross-specialty reads

## Adding a new role

1. Update `namaweb/middleware/rbac.js` to add the role
2. Update `rbac_guards.js` with role-to-permission map
3. Update `docs/governance/.../RBAC_MATRIX_AR.md` with the new role
4. Add migration `eN_add_role_name` to extend the role enum if DB-stored
5. Add regression test in `*_test.js`

## Token saving

Avoids ~200 lines of per-route role negotiation. Each route writes one line
`requireRole(...)` and inherits the matrix. ~80% token reduction on RBAC code.