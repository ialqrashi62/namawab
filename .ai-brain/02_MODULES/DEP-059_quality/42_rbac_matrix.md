# RBAC Permission Matrix — Quality (DEP-059)
**Last updated:** 2026-08-10

## Permission matrix for Quality

| Action | Doctor (Quality) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Quality record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Quality record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Quality record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Quality record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Quality record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Quality record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Quality data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_059` doctor can access a patient only if:
1. The patient is in `Quality` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Quality`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_059:read`);
requirePermission(`dep_059:write`);
requirePermission(`dep_059:sign`);
requirePermission(`dep_059:delete`);
```

## Roles that can access Quality

- `dep_059_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Quality

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
