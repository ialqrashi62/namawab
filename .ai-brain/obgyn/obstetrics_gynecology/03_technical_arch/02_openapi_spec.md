# OpenAPI 3.1 (excerpt) — OBGYN

```yaml
openapi: 3.1.0
info: { title: OBGYN API, version: 1.0.0 }
servers: [{ url: /api/v1/obgyn }]
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
paths:
  /pregnancies:
    get:
      security: [{ bearerAuth: [] }]
      parameters:
        - { name: page, in: query, schema: { integer, default: 1 } }
        - { name: limit, in: query, schema: { integer, default: 20, maximum: 100 } }
      responses: { '200': { description: Paginated pregnancies } }
    post: { responses: { '201': { description: Created } } }
  /pregnancies/{id}:
    get: { responses: { '200': { description: Detail } } }
  /anc-visits:
    post: { responses: { '201': { description: Visit recorded } } }
  /ivf/cycles:
    get:
      parameters:
        - { name: page, in: query, schema: { integer } }
        - { name: status, in: query, schema: { string } }
      responses: { '200': { description: Paginated cycles } }
  /ivf/cycles/{id}/embryos:
    post: { responses: { '201': { description: Embryo recorded (dual e-sign) } } }
  /cryo/units:
    get: { responses: { '200': { description: Tank map + temps } } }
  /engine/edd:
    post: { requestBody: { content: { application/json: {} } },
            responses: { '200': { description: EDD result } } }
```

Auth: Bearer JWT · every request carries `X-Tenant-Id`; RBAC roles per route (see routes_api.js).
