# Education & Research Test Plan
Target: `api.nama.local/api/v1/education_research/*`

## 1. Order Creation
- **Action**: Create a new `education_research` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `education_research` module.
- **Expected**: HTTP 200 OK.
