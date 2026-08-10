# RBAC Permission Matrix — Pulmonology (DEP-006)
**Last updated:** 2026-08-10

## Permission matrix for Pulmonology

| Action | Doctor (Pulmonology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pulmonology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pulmonology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pulmonology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pulmonology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pulmonology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pulmonology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pulmonology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_006` doctor can access a patient only if:
1. The patient is in `Pulmonology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pulmonology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_006:read`);
requirePermission(`dep_006:write`);
requirePermission(`dep_006:sign`);
requirePermission(`dep_006:delete`);
```

## Roles that can access Pulmonology

- `dep_006_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pulmonology

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
