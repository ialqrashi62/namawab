# Hematology & Oncology Test Plan
Target: `api.nama.local/api/v1/hemato_oncology/*`

## 1. Order Creation
- **Action**: Create a new `hemato_oncology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `hemato_oncology` module.
- **Expected**: HTTP 200 OK.
