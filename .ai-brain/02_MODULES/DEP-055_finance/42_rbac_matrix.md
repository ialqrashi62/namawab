# RBAC Permission Matrix — Finance (DEP-055)
**Last updated:** 2026-08-10

## Permission matrix for Finance

| Action | Doctor (Finance) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Finance record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Finance record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Finance record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Finance record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Finance record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Finance record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Finance data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_055` doctor can access a patient only if:
1. The patient is in `Finance` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Finance`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_055:read`);
requirePermission(`dep_055:write`);
requirePermission(`dep_055:sign`);
requirePermission(`dep_055:delete`);
```

## Roles that can access Finance

- `dep_055_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Finance

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
