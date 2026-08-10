# RBAC Permission Matrix — Obs (DEP-034)
**Last updated:** 2026-08-10

## Permission matrix for Obs

| Action | Doctor (Obs) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Obs record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Obs record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Obs record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Obs record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Obs record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Obs record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Obs data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_034` doctor can access a patient only if:
1. The patient is in `Obs` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Obs`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_034:read`);
requirePermission(`dep_034:write`);
requirePermission(`dep_034:sign`);
requirePermission(`dep_034:delete`);
```

## Roles that can access Obs

- `dep_034_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Obs

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
