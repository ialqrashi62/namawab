# Functional Diagnostics Test Plan
Target: `api.nama.local/api/v1/functional_diagnostics/*`

## 1. Order Creation
- **Action**: Create a new `functional_diagnostics` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `functional_diagnostics` module.
- **Expected**: HTTP 200 OK.
