# RBAC Permission Matrix — Pedsdev (DEP-033)
**Last updated:** 2026-08-10

## Permission matrix for Pedsdev

| Action | Doctor (Pedsdev) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pedsdev record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pedsdev record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pedsdev record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pedsdev record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pedsdev record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pedsdev record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pedsdev data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_033` doctor can access a patient only if:
1. The patient is in `Pedsdev` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pedsdev`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_033:read`);
requirePermission(`dep_033:write`);
requirePermission(`dep_033:sign`);
requirePermission(`dep_033:delete`);
```

## Roles that can access Pedsdev

- `dep_033_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pedsdev

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
