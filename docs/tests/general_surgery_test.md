# General Surgery Test Plan
Target: `api.nama.local/api/v1/general_surgery/*`

## 1. Order Creation
- **Action**: Create a new `general_surgery` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `general_surgery` module.
- **Expected**: HTTP 200 OK.
