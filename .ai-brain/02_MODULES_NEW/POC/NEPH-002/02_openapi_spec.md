<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — OpenAPI 3.1 (26 endpoints)

## Base
URL: https://api.jumanasoft.com/api/v1/transplant
Auth: Bearer JWT

## Endpoints (26)

### Waitlist
- POST /waitlist (idempotent)
- GET /waitlist
- GET /waitlist/:id
- PATCH /waitlist/:id

### Evaluation
- POST /evaluation
- GET /evaluation/:id

### HLA Typing
- POST /hla-typing
- GET /hla-typing?subject_id=X&subject_type=RECIPIENT

### Crossmatch
- POST /crossmatch
- GET /crossmatch?donor_id=X&recipient_id=Y

### Procedure
- POST /procedure (idempotent, triggers SCOT report)
- GET /procedure/:id
- GET /patient/:id/graft-history

### Immunosuppression
- POST /immunosuppression (idempotent, high-alert)
- GET /immunosuppression/:patient_id
- PATCH /immunosuppression/:id (dose adjustment)

### Rejection
- POST /rejection
- GET /rejection?patient_id=X

### Biopsy
- POST /biopsy
- GET /biopsy/:id
- GET /biopsy?transplant_id=X&biopsy_type=PROTOCOL_12M

### Surveillance
- POST /surveillance/visit
- GET /surveillance/:patient_id?from=X&to=Y
- GET /surveillance/:patient_id/alerts

### Infection
- POST /infection
- GET /infection?patient_id=X

### Follow-up
- POST /followup
- GET /followup/:patient_id

### Paired Exchange
- GET /pair-exchange/matches
- POST /pair-exchange/register
- POST /pair-exchange/accept

All: requireAuth + requireTenantScope + requireRole + validateBody (per outes_api.md).

---
*Section 14 of NEPH-002. L1 DRAFT.*