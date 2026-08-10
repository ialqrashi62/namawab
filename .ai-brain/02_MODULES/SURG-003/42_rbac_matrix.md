# RBAC Permission Matrix — Surg-003 (SURG-003)
**Last updated:** 2026-08-10

## Permission matrix for Surg-003

| Action | Doctor (Surg-003) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-003 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-003 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-003 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-003 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-003 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-003 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-003 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_003` doctor can access a patient only if:
1. The patient is in `Surg-003` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-003`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_003:read`);
requirePermission(`surg_003:write`);
requirePermission(`surg_003:sign`);
requirePermission(`surg_003:delete`);
```

## Roles that can access Surg-003

- `surg_003_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-003

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
