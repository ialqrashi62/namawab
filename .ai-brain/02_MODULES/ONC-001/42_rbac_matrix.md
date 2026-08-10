# RBAC Permission Matrix — Onc-001 (ONC-001)
**Last updated:** 2026-08-10

## Permission matrix for Onc-001

| Action | Doctor (Onc-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Onc-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Onc-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Onc-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Onc-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Onc-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Onc-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Onc-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `onc_001` doctor can access a patient only if:
1. The patient is in `Onc-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Onc-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`onc_001:read`);
requirePermission(`onc_001:write`);
requirePermission(`onc_001:sign`);
requirePermission(`onc_001:delete`);
```

## Roles that can access Onc-001

- `onc_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Onc-001

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
