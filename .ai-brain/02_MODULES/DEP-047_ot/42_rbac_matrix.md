# RBAC Permission Matrix — Ot (DEP-047)
**Last updated:** 2026-08-10

## Permission matrix for Ot

| Action | Doctor (Ot) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ot record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ot record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ot record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ot record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ot record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ot record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ot data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_047` doctor can access a patient only if:
1. The patient is in `Ot` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ot`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_047:read`);
requirePermission(`dep_047:write`);
requirePermission(`dep_047:sign`);
requirePermission(`dep_047:delete`);
```

## Roles that can access Ot

- `dep_047_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ot

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
