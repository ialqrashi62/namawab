# RBAC Permission Matrix — Pedshemonc (DEP-031)
**Last updated:** 2026-08-10

## Permission matrix for Pedshemonc

| Action | Doctor (Pedshemonc) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pedshemonc record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pedshemonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pedshemonc record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pedshemonc record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pedshemonc record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pedshemonc record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pedshemonc data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_031` doctor can access a patient only if:
1. The patient is in `Pedshemonc` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pedshemonc`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_031:read`);
requirePermission(`dep_031:write`);
requirePermission(`dep_031:sign`);
requirePermission(`dep_031:delete`);
```

## Roles that can access Pedshemonc

- `dep_031_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pedshemonc

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
