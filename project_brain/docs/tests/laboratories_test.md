# Laboratories Test Plan
Target: `api.nama.local/api/v1/laboratories/*`

## 1. Order Creation
- **Action**: Create a new `laboratories` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `laboratories` module.
- **Expected**: HTTP 200 OK.
