# Rare & Advanced Diseases Test Plan
Target: `api.nama.local/api/v1/rare_advanced/*`

## 1. Order Creation
- **Action**: Create a new `rare_advanced` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `rare_advanced` module.
- **Expected**: HTTP 200 OK.
