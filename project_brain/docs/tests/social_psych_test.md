# Social & Psychology Test Plan
Target: `api.nama.local/api/v1/social_psych/*`

## 1. Order Creation
- **Action**: Create a new `social_psych` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `social_psych` module.
- **Expected**: HTTP 200 OK.
