# RBAC Permission Matrix — Medonc (DEP-048)
**Last updated:** 2026-08-10

## Permission matrix for Medonc

| Action | Doctor (Medonc) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Medonc record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Medonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Medonc record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Medonc record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Medonc record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Medonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Medonc data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_048` doctor can access a patient only if:
1. The patient is in `Medonc` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Medonc`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_048:read`);
requirePermission(`dep_048:write`);
requirePermission(`dep_048:sign`);
requirePermission(`dep_048:delete`);
```

## Roles that can access Medonc

- `dep_048_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Medonc

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
