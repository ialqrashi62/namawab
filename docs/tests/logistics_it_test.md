# Logistics & IT Test Plan
Target: `api.nama.local/api/v1/logistics_it/*`

## 1. Order Creation
- **Action**: Create a new `logistics_it` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `logistics_it` module.
- **Expected**: HTTP 200 OK.
