# RBAC Permission Matrix — Neph-001 (NEPH-001)
**Last updated:** 2026-08-10

## Permission matrix for Neph-001

| Action | Doctor (Neph-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Neph-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Neph-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Neph-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Neph-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Neph-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Neph-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Neph-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `neph_001` doctor can access a patient only if:
1. The patient is in `Neph-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Neph-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`neph_001:read`);
requirePermission(`neph_001:write`);
requirePermission(`neph_001:sign`);
requirePermission(`neph_001:delete`);
```

## Roles that can access Neph-001

- `neph_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Neph-001

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
