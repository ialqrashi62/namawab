# RBAC Permission Matrix — Pedssurg (DEP-032)
**Last updated:** 2026-08-10

## Permission matrix for Pedssurg

| Action | Doctor (Pedssurg) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pedssurg record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pedssurg record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pedssurg record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pedssurg record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pedssurg record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pedssurg record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pedssurg data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_032` doctor can access a patient only if:
1. The patient is in `Pedssurg` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pedssurg`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_032:read`);
requirePermission(`dep_032:write`);
requirePermission(`dep_032:sign`);
requirePermission(`dep_032:delete`);
```

## Roles that can access Pedssurg

- `dep_032_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pedssurg

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
