# RBAC Permission Matrix — Rheum-001 (RHEUM-001)
**Last updated:** 2026-08-10

## Permission matrix for Rheum-001

| Action | Doctor (Rheum-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Rheum-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Rheum-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Rheum-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Rheum-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Rheum-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Rheum-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Rheum-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `rheum_001` doctor can access a patient only if:
1. The patient is in `Rheum-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Rheum-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`rheum_001:read`);
requirePermission(`rheum_001:write`);
requirePermission(`rheum_001:sign`);
requirePermission(`rheum_001:delete`);
```

## Roles that can access Rheum-001

- `rheum_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Rheum-001

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
