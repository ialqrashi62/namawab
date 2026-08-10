# RBAC Permission Matrix — Er-001 (ER-001)
**Last updated:** 2026-08-10

## Permission matrix for Er-001

| Action | Doctor (Er-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Er-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Er-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Er-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Er-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Er-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Er-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Er-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `er_001` doctor can access a patient only if:
1. The patient is in `Er-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Er-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`er_001:read`);
requirePermission(`er_001:write`);
requirePermission(`er_001:sign`);
requirePermission(`er_001:delete`);
```

## Roles that can access Er-001

- `er_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Er-001

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
