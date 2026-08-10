# RBAC Permission Matrix — Pharm-001 (PHARM-001)
**Last updated:** 2026-08-10

## Permission matrix for Pharm-001

| Action | Doctor (Pharm-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pharm-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pharm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pharm-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pharm-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pharm-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pharm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pharm-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `pharm_001` doctor can access a patient only if:
1. The patient is in `Pharm-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pharm-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`pharm_001:read`);
requirePermission(`pharm_001:write`);
requirePermission(`pharm_001:sign`);
requirePermission(`pharm_001:delete`);
```

## Roles that can access Pharm-001

- `pharm_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pharm-001

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
