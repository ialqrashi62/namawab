# RBAC Permission Matrix — Nicu (DEP-023)
**Last updated:** 2026-08-10

## Permission matrix for Nicu

| Action | Doctor (Nicu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Nicu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Nicu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Nicu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Nicu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Nicu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Nicu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Nicu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_023` doctor can access a patient only if:
1. The patient is in `Nicu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Nicu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_023:read`);
requirePermission(`dep_023:write`);
requirePermission(`dep_023:sign`);
requirePermission(`dep_023:delete`);
```

## Roles that can access Nicu

- `dep_023_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Nicu

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
