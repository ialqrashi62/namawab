# RBAC Permission Matrix — Pacu (PACU)
**Last updated:** 2026-08-10

## Permission matrix for Pacu

| Action | Doctor (Pacu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pacu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pacu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pacu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pacu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pacu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pacu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pacu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `pacu` doctor can access a patient only if:
1. The patient is in `Pacu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pacu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`pacu:read`);
requirePermission(`pacu:write`);
requirePermission(`pacu:sign`);
requirePermission(`pacu:delete`);
```

## Roles that can access Pacu

- `pacu_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pacu

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
