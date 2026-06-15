# Neurosurgery & Spine Test Plan
Target: `api.nama.local/api/v1/neurosurgery_spine/*`

## 1. Order Creation
- **Action**: Create a new `neurosurgery_spine` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `neurosurgery_spine` module.
- **Expected**: HTTP 200 OK.
