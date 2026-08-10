# RBAC Permission Matrix — Pedsneuro (DEP-029)
**Last updated:** 2026-08-10

## Permission matrix for Pedsneuro

| Action | Doctor (Pedsneuro) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pedsneuro record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pedsneuro record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pedsneuro record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pedsneuro record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pedsneuro record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pedsneuro record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pedsneuro data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_029` doctor can access a patient only if:
1. The patient is in `Pedsneuro` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pedsneuro`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_029:read`);
requirePermission(`dep_029:write`);
requirePermission(`dep_029:sign`);
requirePermission(`dep_029:delete`);
```

## Roles that can access Pedsneuro

- `dep_029_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pedsneuro

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
