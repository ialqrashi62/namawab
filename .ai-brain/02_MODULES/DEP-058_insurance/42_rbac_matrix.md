# RBAC Permission Matrix — Insurance (DEP-058)
**Last updated:** 2026-08-10

## Permission matrix for Insurance

| Action | Doctor (Insurance) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Insurance record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Insurance record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Insurance record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Insurance record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Insurance record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Insurance record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Insurance data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_058` doctor can access a patient only if:
1. The patient is in `Insurance` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Insurance`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_058:read`);
requirePermission(`dep_058:write`);
requirePermission(`dep_058:sign`);
requirePermission(`dep_058:delete`);
```

## Roles that can access Insurance

- `dep_058_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Insurance

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
