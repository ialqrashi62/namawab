# RBAC Permission Matrix — Surg-007 (SURG-007)
**Last updated:** 2026-08-10

## Permission matrix for Surg-007

| Action | Doctor (Surg-007) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Surg-007 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Surg-007 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Surg-007 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Surg-007 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Surg-007 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Surg-007 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Surg-007 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `surg_007` doctor can access a patient only if:
1. The patient is in `Surg-007` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Surg-007`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`surg_007:read`);
requirePermission(`surg_007:write`);
requirePermission(`surg_007:sign`);
requirePermission(`surg_007:delete`);
```

## Roles that can access Surg-007

- `surg_007_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Surg-007

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
