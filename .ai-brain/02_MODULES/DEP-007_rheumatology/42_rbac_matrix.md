# RBAC Permission Matrix — Rheumatology (DEP-007)
**Last updated:** 2026-08-10

## Permission matrix for Rheumatology

| Action | Doctor (Rheumatology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Rheumatology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Rheumatology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Rheumatology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Rheumatology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Rheumatology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Rheumatology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Rheumatology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_007` doctor can access a patient only if:
1. The patient is in `Rheumatology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Rheumatology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_007:read`);
requirePermission(`dep_007:write`);
requirePermission(`dep_007:sign`);
requirePermission(`dep_007:delete`);
```

## Roles that can access Rheumatology

- `dep_007_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Rheumatology

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
