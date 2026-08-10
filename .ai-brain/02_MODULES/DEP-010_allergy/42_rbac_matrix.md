# RBAC Permission Matrix — Allergy (DEP-010)
**Last updated:** 2026-08-10

## Permission matrix for Allergy

| Action | Doctor (Allergy) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Allergy record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Allergy record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Allergy record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Allergy record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Allergy record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Allergy record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Allergy data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_010` doctor can access a patient only if:
1. The patient is in `Allergy` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Allergy`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_010:read`);
requirePermission(`dep_010:write`);
requirePermission(`dep_010:sign`);
requirePermission(`dep_010:delete`);
```

## Roles that can access Allergy

- `dep_010_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Allergy

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
