# RBAC Permission Matrix — Surg-006 (SURG-006)
**Last updated:** 2026-08-10

## Permission matrix for Surg-006

| Action | Doctor (Surg-006) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-006 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-006 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-006 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-006 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-006 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-006 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-006 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_006` doctor can access a patient only if:
1. The patient is in `Surg-006` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-006`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_006:read`);
requirePermission(`surg_006:write`);
requirePermission(`surg_006:sign`);
requirePermission(`surg_006:delete`);
```

## Roles that can access Surg-006

- `surg_006_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-006

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
