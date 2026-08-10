# RBAC Permission Matrix — Gastroenterology (DEP-003)
**Last updated:** 2026-08-10

## Permission matrix for Gastroenterology

| Action | Doctor (Gastroenterology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Gastroenterology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Gastroenterology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Gastroenterology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Gastroenterology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Gastroenterology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Gastroenterology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Gastroenterology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_003` doctor can access a patient only if:
1. The patient is in `Gastroenterology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Gastroenterology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_003:read`);
requirePermission(`dep_003:write`);
requirePermission(`dep_003:sign`);
requirePermission(`dep_003:delete`);
```

## Roles that can access Gastroenterology

- `dep_003_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Gastroenterology

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
