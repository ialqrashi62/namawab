# RBAC Permission Matrix — Urogyn (DEP-038)
**Last updated:** 2026-08-10

## Permission matrix for Urogyn

| Action | Doctor (Urogyn) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Urogyn record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Urogyn record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Urogyn record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Urogyn record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Urogyn record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Urogyn record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Urogyn data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_038` doctor can access a patient only if:
1. The patient is in `Urogyn` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Urogyn`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_038:read`);
requirePermission(`dep_038:write`);
requirePermission(`dep_038:sign`);
requirePermission(`dep_038:delete`);
```

## Roles that can access Urogyn

- `dep_038_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Urogyn

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
