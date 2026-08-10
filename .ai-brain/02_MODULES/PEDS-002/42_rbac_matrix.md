# RBAC Permission Matrix — Peds-002 (PEDS-002)
**Last updated:** 2026-08-10

## Permission matrix for Peds-002

| Action | Doctor (Peds-002) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Peds-002 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Peds-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Peds-002 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Peds-002 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Peds-002 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Peds-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Peds-002 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `peds_002` doctor can access a patient only if:
1. The patient is in `Peds-002` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Peds-002`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`peds_002:read`);
requirePermission(`peds_002:write`);
requirePermission(`peds_002:sign`);
requirePermission(`peds_002:delete`);
```

## Roles that can access Peds-002

- `peds_002_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Peds-002

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
