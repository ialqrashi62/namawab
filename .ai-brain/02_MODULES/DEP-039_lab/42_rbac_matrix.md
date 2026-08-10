# RBAC Permission Matrix — Lab (DEP-039)
**Last updated:** 2026-08-10

## Permission matrix for Lab

| Action | Doctor (Lab) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Lab record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Lab record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Lab record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Lab record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Lab record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Lab record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Lab data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_039` doctor can access a patient only if:
1. The patient is in `Lab` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Lab`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_039:read`);
requirePermission(`dep_039:write`);
requirePermission(`dep_039:sign`);
requirePermission(`dep_039:delete`);
```

## Roles that can access Lab

- `dep_039_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Lab

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
