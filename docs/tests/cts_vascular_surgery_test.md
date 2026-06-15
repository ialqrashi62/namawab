# CTS & Vascular Surgery Test Plan
Target: `api.nama.local/api/v1/cts_vascular_surgery/*`

## 1. Order Creation
- **Action**: Create a new `cts_vascular_surgery` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `cts_vascular_surgery` module.
- **Expected**: HTTP 200 OK.
