# RBAC Permission Matrix — Soc-001 (SOC-001)
**Last updated:** 2026-08-10

## Permission matrix for Soc-001

| Action | Doctor (Soc-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Soc-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Soc-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Soc-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Soc-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Soc-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Soc-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Soc-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `soc_001` doctor can access a patient only if:
1. The patient is in `Soc-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Soc-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`soc_001:read`);
requirePermission(`soc_001:write`);
requirePermission(`soc_001:sign`);
requirePermission(`soc_001:delete`);
```

## Roles that can access Soc-001

- `soc_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Soc-001

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
