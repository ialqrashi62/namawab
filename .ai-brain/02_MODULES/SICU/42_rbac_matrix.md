# RBAC Permission Matrix — Sicu (SICU)
**Last updated:** 2026-08-10

## Permission matrix for Sicu

| Action | Doctor (Sicu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Sicu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Sicu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Sicu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Sicu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Sicu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Sicu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Sicu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `sicu` doctor can access a patient only if:
1. The patient is in `Sicu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Sicu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`sicu:read`);
requirePermission(`sicu:write`);
requirePermission(`sicu:sign`);
requirePermission(`sicu:delete`);
```

## Roles that can access Sicu

- `sicu_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Sicu

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
