# RBAC Permission Matrix — Hh-001 (HH-001)
**Last updated:** 2026-08-10

## Permission matrix for Hh-001

| Action | Doctor (Hh-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Hh-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Hh-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Hh-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Hh-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Hh-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Hh-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Hh-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `hh_001` doctor can access a patient only if:
1. The patient is in `Hh-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Hh-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`hh_001:read`);
requirePermission(`hh_001:write`);
requirePermission(`hh_001:sign`);
requirePermission(`hh_001:delete`);
```

## Roles that can access Hh-001

- `hh_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Hh-001

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
