# Plastic Surgery & Burns Test Plan
Target: `api.nama.local/api/v1/plastic_burns/*`

## 1. Order Creation
- **Action**: Create a new `plastic_burns` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `plastic_burns` module.
- **Expected**: HTTP 200 OK.
