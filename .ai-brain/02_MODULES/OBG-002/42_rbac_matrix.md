# RBAC Permission Matrix — Obg-002 (OBG-002)
**Last updated:** 2026-08-10

## Permission matrix for Obg-002

| Action | Doctor (Obg-002) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Obg-002 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Obg-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Obg-002 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Obg-002 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Obg-002 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Obg-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Obg-002 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `obg_002` doctor can access a patient only if:
1. The patient is in `Obg-002` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Obg-002`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`obg_002:read`);
requirePermission(`obg_002:write`);
requirePermission(`obg_002:sign`);
requirePermission(`obg_002:delete`);
```

## Roles that can access Obg-002

- `obg_002_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Obg-002

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
