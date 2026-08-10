# RBAC Permission Matrix — Surg-001 (SURG-001)
**Last updated:** 2026-08-10

## Permission matrix for Surg-001

| Action | Doctor (Surg-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_001` doctor can access a patient only if:
1. The patient is in `Surg-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_001:read`);
requirePermission(`surg_001:write`);
requirePermission(`surg_001:sign`);
requirePermission(`surg_001:delete`);
```

## Roles that can access Surg-001

- `surg_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-001

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
