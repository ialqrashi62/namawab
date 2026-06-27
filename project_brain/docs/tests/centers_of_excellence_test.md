# Centers of Excellence Test Plan
Target: `api.nama.local/api/v1/centers_of_excellence/*`

## 1. Order Creation
- **Action**: Create a new `centers_of_excellence` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `centers_of_excellence` module.
- **Expected**: HTTP 200 OK.
