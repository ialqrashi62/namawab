<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Express Routes


amaweb/routes/transplant.js:
- POST /waitlist (idempotent)
- GET /waitlist
- POST /evaluation
- POST /hla-typing
- POST /crossmatch
- GET /matching
- POST /procedure (idempotent, SCOT report)
- POST /immunosuppression (idempotent, HIGH-ALERT gate, trough >20 block)
- POST /rejection
- POST /biopsy
- POST /surveillance/visit
- POST /infection
- POST /followup
- GET /pair-exchange/matches

All: authenticate + requireTenantScope + requireRole('nephrology'|'transplant_coordinator'|'transplant_surgeon') + validateBody + idempotencyGuard (for billing/SCOT).

---
*Section 31 of NEPH-002. L1 DRAFT.*