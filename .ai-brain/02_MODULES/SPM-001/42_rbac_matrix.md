# RBAC Permission Matrix — Spm-001 (SPM-001)
**Last updated:** 2026-08-10

## Permission matrix for Spm-001

| Action | Doctor (Spm-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Spm-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Spm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Spm-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Spm-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Spm-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Spm-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Spm-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `spm_001` doctor can access a patient only if:
1. The patient is in `Spm-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Spm-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`spm_001:read`);
requirePermission(`spm_001:write`);
requirePermission(`spm_001:sign`);
requirePermission(`spm_001:delete`);
```

## Roles that can access Spm-001

- `spm_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Spm-001

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
