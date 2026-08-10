# RBAC Permission Matrix — Radiology (DEP-040)
**Last updated:** 2026-08-10

## Permission matrix for Radiology

| Action | Doctor (Radiology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Radiology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Radiology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Radiology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Radiology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Radiology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Radiology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Radiology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_040` doctor can access a patient only if:
1. The patient is in `Radiology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Radiology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_040:read`);
requirePermission(`dep_040:write`);
requirePermission(`dep_040:sign`);
requirePermission(`dep_040:delete`);
```

## Roles that can access Radiology

- `dep_040_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Radiology

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
