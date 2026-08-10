# RBAC Permission Matrix — Vas-001 (VAS-001)
**Last updated:** 2026-08-10

## Permission matrix for Vas-001

| Action | Doctor (Vas-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Vas-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Vas-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Vas-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Vas-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Vas-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Vas-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Vas-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `vas_001` doctor can access a patient only if:
1. The patient is in `Vas-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Vas-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`vas_001:read`);
requirePermission(`vas_001:write`);
requirePermission(`vas_001:sign`);
requirePermission(`vas_001:delete`);
```

## Roles that can access Vas-001

- `vas_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Vas-001

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
