# Pediatric Subspecialties Test Plan
Target: `api.nama.local/api/v1/pediatric_subspec/*`

## 1. Order Creation
- **Action**: Create a new `pediatric_subspec` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `pediatric_subspec` module.
- **Expected**: HTTP 200 OK.
