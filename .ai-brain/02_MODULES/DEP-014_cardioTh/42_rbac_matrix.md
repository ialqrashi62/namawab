# RBAC Permission Matrix — Cardioth (DEP-014)
**Last updated:** 2026-08-10

## Permission matrix for Cardioth

| Action | Doctor (Cardioth) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Cardioth record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Cardioth record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Cardioth record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Cardioth record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Cardioth record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Cardioth record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Cardioth data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_014` doctor can access a patient only if:
1. The patient is in `Cardioth` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Cardioth`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_014:read`);
requirePermission(`dep_014:write`);
requirePermission(`dep_014:sign`);
requirePermission(`dep_014:delete`);
```

## Roles that can access Cardioth

- `dep_014_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Cardioth

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
