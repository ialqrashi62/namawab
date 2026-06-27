# Integrative Medicine Test Plan
Target: `api.nama.local/api/v1/integrative_medicine/*`

## 1. Order Creation
- **Action**: Create a new `integrative_medicine` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `integrative_medicine` module.
- **Expected**: HTTP 200 OK.
