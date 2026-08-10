# RBAC Permission Matrix — Vascular (DEP-019)
**Last updated:** 2026-08-10

## Permission matrix for Vascular

| Action | Doctor (Vascular) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Vascular record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Vascular record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Vascular record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Vascular record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Vascular record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Vascular record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Vascular data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_019` doctor can access a patient only if:
1. The patient is in `Vascular` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Vascular`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_019:read`);
requirePermission(`dep_019:write`);
requirePermission(`dep_019:sign`);
requirePermission(`dep_019:delete`);
```

## Roles that can access Vascular

- `dep_019_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Vascular

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
