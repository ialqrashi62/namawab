# RBAC Permission Matrix — Psych (DEP-044)
**Last updated:** 2026-08-10

## Permission matrix for Psych

| Action | Doctor (Psych) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Psych record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Psych record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Psych record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Psych record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Psych record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Psych record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Psych data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_044` doctor can access a patient only if:
1. The patient is in `Psych` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Psych`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_044:read`);
requirePermission(`dep_044:write`);
requirePermission(`dep_044:sign`);
requirePermission(`dep_044:delete`);
```

## Roles that can access Psych

- `dep_044_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Psych

- `pharmacist` (unless cross-specialty consult)
- `lab_tech` (unless cross-specialty consult)
- `cashier`
- `quality_staff` (unless investigation)

## Emergency override

- Click "Emergency Override" button in UI
- Logs override (audit_middleware)
- Notifies CMO via SMS
- Auto-reverts after 24h
- Requires retrospective review

## Cross-specialty consult

- Other specialty doctor can request consult
- Once approved, can read for 7 days
- Logged in audit
