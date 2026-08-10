# RBAC Permission Matrix — Peds-001 (PEDS-001)
**Last updated:** 2026-08-10

## Permission matrix for Peds-001

| Action | Doctor (Peds-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Peds-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Peds-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Peds-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Peds-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Peds-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Peds-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Peds-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `peds_001` doctor can access a patient only if:
1. The patient is in `Peds-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Peds-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`peds_001:read`);
requirePermission(`peds_001:write`);
requirePermission(`peds_001:sign`);
requirePermission(`peds_001:delete`);
```

## Roles that can access Peds-001

- `peds_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Peds-001

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
