# RBAC Permission Matrix — Micu (MICU)
**Last updated:** 2026-08-10

## Permission matrix for Micu

| Action | Doctor (Micu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Micu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Micu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Micu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Micu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Micu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Micu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Micu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `micu` doctor can access a patient only if:
1. The patient is in `Micu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Micu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`micu:read`);
requirePermission(`micu:write`);
requirePermission(`micu:sign`);
requirePermission(`micu:delete`);
```

## Roles that can access Micu

- `micu_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Micu

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
