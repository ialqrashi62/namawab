# Rehabilitation & PT Test Plan
Target: `api.nama.local/api/v1/rehab_pt/*`

## 1. Order Creation
- **Action**: Create a new `rehab_pt` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `rehab_pt` module.
- **Expected**: HTTP 200 OK.
