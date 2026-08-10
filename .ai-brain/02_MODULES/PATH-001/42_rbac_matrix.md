# RBAC Permission Matrix — Path-001 (PATH-001)
**Last updated:** 2026-08-10

## Permission matrix for Path-001

| Action | Doctor (Path-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Path-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Path-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Path-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Path-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Path-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Path-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Path-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `path_001` doctor can access a patient only if:
1. The patient is in `Path-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Path-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`path_001:read`);
requirePermission(`path_001:write`);
requirePermission(`path_001:sign`);
requirePermission(`path_001:delete`);
```

## Roles that can access Path-001

- `path_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Path-001

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
