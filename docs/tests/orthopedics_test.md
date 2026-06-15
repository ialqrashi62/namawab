# Orthopedics Test Plan
Target: `api.nama.local/api/v1/orthopedics/*`

## 1. Order Creation
- **Action**: Create a new `orthopedics` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `orthopedics` module.
- **Expected**: HTTP 200 OK.
