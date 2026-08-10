# RBAC Permission Matrix — Billing (DEP-057)
**Last updated:** 2026-08-10

## Permission matrix for Billing

| Action | Doctor (Billing) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Billing record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Billing record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Billing record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Billing record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Billing record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Billing record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Billing data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_057` doctor can access a patient only if:
1. The patient is in `Billing` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Billing`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_057:read`);
requirePermission(`dep_057:write`);
requirePermission(`dep_057:sign`);
requirePermission(`dep_057:delete`);
```

## Roles that can access Billing

- `dep_057_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Billing

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
