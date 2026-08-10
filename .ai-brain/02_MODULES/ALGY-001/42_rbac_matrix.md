# RBAC Permission Matrix — Algy-001 (ALGY-001)
**Last updated:** 2026-08-10

## Permission matrix for Algy-001

| Action | Doctor (Algy-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Algy-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Algy-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Algy-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Algy-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Algy-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Algy-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Algy-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `algy_001` doctor can access a patient only if:
1. The patient is in `Algy-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Algy-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`algy_001:read`);
requirePermission(`algy_001:write`);
requirePermission(`algy_001:sign`);
requirePermission(`algy_001:delete`);
```

## Roles that can access Algy-001

- `algy_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Algy-001

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
