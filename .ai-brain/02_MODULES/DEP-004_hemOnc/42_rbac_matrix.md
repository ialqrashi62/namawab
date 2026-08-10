# RBAC Permission Matrix — Hemonc (DEP-004)
**Last updated:** 2026-08-10

## Permission matrix for Hemonc

| Action | Doctor (Hemonc) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Hemonc record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Hemonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Hemonc record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Hemonc record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Hemonc record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Hemonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Hemonc data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_004` doctor can access a patient only if:
1. The patient is in `Hemonc` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Hemonc`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_004:read`);
requirePermission(`dep_004:write`);
requirePermission(`dep_004:sign`);
requirePermission(`dep_004:delete`);
```

## Roles that can access Hemonc

- `dep_004_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Hemonc

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
