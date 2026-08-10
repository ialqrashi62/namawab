# RBAC Permission Matrix — Pedsneph (DEP-030)
**Last updated:** 2026-08-10

## Permission matrix for Pedsneph

| Action | Doctor (Pedsneph) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pedsneph record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pedsneph record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pedsneph record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pedsneph record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pedsneph record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pedsneph record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pedsneph data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_030` doctor can access a patient only if:
1. The patient is in `Pedsneph` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pedsneph`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_030:read`);
requirePermission(`dep_030:write`);
requirePermission(`dep_030:sign`);
requirePermission(`dep_030:delete`);
```

## Roles that can access Pedsneph

- `dep_030_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pedsneph

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
