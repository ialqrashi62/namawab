# Nutrition Test Plan
Target: `api.nama.local/api/v1/nutrition/*`

## 1. Order Creation
- **Action**: Create a new `nutrition` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `nutrition` module.
- **Expected**: HTTP 200 OK.
