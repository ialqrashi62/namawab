# RBAC Permission Matrix — Mfm (DEP-037)
**Last updated:** 2026-08-10

## Permission matrix for Mfm

| Action | Doctor (Mfm) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Mfm record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Mfm record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Mfm record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Mfm record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Mfm record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Mfm record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Mfm data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_037` doctor can access a patient only if:
1. The patient is in `Mfm` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Mfm`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_037:read`);
requirePermission(`dep_037:write`);
requirePermission(`dep_037:sign`);
requirePermission(`dep_037:delete`);
```

## Roles that can access Mfm

- `dep_037_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Mfm

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
