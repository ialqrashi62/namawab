# RBAC Permission Matrix — Lab-001 (LAB-001)
**Last updated:** 2026-08-10

## Permission matrix for Lab-001

| Action | Doctor (Lab-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Lab-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Lab-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Lab-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Lab-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Lab-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Lab-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Lab-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `lab_001` doctor can access a patient only if:
1. The patient is in `Lab-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Lab-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`lab_001:read`);
requirePermission(`lab_001:write`);
requirePermission(`lab_001:sign`);
requirePermission(`lab_001:delete`);
```

## Roles that can access Lab-001

- `lab_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Lab-001

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
