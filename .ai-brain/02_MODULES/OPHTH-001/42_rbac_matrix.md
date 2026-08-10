# RBAC Permission Matrix — Ophth-001 (OPHTH-001)
**Last updated:** 2026-08-10

## Permission matrix for Ophth-001

| Action | Doctor (Ophth-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ophth-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ophth-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ophth-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ophth-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ophth-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ophth-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ophth-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `ophth_001` doctor can access a patient only if:
1. The patient is in `Ophth-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ophth-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`ophth_001:read`);
requirePermission(`ophth_001:write`);
requirePermission(`ophth_001:sign`);
requirePermission(`ophth_001:delete`);
```

## Roles that can access Ophth-001

- `ophth_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ophth-001

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
