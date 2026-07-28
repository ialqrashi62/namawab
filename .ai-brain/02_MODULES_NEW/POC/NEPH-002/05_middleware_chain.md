<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Middleware

Same as CARD-002 + specialty: 'transplant_nephrology', 'transplant_coordinator', 'transplant_surgeon', 'hla_technologist', 'transplant_pharmacist'.

Idempotency: /waitlist, /procedure, /immunosuppression, /biopsy (when billing).

HARD ALERT: 2-pharmacist verify for IS; trough >20 = block.

---
*Section 32 of NEPH-002. L1 DRAFT.*