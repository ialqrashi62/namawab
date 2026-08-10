# RBAC Permission Matrix — Picu (DEP-024)
**Last updated:** 2026-08-10

## Permission matrix for Picu

| Action | Doctor (Picu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Picu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Picu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Picu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Picu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Picu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Picu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Picu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_024` doctor can access a patient only if:
1. The patient is in `Picu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Picu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_024:read`);
requirePermission(`dep_024:write`);
requirePermission(`dep_024:sign`);
requirePermission(`dep_024:delete`);
```

## Roles that can access Picu

- `dep_024_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Picu

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
