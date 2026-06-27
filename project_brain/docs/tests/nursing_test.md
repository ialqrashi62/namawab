# Nursing Test Plan
Target: `api.nama.local/api/v1/nursing/*`

## 1. Order Creation
- **Action**: Create a new `nursing` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `nursing` module.
- **Expected**: HTTP 200 OK.
