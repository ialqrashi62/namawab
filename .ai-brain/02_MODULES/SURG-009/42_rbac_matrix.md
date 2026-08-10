# RBAC Permission Matrix — Surg-009 (SURG-009)
**Last updated:** 2026-08-10

## Permission matrix for Surg-009

| Action | Doctor (Surg-009) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-009 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-009 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-009 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-009 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-009 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-009 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-009 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_009` doctor can access a patient only if:
1. The patient is in `Surg-009` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-009`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_009:read`);
requirePermission(`surg_009:write`);
requirePermission(`surg_009:sign`);
requirePermission(`surg_009:delete`);
```

## Roles that can access Surg-009

- `surg_009_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-009

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
