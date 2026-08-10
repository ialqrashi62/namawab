# RBAC Permission Matrix — Plastic (DEP-018)
**Last updated:** 2026-08-10

## Permission matrix for Plastic

| Action | Doctor (Plastic) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Plastic record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Plastic record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Plastic record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Plastic record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Plastic record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Plastic record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Plastic data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_018` doctor can access a patient only if:
1. The patient is in `Plastic` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Plastic`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_018:read`);
requirePermission(`dep_018:write`);
requirePermission(`dep_018:sign`);
requirePermission(`dep_018:delete`);
```

## Roles that can access Plastic

- `dep_018_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Plastic

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
