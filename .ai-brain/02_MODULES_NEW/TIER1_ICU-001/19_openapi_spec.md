# ICU-001 — OpenAPI Spec (machine-readable YAML produced for runtime)

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Intensive Care Unit API
  version: 1.0.0
servers:
  - url: https://jumanasoft.com/api/v4/icu_001
security:
  - BearerAuth: []

paths:
  /visits:
    post:
      operationId: createVisit
      tags: [visits]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateVisitRequest' }
      responses:
        '201': { description: Created }
        '400': { description: Bad Request }
        '403': { description: Forbidden }
        '429': { description: Rate Limited }
  /visits/{visitId}/assessment:
    post:
      operationId: runAssessment
      tags: [assessments]
      parameters:
        - in: path
          name: visitId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/AssessmentInput' }
      responses:
        '200':
          description: AI assessment
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AssessmentOutput' }
  /visits/{visitId}/orders:
    post:
      operationId: placeOrders
      tags: [orders]
      parameters:
        - in: path
          name: visitId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PlaceOrdersRequest' }
      responses:
        '201': { description: Created }
  /tasks/mine:
    get:
      operationId: myTasks
      tags: [tasks]
      responses:
        '200': { description: List }
  /patients/{patientId}/results:
    get:
      operationId: listResults
      tags: [results]
      parameters:
        - in: path
          name: patientId
          required: true
          schema: { type: string }
      responses:
        '200': { description: List }

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Visit: { type: object }
    CreateVisitRequest: { type: object }
    AssessmentInput: { type: object }
    AssessmentOutput: { type: object }
    PlaceOrdersRequest: { type: object }
    Order: { type: object }
    Task: { type: object }
    Result: { type: object }
```

---

*Owner: SA — 2026-08-01 — AUTOPILOT*
