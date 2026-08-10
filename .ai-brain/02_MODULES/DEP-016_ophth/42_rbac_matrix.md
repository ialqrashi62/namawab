# RBAC Permission Matrix — Ophth (DEP-016)
**Last updated:** 2026-08-10

## Permission matrix for Ophth

| Action | Doctor (Ophth) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ophth record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ophth record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ophth record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ophth record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ophth record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ophth record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ophth data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_016` doctor can access a patient only if:
1. The patient is in `Ophth` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ophth`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_016:read`);
requirePermission(`dep_016:write`);
requirePermission(`dep_016:sign`);
requirePermission(`dep_016:delete`);
```

## Roles that can access Ophth

- `dep_016_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ophth

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
