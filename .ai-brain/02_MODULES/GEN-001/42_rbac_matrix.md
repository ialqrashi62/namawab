# RBAC Permission Matrix — Gen-001 (GEN-001)
**Last updated:** 2026-08-10

## Permission matrix for Gen-001

| Action | Doctor (Gen-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Gen-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Gen-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Gen-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Gen-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Gen-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Gen-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Gen-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `gen_001` doctor can access a patient only if:
1. The patient is in `Gen-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Gen-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`gen_001:read`);
requirePermission(`gen_001:write`);
requirePermission(`gen_001:sign`);
requirePermission(`gen_001:delete`);
```

## Roles that can access Gen-001

- `gen_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Gen-001

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
