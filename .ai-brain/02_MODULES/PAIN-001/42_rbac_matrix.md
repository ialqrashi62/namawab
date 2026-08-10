# RBAC Permission Matrix — Pain-001 (PAIN-001)
**Last updated:** 2026-08-10

## Permission matrix for Pain-001

| Action | Doctor (Pain-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pain-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pain-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pain-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pain-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pain-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pain-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pain-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `pain_001` doctor can access a patient only if:
1. The patient is in `Pain-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pain-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`pain_001:read`);
requirePermission(`pain_001:write`);
requirePermission(`pain_001:sign`);
requirePermission(`pain_001:delete`);
```

## Roles that can access Pain-001

- `pain_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pain-001

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
