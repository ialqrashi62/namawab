# RBAC Permission Matrix — Endo-001 (ENDO-001)
**Last updated:** 2026-08-10

## Permission matrix for Endo-001

| Action | Doctor (Endo-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Endo-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Endo-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Endo-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Endo-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Endo-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Endo-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Endo-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `endo_001` doctor can access a patient only if:
1. The patient is in `Endo-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Endo-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`endo_001:read`);
requirePermission(`endo_001:write`);
requirePermission(`endo_001:sign`);
requirePermission(`endo_001:delete`);
```

## Roles that can access Endo-001

- `endo_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Endo-001

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
