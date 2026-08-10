# RBAC Permission Matrix — Surg-011 (SURG-011)
**Last updated:** 2026-08-10

## Permission matrix for Surg-011

| Action | Doctor (Surg-011) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-011 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-011 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-011 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-011 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-011 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-011 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-011 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_011` doctor can access a patient only if:
1. The patient is in `Surg-011` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-011`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_011:read`);
requirePermission(`surg_011:write`);
requirePermission(`surg_011:sign`);
requirePermission(`surg_011:delete`);
```

## Roles that can access Surg-011

- `surg_011_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-011

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
