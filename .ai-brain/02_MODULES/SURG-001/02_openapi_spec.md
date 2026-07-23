# SURG-001 — OpenAPI 3.1

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Surgery API
  version: 1.0.0
servers:
  - url: https://api.jumanasoft.com/v1
security:
  - bearerAuth: []

paths:
  /surg/procedures:
    get:
      summary: List procedures
    post:
      summary: Schedule a procedure

  /surg/procedures/{id}:
    get:
      summary: Get procedure detail
    put:
      summary: Update procedure

  /surg/procedures/{id}/preop-check:
    put:
      summary: Pre-op checklist (NPO, site mark, antibiotic, etc.)

  /surg/procedures/{id}/intraop:
    post:
      summary: Intra-op record (anesthesia, EBL, time-out, complications)

  /surg/procedures/{id}/postop:
    post:
      summary: Post-op note (disposition, plan, follow-up)

  /surg/procedures/{id}/complications:
    get:
      summary: List complications
    post:
      summary: Add complication (Clavien-Dindo)

  /surg/or-schedule:
    get:
      summary: OR schedule (day/week)

components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
```
