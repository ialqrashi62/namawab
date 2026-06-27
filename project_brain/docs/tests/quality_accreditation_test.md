# Quality & Accreditation Test Plan
Target: `api.nama.local/api/v1/quality_accreditation/*`

## 1. Order Creation
- **Action**: Create a new `quality_accreditation` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `quality_accreditation` module.
- **Expected**: HTTP 200 OK.
