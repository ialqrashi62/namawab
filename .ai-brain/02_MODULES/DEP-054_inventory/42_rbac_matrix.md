# RBAC Permission Matrix — Inventory (DEP-054)
**Last updated:** 2026-08-10

## Permission matrix for Inventory

| Action | Doctor (Inventory) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read Inventory record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create Inventory record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update Inventory record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete Inventory record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign Inventory record | ✅ | � | ❌ | ❌ | ❌ |
| Lock Inventory record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export Inventory data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `dep_054` doctor can access a patient only if:
1. The patient is in `Inventory` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `Inventory`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`dep_054:read`);
requirePermission(`dep_054:write`);
requirePermission(`dep_054:sign`);
requirePermission(`dep_054:delete`);
```

## Roles that can access Inventory

- `dep_054_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access Inventory

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
