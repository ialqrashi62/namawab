# Nephrology Test Plan
Target: `api.nama.local/api/v1/nephrology/*`

## 1. Order Creation
- **Action**: Create a new `nephrology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `nephrology` module.
- **Expected**: HTTP 200 OK.
