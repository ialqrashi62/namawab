# RBAC Permission Matrix — Ortho (DEP-012)
**Last updated:** 2026-08-10

## Permission matrix for Ortho

| Action | Doctor (Ortho) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ortho record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ortho record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ortho record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ortho record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ortho record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ortho record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ortho data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_012` doctor can access a patient only if:
1. The patient is in `Ortho` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ortho`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_012:read`);
requirePermission(`dep_012:write`);
requirePermission(`dep_012:sign`);
requirePermission(`dep_012:delete`);
```

## Roles that can access Ortho

- `dep_012_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ortho

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
