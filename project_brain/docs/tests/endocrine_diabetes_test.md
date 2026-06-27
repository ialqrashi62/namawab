# Endocrinology & Diabetes Test Plan
Target: `api.nama.local/api/v1/endocrine_diabetes/*`

## 1. Order Creation
- **Action**: Create a new `endocrine_diabetes` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `endocrine_diabetes` module.
- **Expected**: HTTP 200 OK.
