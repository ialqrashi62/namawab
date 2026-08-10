# RBAC Permission Matrix — Er-002 (ER-002)
**Last updated:** 2026-08-10

## Permission matrix for Er-002

| Action | Doctor (Er-002) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Er-002 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Er-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Er-002 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Er-002 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Er-002 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Er-002 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Er-002 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `er_002` doctor can access a patient only if:
1. The patient is in `Er-002` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Er-002`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`er_002:read`);
requirePermission(`er_002:write`);
requirePermission(`er_002:sign`);
requirePermission(`er_002:delete`);
```

## Roles that can access Er-002

- `er_002_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Er-002

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
