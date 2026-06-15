# Anesthesia & Pain Management Test Plan
Target: `api.nama.local/api/v1/anesthesia_pain/*`

## 1. Order Creation
- **Action**: Create a new `anesthesia_pain` order via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Result Verification
- **Action**: Fetch results for `anesthesia_pain` module.
- **Expected**: HTTP 200 OK.
