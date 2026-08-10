# RBAC Permission Matrix — Plast-001 (PLAST-001)
**Last updated:** 2026-08-10

## Permission matrix for Plast-001

| Action | Doctor (Plast-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Plast-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Plast-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Plast-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Plast-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Plast-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Plast-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Plast-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `plast_001` doctor can access a patient only if:
1. The patient is in `Plast-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Plast-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`plast_001:read`);
requirePermission(`plast_001:write`);
requirePermission(`plast_001:sign`);
requirePermission(`plast_001:delete`);
```

## Roles that can access Plast-001

- `plast_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Plast-001

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
