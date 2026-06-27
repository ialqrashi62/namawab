# Radiology & Imaging Test Plan
Target: `api.nama.local/api/v1/radiology_imaging/*`

## 1. Order Creation
- **Action**: Create a new `radiology_imaging` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `radiology_imaging` module.
- **Expected**: HTTP 200 OK.
