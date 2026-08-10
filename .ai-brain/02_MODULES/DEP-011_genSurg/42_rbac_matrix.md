# RBAC Permission Matrix — Gensurg (DEP-011)
**Last updated:** 2026-08-10

## Permission matrix for Gensurg

| Action | Doctor (Gensurg) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Gensurg record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Gensurg record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Gensurg record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Gensurg record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Gensurg record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Gensurg record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Gensurg data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_011` doctor can access a patient only if:
1. The patient is in `Gensurg` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Gensurg`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_011:read`);
requirePermission(`dep_011:write`);
requirePermission(`dep_011:sign`);
requirePermission(`dep_011:delete`);
```

## Roles that can access Gensurg

- `dep_011_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Gensurg

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
