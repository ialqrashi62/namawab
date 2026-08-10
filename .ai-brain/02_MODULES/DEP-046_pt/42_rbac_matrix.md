# RBAC Permission Matrix — Pt (DEP-046)
**Last updated:** 2026-08-10

## Permission matrix for Pt

| Action | Doctor (Pt) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Pt record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Pt record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Pt record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Pt record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Pt record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Pt record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Pt data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_046` doctor can access a patient only if:
1. The patient is in `Pt` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Pt`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_046:read`);
requirePermission(`dep_046:write`);
requirePermission(`dep_046:sign`);
requirePermission(`dep_046:delete`);
```

## Roles that can access Pt

- `dep_046_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Pt

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
