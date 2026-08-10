# RBAC Permission Matrix — Rad-001 (RAD-001)
**Last updated:** 2026-08-10

## Permission matrix for Rad-001

| Action | Doctor (Rad-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Rad-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Rad-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Rad-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Rad-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Rad-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Rad-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Rad-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `rad_001` doctor can access a patient only if:
1. The patient is in `Rad-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Rad-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`rad_001:read`);
requirePermission(`rad_001:write`);
requirePermission(`rad_001:sign`);
requirePermission(`rad_001:delete`);
```

## Roles that can access Rad-001

- `rad_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Rad-001

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
