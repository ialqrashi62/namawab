# RBAC Permission Matrix — Nephrology (DEP-005)
**Last updated:** 2026-08-10

## Permission matrix for Nephrology

| Action | Doctor (Nephrology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Nephrology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Nephrology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Nephrology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Nephrology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Nephrology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Nephrology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Nephrology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_005` doctor can access a patient only if:
1. The patient is in `Nephrology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Nephrology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_005:read`);
requirePermission(`dep_005:write`);
requirePermission(`dep_005:sign`);
requirePermission(`dep_005:delete`);
```

## Roles that can access Nephrology

- `dep_005_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Nephrology

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
