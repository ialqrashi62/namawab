# RBAC Permission Matrix — Ir (DEP-041)
**Last updated:** 2026-08-10

## Permission matrix for Ir

| Action | Doctor (Ir) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ir record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ir record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ir record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ir record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ir record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ir record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ir data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_041` doctor can access a patient only if:
1. The patient is in `Ir` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ir`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_041:read`);
requirePermission(`dep_041:write`);
requirePermission(`dep_041:sign`);
requirePermission(`dep_041:delete`);
```

## Roles that can access Ir

- `dep_041_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ir

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
