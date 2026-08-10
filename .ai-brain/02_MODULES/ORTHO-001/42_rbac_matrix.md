# RBAC Permission Matrix — Ortho-001 (ORTHO-001)
**Last updated:** 2026-08-10

## Permission matrix for Ortho-001

| Action | Doctor (Ortho-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Ortho-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Ortho-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Ortho-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Ortho-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Ortho-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Ortho-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Ortho-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `ortho_001` doctor can access a patient only if:
1. The patient is in `Ortho-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Ortho-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`ortho_001:read`);
requirePermission(`ortho_001:write`);
requirePermission(`ortho_001:sign`);
requirePermission(`ortho_001:delete`);
```

## Roles that can access Ortho-001

- `ortho_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Ortho-001

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
