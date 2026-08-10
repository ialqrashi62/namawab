# RBAC Permission Matrix — Cts-001 (CTS-001)
**Last updated:** 2026-08-10

## Permission matrix for Cts-001

| Action | Doctor (Cts-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Cts-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Cts-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Cts-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Cts-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Cts-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Cts-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Cts-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `cts_001` doctor can access a patient only if:
1. The patient is in `Cts-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Cts-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`cts_001:read`);
requirePermission(`cts_001:write`);
requirePermission(`cts_001:sign`);
requirePermission(`cts_001:delete`);
```

## Roles that can access Cts-001

- `cts_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Cts-001

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
