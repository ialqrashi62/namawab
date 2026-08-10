# RBAC Permission Matrix — Surg-002 (SURG-002)
**Last updated:** 2026-08-10

## Permission matrix for Surg-002

| Action | Doctor (Surg-002) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-002 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-002 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-002 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-002 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-002 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_002` doctor can access a patient only if:
1. The patient is in `Surg-002` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-002`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_002:read`);
requirePermission(`surg_002:write`);
requirePermission(`surg_002:sign`);
requirePermission(`surg_002:delete`);
```

## Roles that can access Surg-002

- `surg_002_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-002

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
