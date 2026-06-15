# HR & Admin Test Plan
Target: `api.nama.local/api/v1/hr_admin/*`

## 1. Order Creation
- **Action**: Create a new `hr_admin` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `hr_admin` module.
- **Expected**: HTTP 200 OK.
