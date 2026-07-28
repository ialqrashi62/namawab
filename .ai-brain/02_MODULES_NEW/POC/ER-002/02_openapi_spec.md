<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — OpenAPI 3.1 (22 endpoints)

## Base
URL: https://api.jumanasoft.com/api/trauma

## Endpoints
- GET /activations?status=active&tier=1
- POST /activations
- GET /activations/:id
- POST /primary-survey (fail-closed on partial)
- POST /secondary-survey
- POST /ais-coding (MD-cosign if AIS>3)
- GET /iss-score/:encounterId
- GET /triss/:encounterId
- POST /mtp/activate (idempotent, 2-RN verify)
- POST /mtp/:id/terminate
- POST /transfusion/log
- GET /blood-bank/status/:encounterId
- POST /operative-log
- POST /transfer-out (idempotent, capability_gap required)
- POST /transfer-in
- GET /registry/export?year=2026&format=ntdb
- POST /pi/case
- POST /pi/case/:id/close-loop
- GET /performance/dashboard
- GET /registry/stats
- POST /tbi/severity
- POST /hemorrhage/pathway

All: authenticate + requireTenantScope + requireRole('trauma_surgery'|'emergency_medicine') + validateBody + idempotencyGuard (where appropriate).

---
*Section 14 of ER-002. L1 DRAFT.*