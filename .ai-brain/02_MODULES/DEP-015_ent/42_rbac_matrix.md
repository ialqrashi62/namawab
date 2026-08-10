# RBAC Permission Matrix — Ent (DEP-015)
**Last updated:** 2026-08-10

## Permission matrix for Ent

| Action | Doctor (Ent) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ent record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ent record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ent record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ent record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ent record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ent record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ent data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_015` doctor can access a patient only if:
1. The patient is in `Ent` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ent`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_015:read`);
requirePermission(`dep_015:write`);
requirePermission(`dep_015:sign`);
requirePermission(`dep_015:delete`);
```

## Roles that can access Ent

- `dep_015_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ent

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
