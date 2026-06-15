# OBGYN Test Plan
Target: `api.nama.local/api/v1/obgyn/*`

## 1. Order Creation
- **Action**: Create a new `obgyn` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `obgyn` module.
- **Expected**: HTTP 200 OK.
