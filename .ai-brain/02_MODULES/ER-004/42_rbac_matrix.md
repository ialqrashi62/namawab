# RBAC Permission Matrix — Er-004 (ER-004)
**Last updated:** 2026-08-10

## Permission matrix for Er-004

| Action | Doctor (Er-004) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Er-004 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Er-004 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Er-004 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Er-004 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Er-004 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Er-004 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Er-004 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `er_004` doctor can access a patient only if:
1. The patient is in `Er-004` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Er-004`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`er_004:read`);
requirePermission(`er_004:write`);
requirePermission(`er_004:sign`);
requirePermission(`er_004:delete`);
```

## Roles that can access Er-004

- `er_004_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Er-004

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
