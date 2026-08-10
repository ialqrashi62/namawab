# RBAC Permission Matrix — Nnicu (NNICU)
**Last updated:** 2026-08-10

## Permission matrix for Nnicu

| Action | Doctor (Nnicu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Nnicu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Nnicu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Nnicu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Nnicu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Nnicu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Nnicu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Nnicu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `nnicu` doctor can access a patient only if:
1. The patient is in `Nnicu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Nnicu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`nnicu:read`);
requirePermission(`nnicu:write`);
requirePermission(`nnicu:sign`);
requirePermission(`nnicu:delete`);
```

## Roles that can access Nnicu

- `nnicu_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Nnicu

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
