# RBAC Permission Matrix — Transplant (DEP-020)
**Last updated:** 2026-08-10

## Permission matrix for Transplant

| Action | Doctor (Transplant) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Transplant record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Transplant record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Transplant record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Transplant record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Transplant record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Transplant record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Transplant data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_020` doctor can access a patient only if:
1. The patient is in `Transplant` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Transplant`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_020:read`);
requirePermission(`dep_020:write`);
requirePermission(`dep_020:sign`);
requirePermission(`dep_020:delete`);
```

## Roles that can access Transplant

- `dep_020_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Transplant

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
