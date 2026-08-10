# RBAC Permission Matrix — Uro (DEP-017)
**Last updated:** 2026-08-10

## Permission matrix for Uro

| Action | Doctor (Uro) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Uro record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Uro record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Uro record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Uro record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Uro record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Uro record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Uro data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_017` doctor can access a patient only if:
1. The patient is in `Uro` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Uro`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_017:read`);
requirePermission(`dep_017:write`);
requirePermission(`dep_017:sign`);
requirePermission(`dep_017:delete`);
```

## Roles that can access Uro

- `dep_017_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Uro

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
