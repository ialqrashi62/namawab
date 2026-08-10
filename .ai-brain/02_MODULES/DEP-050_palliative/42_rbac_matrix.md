# RBAC Permission Matrix — Palliative (DEP-050)
**Last updated:** 2026-08-10

## Permission matrix for Palliative

| Action | Doctor (Palliative) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Palliative record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Palliative record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Palliative record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Palliative record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Palliative record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Palliative record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Palliative data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_050` doctor can access a patient only if:
1. The patient is in `Palliative` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Palliative`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_050:read`);
requirePermission(`dep_050:write`);
requirePermission(`dep_050:sign`);
requirePermission(`dep_050:delete`);
```

## Roles that can access Palliative

- `dep_050_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Palliative

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
