# RBAC Permission Matrix — Psychol (DEP-045)
**Last updated:** 2026-08-10

## Permission matrix for Psychol

| Action | Doctor (Psychol) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Psychol record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Psychol record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Psychol record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Psychol record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Psychol record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Psychol record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Psychol data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_045` doctor can access a patient only if:
1. The patient is in `Psychol` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Psychol`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_045:read`);
requirePermission(`dep_045:write`);
requirePermission(`dep_045:sign`);
requirePermission(`dep_045:delete`);
```

## Roles that can access Psychol

- `dep_045_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Psychol

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
