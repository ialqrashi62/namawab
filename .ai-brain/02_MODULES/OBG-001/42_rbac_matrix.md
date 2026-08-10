# RBAC Permission Matrix — Obg-001 (OBG-001)
**Last updated:** 2026-08-10

## Permission matrix for Obg-001

| Action | Doctor (Obg-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Obg-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Obg-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Obg-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Obg-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Obg-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Obg-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Obg-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `obg_001` doctor can access a patient only if:
1. The patient is in `Obg-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Obg-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`obg_001:read`);
requirePermission(`obg_001:write`);
requirePermission(`obg_001:sign`);
requirePermission(`obg_001:delete`);
```

## Roles that can access Obg-001

- `obg_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Obg-001

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
