# RBAC Permission Matrix — Anes-001 (ANES-001)
**Last updated:** 2026-08-10

## Permission matrix for Anes-001

| Action | Doctor (Anes-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Anes-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Anes-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Anes-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Anes-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Anes-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Anes-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Anes-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `anes_001` doctor can access a patient only if:
1. The patient is in `Anes-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Anes-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`anes_001:read`);
requirePermission(`anes_001:write`);
requirePermission(`anes_001:sign`);
requirePermission(`anes_001:delete`);
```

## Roles that can access Anes-001

- `anes_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Anes-001

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
