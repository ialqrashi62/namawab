# Intensive Care Test Plan
Target: `api.nama.local/api/v1/intensive_care/*`

## 1. Order Creation
- **Action**: Create a new `intensive_care` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `intensive_care` module.
- **Expected**: HTTP 200 OK.
