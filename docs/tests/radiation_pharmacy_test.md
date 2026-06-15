# Radiation & Pharmacy Test Plan
Target: `api.nama.local/api/v1/radiation_pharmacy/*`

## 1. Order Creation
- **Action**: Create a new `radiation_pharmacy` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `radiation_pharmacy` module.
- **Expected**: HTTP 200 OK.
