# RBAC Permission Matrix — Dent-001 (DENT-001)
**Last updated:** 2026-08-10

## Permission matrix for Dent-001

| Action | Doctor (Dent-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Dent-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Dent-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Dent-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Dent-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Dent-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Dent-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Dent-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dent_001` doctor can access a patient only if:
1. The patient is in `Dent-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Dent-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dent_001:read`);
requirePermission(`dent_001:write`);
requirePermission(`dent_001:sign`);
requirePermission(`dent_001:delete`);
```

## Roles that can access Dent-001

- `dent_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Dent-001

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
