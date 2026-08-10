# RBAC Permission Matrix — Nucmed (DEP-042)
**Last updated:** 2026-08-10

## Permission matrix for Nucmed

| Action | Doctor (Nucmed) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Nucmed record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Nucmed record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Nucmed record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Nucmed record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Nucmed record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Nucmed record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Nucmed data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_042` doctor can access a patient only if:
1. The patient is in `Nucmed` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Nucmed`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_042:read`);
requirePermission(`dep_042:write`);
requirePermission(`dep_042:sign`);
requirePermission(`dep_042:delete`);
```

## Roles that can access Nucmed

- `dep_042_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Nucmed

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
