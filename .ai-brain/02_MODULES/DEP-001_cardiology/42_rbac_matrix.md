# RBAC Permission Matrix — Cardiology (DEP-001)
**Last updated:** 2026-08-10

## Permission matrix for Cardiology

| Action | Doctor (Cardiology) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Cardiology record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Cardiology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Cardiology record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Cardiology record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Cardiology record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Cardiology record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Cardiology data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_001` doctor can access a patient only if:
1. The patient is in `Cardiology` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Cardiology`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_001:read`);
requirePermission(`dep_001:write`);
requirePermission(`dep_001:sign`);
requirePermission(`dep_001:delete`);
```

## Roles that can access Cardiology

- `dep_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Cardiology

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
