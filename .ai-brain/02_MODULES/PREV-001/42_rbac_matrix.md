# RBAC Permission Matrix — Prev-001 (PREV-001)
**Last updated:** 2026-08-10

## Permission matrix for Prev-001

| Action | Doctor (Prev-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Prev-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Prev-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Prev-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Prev-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Prev-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Prev-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Prev-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `prev_001` doctor can access a patient only if:
1. The patient is in `Prev-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Prev-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`prev_001:read`);
requirePermission(`prev_001:write`);
requirePermission(`prev_001:sign`);
requirePermission(`prev_001:delete`);
```

## Roles that can access Prev-001

- `prev_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Prev-001

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
