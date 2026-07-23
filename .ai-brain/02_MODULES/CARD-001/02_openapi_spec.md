# CARD-001 — OpenAPI 3.1

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Cardiology API
  version: 1.0.0
servers:
  - url: https://api.jumanasoft.com/v1
security:
  - bearerAuth: []

paths:
  /card/encounters:
    get:
      summary: List cardiology encounters
    post:
      summary: Create encounter

  /card/encounters/{id}/ecgs:
    get:
      summary: List ECGs
    post:
      summary: Add ECG

  /card/encounters/{id}/troponins:
    get:
      summary: List troponin values
    post:
      summary: Add troponin

  /card/encounters/{id}/echo:
    get:
      summary: Get echo
    post:
      summary: Add echo

  /card/encounters/{id}/procedures:
    get:
      summary: List procedures (PCI, etc.)
    post:
      summary: Add procedure

  /card/encounters/{id}/medications:
    get:
      summary: List cardiac meds
    post:
      summary: Order med

  /card/patients/{patientId}/devices:
    get:
      summary: List cardiac devices (pacemaker, ICD)
    post:
      summary: Add device

  /card/risk/timi:
    post:
      summary: Calculate TIMI score

  /card/risk/grace:
    post:
      summary: Calculate GRACE score

  /card/risk/heart:
    post:
      summary: Calculate HEART score

  /card/risk/cha2ds2vasc:
    post:
      summary: Calculate CHA2DS2-VASc

  /card/risk/hasbled:
    post:
      summary: Calculate HAS-BLED

components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
```
