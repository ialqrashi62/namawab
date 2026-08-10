# RBAC Permission Matrix — Sleep-001 (SLEEP-001)
**Last updated:** 2026-08-10

## Permission matrix for Sleep-001

| Action | Doctor (Sleep-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Sleep-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Sleep-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Sleep-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Sleep-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Sleep-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Sleep-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Sleep-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `sleep_001` doctor can access a patient only if:
1. The patient is in `Sleep-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Sleep-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`sleep_001:read`);
requirePermission(`sleep_001:write`);
requirePermission(`sleep_001:sign`);
requirePermission(`sleep_001:delete`);
```

## Roles that can access Sleep-001

- `sleep_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Sleep-001

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
