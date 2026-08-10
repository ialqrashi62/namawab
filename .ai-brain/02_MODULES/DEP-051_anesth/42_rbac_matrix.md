# RBAC Permission Matrix — Anesth (DEP-051)
**Last updated:** 2026-08-10

## Permission matrix for Anesth

| Action | Doctor (Anesth) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Anesth record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Anesth record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Anesth record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Anesth record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Anesth record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Anesth record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Anesth data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_051` doctor can access a patient only if:
1. The patient is in `Anesth` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Anesth`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_051:read`);
requirePermission(`dep_051:write`);
requirePermission(`dep_051:sign`);
requirePermission(`dep_051:delete`);
```

## Roles that can access Anesth

- `dep_051_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Anesth

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
