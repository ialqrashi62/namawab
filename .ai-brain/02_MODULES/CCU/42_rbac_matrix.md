# RBAC Permission Matrix — Ccu (CCU)
**Last updated:** 2026-08-10

## Permission matrix for Ccu

| Action | Doctor (Ccu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ccu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ccu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ccu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ccu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ccu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ccu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ccu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `ccu` doctor can access a patient only if:
1. The patient is in `Ccu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ccu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`ccu:read`);
requirePermission(`ccu:write`);
requirePermission(`ccu:sign`);
requirePermission(`ccu:delete`);
```

## Roles that can access Ccu

- `ccu_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ccu

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
