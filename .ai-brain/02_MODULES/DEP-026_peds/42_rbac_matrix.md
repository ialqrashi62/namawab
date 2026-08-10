# RBAC Permission Matrix — Peds (DEP-026)
**Last updated:** 2026-08-10

## Permission matrix for Peds

| Action | Doctor (Peds) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Peds record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Peds record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Peds record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Peds record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Peds record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Peds record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Peds data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_026` doctor can access a patient only if:
1. The patient is in `Peds` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Peds`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_026:read`);
requirePermission(`dep_026:write`);
requirePermission(`dep_026:sign`);
requirePermission(`dep_026:delete`);
```

## Roles that can access Peds

- `dep_026_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Peds

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
