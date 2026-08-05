# OBG-104 — OpenAPI Spec

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Gynecologic Oncology API
  version: 1.0.0
servers:
  - url: https://jumanasoft.com/api/v4/obg_104
security:
  - BearerAuth: []
paths:
  /engagements:
    post:
      operationId: createEngagement
      tags: [engagements]
      requestBody:
        required: true
        content:
          application/json:
            schema: { type: object }
      responses:
        '201': { description: Created }
        '400': { description: BadRequest }
        '403': { description: Forbidden }
        '429': { description: RateLimited }
  /tasks/mine:
    get:
      operationId: myTasks
      tags: [tasks]
      responses:
        '200': { description: list }
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

*Owner: SA — 2026-08-01*
