# RBAC Permission Matrix — Neurosurg (DEP-013)
**Last updated:** 2026-08-10

## Permission matrix for Neurosurg

| Action | Doctor (Neurosurg) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Neurosurg record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Neurosurg record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Neurosurg record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Neurosurg record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Neurosurg record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Neurosurg record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Neurosurg data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_013` doctor can access a patient only if:
1. The patient is in `Neurosurg` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Neurosurg`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_013:read`);
requirePermission(`dep_013:write`);
requirePermission(`dep_013:sign`);
requirePermission(`dep_013:delete`);
```

## Roles that can access Neurosurg

- `dep_013_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Neurosurg

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
