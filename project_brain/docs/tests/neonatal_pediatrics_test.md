# Neonatal & Pediatrics Test Plan
Target: `api.nama.local/api/v1/neonatal_pediatrics/*`

## 1. Order Creation
- **Action**: Create a new `neonatal_pediatrics` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `neonatal_pediatrics` module.
- **Expected**: HTTP 200 OK.
