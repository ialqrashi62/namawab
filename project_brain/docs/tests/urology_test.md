# Urology Test Plan
Target: `api.nama.local/api/v1/urology/*`

## 1. Order Creation
- **Action**: Create a new `urology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `urology` module.
- **Expected**: HTTP 200 OK.
