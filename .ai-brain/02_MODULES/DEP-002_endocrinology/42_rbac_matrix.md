# RBAC Permission Matrix — Endocrinology (DEP-002)
**Last updated:** 2026-08-10

## Permission matrix for Endocrinology

| Action | Doctor (Endocrinology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Endocrinology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Endocrinology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Endocrinology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Endocrinology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Endocrinology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Endocrinology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Endocrinology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_002` doctor can access a patient only if:
1. The patient is in `Endocrinology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Endocrinology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_002:read`);
requirePermission(`dep_002:write`);
requirePermission(`dep_002:sign`);
requirePermission(`dep_002:delete`);
```

## Roles that can access Endocrinology

- `dep_002_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Endocrinology

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
