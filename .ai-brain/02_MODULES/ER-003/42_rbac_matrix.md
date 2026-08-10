# RBAC Permission Matrix — Er-003 (ER-003)
**Last updated:** 2026-08-10

## Permission matrix for Er-003

| Action | Doctor (Er-003) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Er-003 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Er-003 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Er-003 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Er-003 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Er-003 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Er-003 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Er-003 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `er_003` doctor can access a patient only if:
1. The patient is in `Er-003` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Er-003`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`er_003:read`);
requirePermission(`er_003:write`);
requirePermission(`er_003:sign`);
requirePermission(`er_003:delete`);
```

## Roles that can access Er-003

- `er_003_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Er-003

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
