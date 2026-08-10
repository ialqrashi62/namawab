# RBAC Permission Matrix — Gyn (DEP-035)
**Last updated:** 2026-08-10

## Permission matrix for Gyn

| Action | Doctor (Gyn) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Gyn record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Gyn record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Gyn record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Gyn record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Gyn record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Gyn record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Gyn data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_035` doctor can access a patient only if:
1. The patient is in `Gyn` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Gyn`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_035:read`);
requirePermission(`dep_035:write`);
requirePermission(`dep_035:sign`);
requirePermission(`dep_035:delete`);
```

## Roles that can access Gyn

- `dep_035_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Gyn

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
