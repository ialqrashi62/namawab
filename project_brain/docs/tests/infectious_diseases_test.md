# Infectious Diseases Test Plan
Target: `api.nama.local/api/v1/infectious_diseases/*`

## 1. Order Creation
- **Action**: Create a new `infectious_diseases` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `infectious_diseases` module.
- **Expected**: HTTP 200 OK.
