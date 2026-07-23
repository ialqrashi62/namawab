# PULM-001 — OpenAPI

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Pulmonology API
  version: 1.0.0
security:
  - bearerAuth: []
paths:
  /pulm/encounters:
    get:
      summary: List encounters
    post:
      summary: Create encounter
  /pulm/encounters/{id}/pft:
    get:
      summary: List PFTs
    post:
      summary: Add PFT
  /pulm/encounters/{id}/imaging:
    get:
      summary: List imaging
    post:
      summary: Add imaging
  /pulm/encounters/{id}/medications:
    get:
      summary: List meds
    post:
      summary: Order med
  /pulm/encounters/{id}/oxygen:
    get:
      summary: List O2 orders
    post:
      summary: Add O2 order
  /pulm/encounters/{id}/procedures:
    get:
      summary: List procedures
    post:
      summary: Add procedure
  /pulm/risk/wells:
    post:
      summary: Wells score for PE
  /pulm/risk/copd:
    post:
      summary: COPD severity (GOLD)
  /pulm/risk/pft:
    post:
      summary: PFT pattern
  /pulm/risk/light:
    post:
      summary: Light criteria (pleural)
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
```
