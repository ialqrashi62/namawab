# RBAC Permission Matrix — Icu (DEP-022)
**Last updated:** 2026-08-10

## Permission matrix for Icu

| Action | Doctor (Icu) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Icu record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Icu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Icu record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Icu record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Icu record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Icu record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Icu data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_022` doctor can access a patient only if:
1. The patient is in `Icu` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Icu`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_022:read`);
requirePermission(`dep_022:write`);
requirePermission(`dep_022:sign`);
requirePermission(`dep_022:delete`);
```

## Roles that can access Icu

- `dep_022_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Icu

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
