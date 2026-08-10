# RBAC Permission Matrix — Pulm-001 (PULM-001)
**Last updated:** 2026-08-10

## Permission matrix for Pulm-001

| Action | Doctor (Pulm-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pulm-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pulm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pulm-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pulm-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pulm-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pulm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pulm-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `pulm_001` doctor can access a patient only if:
1. The patient is in `Pulm-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pulm-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`pulm_001:read`);
requirePermission(`pulm_001:write`);
requirePermission(`pulm_001:sign`);
requirePermission(`pulm_001:delete`);
```

## Roles that can access Pulm-001

- `pulm_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pulm-001

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
