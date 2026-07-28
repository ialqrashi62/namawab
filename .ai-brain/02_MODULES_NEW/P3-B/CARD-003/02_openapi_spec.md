<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-003 OpenAPI 3.1 (16 endpoints)

Base: /api/v1/ep
- POST /procedures
- POST /study-findings
- POST /device-registry (idempotent)
- POST /leads
- POST /remote-monitoring
- GET /followup
- POST /red-flag/acknowledge
- POST /consent/sign (idempotent)
- ... + 8 more

All: authenticate + requireTenantScope + requireRole('electrophysiology') + validateBody + idempotencyGuard (where applicable).

---
*Section 14. L1 DRAFT.*