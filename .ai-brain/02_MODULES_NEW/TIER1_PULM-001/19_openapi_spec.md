# 19 — OpenAPI Spec (PULM-001)

> **Owner:** SA
> **Format:** OpenAPI 3.1

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Pulmonology API
  version: 1.0.0
  description: Pulmonology (PULM-001) endpoints — Tier-1 dept.
servers:
  - url: https://jumanasoft.com/api/v4/pulm
security:
  - BearerAuth: []

paths:
  /visits:
    post:
      operationId: createPulmVisit
      summary: Create new pulmonology visit
      tags: [visits]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateVisitRequest' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Visit' }
        '400': { $ref: '#/components/responses/BadRequest' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '429': { $ref: '#/components/responses/RateLimited' }

  /visits/{visitId}/assessment:
    post:
      operationId: runPulmAssessment
      summary: Run AI-powered initial assessment
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
          description: Assessment generated
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AssessmentOutput' }

  /visits/{visitId}/orders:
    get:
      operationId: listVisitOrders
      tags: [orders]
      parameters: [visitId]
      responses:
        '200':
          description: list
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Order' }
    post:
      operationId: placeOrder
      tags: [orders]
      parameters: [visitId]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PlaceOrderRequest' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Order' }
        '403': { $ref: '#/components/responses/Forbidden' }

  /visits/{visitId}/pathway:
    post:
      operationId: activatePathway
      summary: Activate a care pathway (e.g., PE_MASSIVE)
      tags: [pathways]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [pathway_id, patient_id]
              properties:
                pathway_id: { type: string, description: e.g. PATH:PE_MASSIVE }
                patient_id: { type: string }
      responses:
        '201':
          description: Pathway activated
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PathwayRun' }

  /patients/{patientId}/pfts:
    get:
      operationId: listPFTs
      tags: [pfts]
      parameters: [patientId]
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/PFT' }

  /patients/{patientId}/sleep-studies:
    get:
      operationId: listSleepStudies
      tags: [sleep]
      parameters: [patientId]
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/SleepStudy' }

  /patients/{patientId}/biopsy-reports:
    get:
      operationId: listBiopsyReports
      tags: [biopsy]
      parameters: [patientId]
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/BiopsyReport' }

  /tasks/mine:
    get:
      operationId: myPulmTasks
      tags: [tasks]
      parameters:
        - in: query
          name: status
          schema: { type: string, enum: [open, all] }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Task' }

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Visit:
      type: object
      required: [id, patient_id, tenant_id, status, created_at]
      properties:
        id: { type: string }
        patient_id: { type: string }
        tenant_id: { type: string }
        visit_type: { type: string, enum: [initial, follow_up, urgent, telehealth] }
        chief_complaint: { type: string }
        status: { type: string, enum: [open, in_progress, completed, signed] }
        created_at: { type: string, format: date-time }
    CreateVisitRequest:
      type: object
      required: [patient_id, visit_type, chief_complaint]
      properties:
        patient_id: { type: string }
        visit_type: { type: string }
        chief_complaint: { type: string }
    AssessmentInput:
      type: object
      required: [hpi, exam, vitals]
      properties:
        hpi: { type: string }
        exam: { type: string }
        vitals: { $ref: '#/components/schemas/Vitals' }
    AssessmentOutput:
      type: object
      properties:
        differential:
          type: array
          items: { $ref: '#/components/schemas/DifferentialDx' }
        red_flags:
          type: array
          items: { $ref: '#/components/schemas/RedFlag' }
        drug_alerts:
          type: array
          items: { $ref: '#/components/schemas/DrugAlert' }
        recommended_orders:
          type: array
          items: { $ref: '#/components/schemas/Order' }
        care_plan: { $ref: '#/components/schemas/CarePlanDraft' }
        citations:
          type: array
          items: { $ref: '#/components/schemas/Citation' }
        confidence: { type: number, minimum: 0, maximum: 1 }
        warnings:
          type: array
          items: { type: string }
        requires_human_review: { type: boolean }
    Order:
      type: object
      required: [id, type, status]
      properties:
        id: { type: string }
        type: { type: string, enum: [medication, lab, imaging, procedure, consult] }
        code: { type: string }
        dose: { type: string }
        route: { type: string }
        timing: { type: string, enum: [stat, urgent, routine] }
        status: { type: string, enum: [active, completed, discontinued] }
    PlaceOrderRequest:
      type: object
      required: [orders]
      properties:
        orders:
          type: array
          items:
            type: object
            required: [type, code, timing]
            properties:
              type: { type: string }
              code: { type: string }
              dose: { type: string }
              route: { type: string }
              timing: { type: string }
              reason: { type: string, description: required for overrides }
        idempotency_key: { type: string }
    PathwayRun:
      type: object
      properties:
        id: { type: string }
        pathway_id: { type: string }
        current_step: { type: string }
        status: { type: string }
    DifferentialDx:
      type: object
      properties:
        condition: { type: string }
        icd10: { type: string }
        snomed: { type: string }
        probability: { type: number }
        reasoning: { type: string }
        citations: { type: array, items: { type: string } }
    RedFlag:
      type: object
      properties:
        id: { type: string }
        severity: { type: string, enum: [HARD, SOFT] }
        description_ar: { type: string }
        description_en: { type: string }
        action_ar: { type: string }
        action_en: { type: string }
        escalation: { type: string }
        sla_min: { type: integer }
    DrugAlert:
      type: object
      properties:
        type: { type: string, enum: [allergy, interaction, contraindication, dose] }
        drug: { type: string }
        reason: { type: string }
        severity: { type: string, enum: [block, warn] }
    CarePlanDraft:
      type: object
      properties:
        goals:
          type: array
          items:
            type: object
            properties:
              goal: { type: string }
              metric: { type: string }
              target_value: { type: string }
              target_date: { type: string, format: date }
        interventions:
          type: array
          items: { type: string }
    Citation:
      type: object
      properties:
        id: { type: integer }
        source_type: { type: string }
        document: { type: string }
        version: { type: string }
        chunk_id: { type: string }
        score: { type: number }
    Vitals:
      type: object
      properties:
        systolic_bp: { type: integer }
        diastolic_bp: { type: integer }
        hr: { type: integer }
        rr: { type: integer }
        spo2: { type: integer }
        temp_c: { type: number }
        weight_kg: { type: number }
        height_cm: { type: number }
    PFT:
      type: object
      properties:
        test_date: { type: string, format: date }
        fev1: { type: number }
        fvc: { type: number }
        fev1_fvc_ratio: { type: number }
        dlco: { type: number }
        bronchodilator_response: { type: boolean }
    SleepStudy:
      type: object
      properties:
        study_date: { type: string, format: date }
        ahi: { type: number }
        study_type: { type: string }
        interpretation: { type: string }
        pdf_path: { type: string }
    BiopsyReport:
      type: object
      properties:
        histology_findings: { type: string }
        diagnosis_ar: { type: string }
        stage: { type: string }
        molecular: { type: object }
        signed_at: { type: string, format: date-time }
    Task:
      type: object
      properties:
        id: { type: string }
        title: { type: string }
        priority: { type: string }
        due_at: { type: string, format: date-time }
        status: { type: string }
  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            type: object
            properties:
              error: { type: string }
              details: { type: object }
    Forbidden:
      description: Forbidden (tenant / role / RBAC)
      content:
        application/json:
          schema:
            type: object
            properties:
              error: { type: string }
    RateLimited:
      description: Too many requests
      headers:
        X-RateLimit-Limit: { schema: { type: integer } }
        X-RateLimit-Remaining: { schema: { type: integer } }
      content:
        application/json:
          schema:
            type: object
            properties:
              error: { type: string }
              retry_after: { type: integer }
```

---

## Files

`namaweb/api/pulm/openapi.yaml` (machine-readable)
`namaweb/api/pulm/openapi.md` (this human-readable spec)

---

*Owner: SA — version 1.0 — 2026-08-01*
