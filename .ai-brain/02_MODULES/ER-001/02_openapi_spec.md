---
module_id: ER-001
section: 03_technical_arch
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 OpenAPI 3.1 Spec (Compressed)

## API Base
`https://api.namamedical.com/api/v1/er`

## Security
- BearerAuth (JWT)
- OAuth2: `patient/*.read`, `er/*.read`, `er/*.write`, `er/triage`, `er/code/activate`
- Tenant scoped: `X-Tenant-ID` header (validated against session)

## Top 15 Endpoints

| Method | Path | Auth | Purpose | SLA |
|--------|------|------|---------|-----|
| POST | `/triage` | RN/MD | ESI classification + red flag detect | <2s |
| GET | `/triage/queue` | RN | Real-time triage queue | <500ms |
| PUT | `/triage/{encounterId}` | RN | Override ESI with reason | <1s |
| GET | `/encounter/{id}` | any clinical | Full encounter details | <500ms |
| POST | `/encounter/open` | RN | Open new ED encounter | <1s |
| POST | `/encounter/{id}/close` | MD | Close encounter (any disposition) | <1s |
| POST | `/vitals` | RN | Record vital signs | <300ms |
| POST | `/red-flag/acknowledge` | MD | Acknowledge AI red flag | <500ms |
| POST | `/code/activate` | MD/RN | Activate code (blue/stemi/stroke/trauma) | <500ms |
| POST | `/medication/admin` | RN | Medication administration + 5-rights | <1s |
| POST | `/procedure` | MD | Log procedure performed | <1s |
| POST | `/lab/order` | MD | Order lab tests | <500ms |
| POST | `/imaging/order` | MD | Order imaging | <500ms |
| POST | `/consult/request` | MD | Request specialist consult | <500ms |
| POST | `/disposition` | MD | Final disposition (admit/discharge/transfer) | <1s |

## OpenAPI 3.1 (representative)

```yaml
openapi: 3.1.0
info:
  title: ER Service API
  version: 1.0.0
  description: Emergency Department module — NamaMedical ERP
servers:
  - url: https://api.namamedical.com/api/v1/er
security:
  - BearerAuth: []
  - OAuth2: [er/*.read, er/*.write]

paths:
  /triage:
    post:
      operationId: postTriage
      tags: [Triage, AI]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TriageRequest'
      responses:
        '200':
          description: Triage decision with ESI, red flags, workup
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TriageResponse'
        '422':
          $ref: '#/components/responses/ValidationError'
        '500':
          $ref: '#/components/responses/ServerError'
      x-rate-limit: {requests: 200, period: 1m, per: user}
      x-sla: "P99 < 2s"
      x-ai-model: "triage-v2"
      x-clinical-safety: "critical_path"

  /code/activate:
    post:
      operationId: activateCode
      tags: [Code, Emergency]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [encounterId, codeType]
              properties:
                encounterId: {type: string, format: uuid}
                codeType: 
                  type: string
                  enum: [blue, stemi, stroke, trauma, sepsis, mass_casualty]
                activationReason: {type: string, maxLength: 500}
      responses:
        '201':
          description: Code activated, team notified
          content:
            application/json:
              schema:
                type: object
                properties:
                  codeId: {type: string, format: uuid}
                  activatedAt: {type: string, format: date-time}
                  teamNotified: {type: array, items: {type: string}}
                  responseTimeTarget: {type: string}
        '409':
          description: Code already active for this encounter
      x-clinical-safety: "critical_path"
      x-audit: "all_code_activations"

components:
  securitySchemes:
    BearerAuth: {type: http, scheme: bearer, bearerFormat: JWT}
    OAuth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://auth.namamedical.com/oauth/token
          scopes:
            'er/triage': Perform triage
            'er/*.read': Read ED data
            'er/*.write': Write ED data
            'er/code/activate': Activate code
  schemas:
    TriageRequest:
      type: object
      required: [patientId, chiefComplaint, vitals]
      properties:
        patientId: {type: string, format: uuid}
        chiefComplaint: {type: string, minLength: 3, maxLength: 500}
        hpi: {type: string, maxLength: 2000}
        onsetTime: {type: string, format: date-time}
        painScore: {type: integer, minimum: 0, maximum: 10}
        vitals:
          type: object
          required: [bpSystolic, bpDiastolic, heartRate, respiratoryRate, spo2, temperatureC]
          properties:
            bpSystolic: {type: integer, minimum: 40, maximum: 300}
            bpDiastolic: {type: integer, minimum: 20, maximum: 200}
            heartRate: {type: integer, minimum: 20, maximum: 250}
            respiratoryRate: {type: integer, minimum: 4, maximum: 60}
            spo2: {type: integer, minimum: 0, maximum: 100}
            temperatureC: {type: number, format: float}
        pmh: {type: array, items: {type: string}}
        medications: {type: array, items: {type: string}}
        allergies: {type: array, items: {type: string}}
    TriageResponse:
      type: object
      properties:
        esiLevel: {type: integer, minimum: 1, maximum: 5}
        redFlags: {type: array, items: {$ref: '#/components/schemas/RedFlag'}}
        recommendedAction: 
          type: string
          enum: [resus_bay, acute_bed, fast_track, observation, immediate_discharge]
        differentials:
          type: array
          items: {$ref: '#/components/schemas/Differential'}
        workupSuggestions:
          type: array
          items: {$ref: '#/components/schemas/WorkupSuggestion'}
        timeToProviderMinutes: {type: integer}
        warnings: {type: array, items: {type: string}}
        citations: {type: array, items: {type: string}}
        disclaimer: {type: string}
        processingTimeMs: {type: integer}
    RedFlag:
      type: object
      properties:
        category: {type: integer, minimum: 1, maximum: 5}
        flagType: {type: string}
        severity: {type: string}
        detectedBy: {type: string, enum: [ai, monitor, manual]}
        responseAction: {type: string}
        timeTargetSeconds: {type: integer}
    Differential:
      type: object
      properties:
        icd10: {type: string}
        snomed: {type: string}
        condition: {type: string}
        probability: {type: number, minimum: 0, maximum: 1}
        evidenceLevel: {type: string, enum: [A, B, C, D]}
        citations: {type: array, items: {type: string}}
    WorkupSuggestion:
      type: object
      properties:
        testType: {type: string, enum: [lab, imaging, ecg, procedure, consult]}
        test: {type: string}
        loinc: {type: string}
        urgency: {type: string, enum: [stat, urgent, routine]}
        rationale: {type: string}
  responses:
    Unauthorized: {description: Missing or invalid auth}
    ValidationError: {description: Validation failed}
    RateLimit: {description: Rate limit exceeded}
    ServerError: {description: Internal server error}
```

## Rate Limits (per user)
- `/triage`: 200 req/min
- `/encounter/*`: 100 req/min
- `/vitals`: 300 req/min (high frequency)
- `/code/activate`: 50 req/min (critical, but not abuse)
- All others: 100 req/min

## Audit
All endpoints log:
- user_id, tenant_id, encounter_id
- input hash, output hash
- timestamp
- response time
- any errors

Critical paths (triage, code activation, medication admin) also:
- Snapshot before/after state
- Hash-chained to er_audit_log

---
*Section 03.b of ER-001. Owner: SA. L4 validated.*
