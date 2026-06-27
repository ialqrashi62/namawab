# Pulmonology Test Plan
Target: `api.nama.local/api/v1/pulmonology/*`

## 1. Order Creation
- **Action**: Create a new `pulmonology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `pulmonology` module.
- **Expected**: HTTP 200 OK.
