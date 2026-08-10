# RBAC Permission Matrix — Emergency (DEP-021)
**Last updated:** 2026-08-10

## Permission matrix for Emergency

| Action | Doctor (Emergency) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Emergency record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Emergency record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Emergency record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Emergency record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Emergency record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Emergency record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Emergency data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_021` doctor can access a patient only if:
1. The patient is in `Emergency` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Emergency`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_021:read`);
requirePermission(`dep_021:write`);
requirePermission(`dep_021:sign`);
requirePermission(`dep_021:delete`);
```

## Roles that can access Emergency

- `dep_021_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Emergency

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
