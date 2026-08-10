# RBAC Permission Matrix — Derm-001 (DERM-001)
**Last updated:** 2026-08-10

## Permission matrix for Derm-001

| Action | Doctor (Derm-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Derm-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Derm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Derm-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Derm-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Derm-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Derm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Derm-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `derm_001` doctor can access a patient only if:
1. The patient is in `Derm-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Derm-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`derm_001:read`);
requirePermission(`derm_001:write`);
requirePermission(`derm_001:sign`);
requirePermission(`derm_001:delete`);
```

## Roles that can access Derm-001

- `derm_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Derm-001

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
