# RBAC Permission Matrix — Surg-010 (SURG-010)
**Last updated:** 2026-08-10

## Permission matrix for Surg-010

| Action | Doctor (Surg-010) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-010 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-010 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-010 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-010 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-010 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-010 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-010 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_010` doctor can access a patient only if:
1. The patient is in `Surg-010` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-010`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_010:read`);
requirePermission(`surg_010:write`);
requirePermission(`surg_010:sign`);
requirePermission(`surg_010:delete`);
```

## Roles that can access Surg-010

- `surg_010_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-010

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
