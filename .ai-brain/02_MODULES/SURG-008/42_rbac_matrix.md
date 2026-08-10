# RBAC Permission Matrix — Surg-008 (SURG-008)
**Last updated:** 2026-08-10

## Permission matrix for Surg-008

| Action | Doctor (Surg-008) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-008 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-008 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-008 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-008 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-008 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-008 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-008 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_008` doctor can access a patient only if:
1. The patient is in `Surg-008` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-008`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_008:read`);
requirePermission(`surg_008:write`);
requirePermission(`surg_008:sign`);
requirePermission(`surg_008:delete`);
```

## Roles that can access Surg-008

- `surg_008_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-008

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
