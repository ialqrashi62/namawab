# RBAC Permission Matrix — Fertility (DEP-036)
**Last updated:** 2026-08-10

## Permission matrix for Fertility

| Action | Doctor (Fertility) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Fertility record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Fertility record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Fertility record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Fertility record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Fertility record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Fertility record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Fertility data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_036` doctor can access a patient only if:
1. The patient is in `Fertility` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Fertility`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_036:read`);
requirePermission(`dep_036:write`);
requirePermission(`dep_036:sign`);
requirePermission(`dep_036:delete`);
```

## Roles that can access Fertility

- `dep_036_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Fertility

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
