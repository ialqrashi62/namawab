# RBAC Permission Matrix — Radonc (DEP-049)
**Last updated:** 2026-08-10

## Permission matrix for Radonc

| Action | Doctor (Radonc) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Radonc record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Radonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Radonc record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Radonc record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Radonc record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Radonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Radonc data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_049` doctor can access a patient only if:
1. The patient is in `Radonc` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Radonc`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_049:read`);
requirePermission(`dep_049:write`);
requirePermission(`dep_049:sign`);
requirePermission(`dep_049:delete`);
```

## Roles that can access Radonc

- `dep_049_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Radonc

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
