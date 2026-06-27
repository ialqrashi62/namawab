# Security & Safety Test Plan
Target: `api.nama.local/api/v1/security_safety/*`

## 1. Order Creation
- **Action**: Create a new `security_safety` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `security_safety` module.
- **Expected**: HTTP 200 OK.
