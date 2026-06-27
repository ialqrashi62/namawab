# ENT Test Plan
Target: `api.nama.local/api/v1/ent/*`

## 1. Order Creation
- **Action**: Create a new `ent` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `ent` module.
- **Expected**: HTTP 200 OK.
