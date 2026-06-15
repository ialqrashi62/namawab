# Dermatology Test Plan
Target: `api.nama.local/api/v1/dermatology/*`

## 1. Order Creation
- **Action**: Create a new `dermatology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `dermatology` module.
- **Expected**: HTTP 200 OK.
