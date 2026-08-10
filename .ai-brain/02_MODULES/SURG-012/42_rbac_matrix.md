# RBAC Permission Matrix — Surg-012 (SURG-012)
**Last updated:** 2026-08-10

## Permission matrix for Surg-012

| Action | Doctor (Surg-012) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-012 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-012 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-012 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-012 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-012 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-012 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-012 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_012` doctor can access a patient only if:
1. The patient is in `Surg-012` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-012`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_012:read`);
requirePermission(`surg_012:write`);
requirePermission(`surg_012:sign`);
requirePermission(`surg_012:delete`);
```

## Roles that can access Surg-012

- `surg_012_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-012

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
