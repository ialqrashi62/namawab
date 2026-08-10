# RBAC Permission Matrix — Rehab-001 (REHAB-001)
**Last updated:** 2026-08-10

## Permission matrix for Rehab-001

| Action | Doctor (Rehab-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Rehab-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Rehab-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Rehab-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Rehab-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Rehab-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Rehab-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Rehab-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `rehab_001` doctor can access a patient only if:
1. The patient is in `Rehab-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Rehab-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`rehab_001:read`);
requirePermission(`rehab_001:write`);
requirePermission(`rehab_001:sign`);
requirePermission(`rehab_001:delete`);
```

## Roles that can access Rehab-001

- `rehab_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Rehab-001

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
