# Ophthalmology Test Plan
Target: `api.nama.local/api/v1/ophthalmology/*`

## 1. Order Creation
- **Action**: Create a new `ophthalmology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `ophthalmology` module.
- **Expected**: HTTP 200 OK.
