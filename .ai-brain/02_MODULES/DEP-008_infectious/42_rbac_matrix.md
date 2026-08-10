# RBAC Permission Matrix — Infectious (DEP-008)
**Last updated:** 2026-08-10

## Permission matrix for Infectious

| Action | Doctor (Infectious) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Infectious record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Infectious record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Infectious record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Infectious record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Infectious record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Infectious record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Infectious data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_008` doctor can access a patient only if:
1. The patient is in `Infectious` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Infectious`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_008:read`);
requirePermission(`dep_008:write`);
requirePermission(`dep_008:sign`);
requirePermission(`dep_008:delete`);
```

## Roles that can access Infectious

- `dep_008_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Infectious

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
