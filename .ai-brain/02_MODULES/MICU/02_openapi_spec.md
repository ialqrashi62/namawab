# MICU — OpenAPI 3.1 Specification

```yaml
openapi: 3.1.0
info:
  title: NamaMedical MICU API
  version: 1.0.0
  description: Medical ICU module - admissions, vitals, scores, ventilator, sepsis bundle

servers:
  - url: https://api.jumanasoft.com/v1
    description: Production

security:
  - bearerAuth: []

paths:
  /micu/admissions:
    get:
      summary: List ICU admissions
      tags: [Admissions]
      parameters:
        - in: query
          name: status
          schema:
            type: string
            enum: [active, discharged, all]
        - in: query
          name: severity
          schema:
            type: string
            enum: [apache_low, apache_mid, apache_high]
      responses:
        '200':
          description: List of admissions
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/IcuAdmission' }
    post:
      summary: Create ICU admission
      tags: [Admissions]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/IcuAdmissionCreate' }
      responses:
        '201':
          description: Admission created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/IcuAdmission' }

  /micu/admissions/{admissionId}:
    get:
      summary: Get ICU admission detail
      tags: [Admissions]
      parameters:
        - in: path
          name: admissionId
          required: true
          schema: { type: integer }
      responses:
        '200':
          description: Admission detail
          content:
            application/json:
              schema: { $ref: '#/components/schemas/IcuAdmission' }

  /micu/admissions/{admissionId}/vitals:
    get:
      summary: Get vitals (time series)
      tags: [Vitals]
      parameters:
        - in: path
          name: admissionId
          required: true
          schema: { type: integer }
        - in: query
          name: from
          schema: { type: string, format: date-time }
        - in: query
          name: to
          schema: { type: string, format: date-time }
      responses:
        '200':
          description: Vitals time series
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/IcuVital' }
    post:
      summary: Record vitals (nurse)
      tags: [Vitals]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/IcuVitalCreate' }
      responses:
        '201':
          description: Vitals recorded

  /micu/admissions/{admissionId}/scores:
    get:
      summary: List scores (APACHE, SOFA, GCS, etc.)
      tags: [Scores]
      parameters:
        - in: path
          name: admissionId
          required: true
          schema: { type: integer }
        - in: query
          name: scoreType
          schema: { type: string }
      responses:
        '200':
          description: Score list
    post:
      summary: Calculate + record score
      tags: [Scores]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ScoreCalculate' }
      responses:
        '201':
          description: Score calculated and recorded

  /micu/admissions/{admissionId}/ventilator:
    get:
      summary: Get ventilator settings history
      tags: [Ventilator]
    post:
      summary: Record vent settings
      tags: [Ventilator]

  /micu/admissions/{admissionId}/vasoactive:
    get:
      summary: Get vasoactive drips
      tags: [Vasoactive]
    post:
      summary: Order/start vasoactive drip
      tags: [Vasoactive]

  /micu/admissions/{admissionId}/sepsis-bundle:
    get:
      summary: Get sepsis bundle compliance
      tags: [Sepsis]
    post:
      summary: Update sepsis bundle step
      tags: [Sepsis]

  /micu/admissions/{admissionId}/code-status:
    get:
      summary: Get current code status
      tags: [Code]
    put:
      summary: Update code status
      tags: [Code]

  /micu/admissions/{admissionId}/delirium:
    get:
      summary: Get CAM-ICU assessments
      tags: [Delirium]
    post:
      summary: Record CAM-ICU
      tags: [Delirium]

  /micu/admissions/{admissionId}/rounds:
    get:
      summary: Get daily rounds notes
      tags: [Rounds]
    post:
      summary: Document daily rounds
      tags: [Rounds]

  /micu/early-warning:
    post:
      summary: Submit vitals for AI scoring (NEWS2, MEWS)
      tags: [AI]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/VitalsInput' }
      responses:
        '200':
          description: Risk score + recommendations
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AiRecommendation' }

components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }

  schemas:
    IcuAdmission:
      type: object
      properties:
        id: { type: integer }
        patientId: { type: integer }
        encounterId: { type: integer }
        admittedAt: { type: string, format: date-time }
        dischargedAt: { type: string, format: date-time, nullable: true }
        primaryDiagnosis: { type: string }
        apacheIiScore: { type: integer }
        sofaScore: { type: integer }
        codeStatus: { type: string, enum: [FULL, DNR, DNI, AND] }
        isolationRequired: { type: boolean }
    IcuAdmissionCreate:
      type: object
      required: [patientId, encounterId, admittedAt, primaryDiagnosis]
      properties:
        patientId: { type: integer }
        encounterId: { type: integer }
        admittedAt: { type: string, format: date-time }
        primaryDiagnosis: { type: string }
        admittingMdId: { type: integer }
    IcuVital:
      type: object
      properties:
        id: { type: integer }
        admissionId: { type: integer }
        recordedAt: { type: string, format: date-time }
        heartRate: { type: integer }
        map: { type: integer }
        spo2: { type: integer }
        gcsTotal: { type: integer }
    IcuVitalCreate:
      type: object
      required: [admissionId, recordedAt]
      properties:
        admissionId: { type: integer }
        recordedAt: { type: string, format: date-time }
        heartRate: { type: integer }
        systolicBp: { type: integer }
        diastolicBp: { type: integer }
        map: { type: integer }
        respiratoryRate: { type: integer }
        spo2: { type: integer }
        temperatureC: { type: number }
        gcsTotal: { type: integer }
        urineOutputMl: { type: integer }
    ScoreCalculate:
      type: object
      required: [scoreType, subscores]
      properties:
        scoreType: { type: string, enum: [APACHE_II, SOFA, GCS, RASS, CAM_ICU, BRADEN] }
        subscores: { type: object, additionalProperties: true }
    VitalsInput:
      type: object
      required: [heartRate, systolicBp, respiratoryRate, spo2, temperatureC]
      properties:
        heartRate: { type: integer }
        systolicBp: { type: integer }
        respiratoryRate: { type: integer }
        spo2: { type: integer }
        temperatureC: { type: number }
        gcsTotal: { type: integer }
    AiRecommendation:
      type: object
      properties:
        riskScore: { type: number }
        riskLevel: { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL] }
        recommendations: { type: array, items: { type: string } }
        bundleSteps: { type: array, items: { type: object } }
```
