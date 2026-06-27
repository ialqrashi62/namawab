# Gastro & Hepato Test Plan
Target: `api.nama.local/api/v1/gastro/*`

## 1. Endoscopy Order Creation
- **Action**: Create an order for `upper_endoscopy` via `/orders`.
- **Expected**: HTTP 201 Created. UUID returned.

## 2. Report Submission
- **Action**: Submit an endoscopy report via `/procedures/endoscopy` for the previous order UUID.
- **Expected**: HTTP 201 Created. Associated to order.

## 3. RBAC Validation
- **Action**: Try creating an order without `order.write` scope.
- **Expected**: HTTP 403 Forbidden.

## 4. AI Assistant Context
- **Action**: Ask the gastro AI about the endoscopy findings.
- **Expected**: HTTP 200 OK. Contains contextual answer based on findings.
