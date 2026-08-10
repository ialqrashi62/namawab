# RBAC Permission Matrix — Pharmacy (DEP-053)
**Last updated:** 2026-08-10

## Permission matrix for Pharmacy

| Action | Doctor (Pharmacy) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pharmacy record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pharmacy record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pharmacy record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pharmacy record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pharmacy record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pharmacy record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pharmacy data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_053` doctor can access a patient only if:
1. The patient is in `Pharmacy` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pharmacy`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_053:read`);
requirePermission(`dep_053:write`);
requirePermission(`dep_053:sign`);
requirePermission(`dep_053:delete`);
```

## Roles that can access Pharmacy

- `dep_053_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pharmacy

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
