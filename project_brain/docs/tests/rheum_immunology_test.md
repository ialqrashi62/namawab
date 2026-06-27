# Rheumatology & Immunology Test Plan
Target: `api.nama.local/api/v1/rheum_immunology/*`

## 1. Order Creation
- **Action**: Create a new `rheum_immunology` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `rheum_immunology` module.
- **Expected**: HTTP 200 OK.
