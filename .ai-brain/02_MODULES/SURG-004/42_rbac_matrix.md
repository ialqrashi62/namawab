# RBAC Permission Matrix — Surg-004 (SURG-004)
**Last updated:** 2026-08-10

## Permission matrix for Surg-004

| Action | Doctor (Surg-004) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-004 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-004 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-004 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-004 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-004 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-004 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-004 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_004` doctor can access a patient only if:
1. The patient is in `Surg-004` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-004`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_004:read`);
requirePermission(`surg_004:write`);
requirePermission(`surg_004:sign`);
requirePermission(`surg_004:delete`);
```

## Roles that can access Surg-004

- `surg_004_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-004

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
