# RBAC Permission Matrix — Psych-001 (PSYCH-001)
**Last updated:** 2026-08-10

## Permission matrix for Psych-001

| Action | Doctor (Psych-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Psych-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Psych-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Psych-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Psych-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Psych-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Psych-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Psych-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `psych_001` doctor can access a patient only if:
1. The patient is in `Psych-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Psych-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`psych_001:read`);
requirePermission(`psych_001:write`);
requirePermission(`psych_001:sign`);
requirePermission(`psych_001:delete`);
```

## Roles that can access Psych-001

- `psych_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Psych-001

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
