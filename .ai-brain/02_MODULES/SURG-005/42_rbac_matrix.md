# RBAC Permission Matrix — Surg-005 (SURG-005)
**Last updated:** 2026-08-10

## Permission matrix for Surg-005

| Action | Doctor (Surg-005) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-005 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-005 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-005 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-005 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-005 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-005 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-005 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_005` doctor can access a patient only if:
1. The patient is in `Surg-005` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-005`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_005:read`);
requirePermission(`surg_005:write`);
requirePermission(`surg_005:sign`);
requirePermission(`surg_005:delete`);
```

## Roles that can access Surg-005

- `surg_005_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-005

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
