# RBAC Permission Matrix — Card-001 (CARD-001)
**Last updated:** 2026-08-10

## Permission matrix for Card-001

| Action | Doctor (Card-001) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Card-001 record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Card-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Card-001 record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Card-001 record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Card-001 record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Card-001 record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Card-001 data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `card_001` doctor can access a patient only if:
1. The patient is in `Card-001` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Card-001`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`card_001:read`);
requirePermission(`card_001:write`);
requirePermission(`card_001:sign`);
requirePermission(`card_001:delete`);
```

## Roles that can access Card-001

- `card_001_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Card-001

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
