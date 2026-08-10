# RBAC Permission Matrix — Trmed-001 (TRMED-001)
**Last updated:** 2026-08-10

## Permission matrix for Trmed-001

| Action | Doctor (Trmed-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Trmed-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Trmed-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Trmed-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Trmed-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Trmed-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Trmed-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Trmed-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `trmed_001` doctor can access a patient only if:
1. The patient is in `Trmed-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Trmed-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`trmed_001:read`);
requirePermission(`trmed_001:write`);
requirePermission(`trmed_001:sign`);
requirePermission(`trmed_001:delete`);
```

## Roles that can access Trmed-001

- `trmed_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Trmed-001

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
