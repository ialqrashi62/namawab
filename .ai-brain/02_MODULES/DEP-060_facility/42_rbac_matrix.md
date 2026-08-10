# RBAC Permission Matrix — Facility (DEP-060)
**Last updated:** 2026-08-10

## Permission matrix for Facility

| Action | Doctor (Facility) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Facility record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Facility record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Facility record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Facility record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Facility record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Facility record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Facility data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_060` doctor can access a patient only if:
1. The patient is in `Facility` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Facility`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_060:read`);
requirePermission(`dep_060:write`);
requirePermission(`dep_060:sign`);
requirePermission(`dep_060:delete`);
```

## Roles that can access Facility

- `dep_060_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Facility

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
