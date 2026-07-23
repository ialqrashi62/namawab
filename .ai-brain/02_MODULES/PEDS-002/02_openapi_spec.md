# PEDS-002 — OpenAPI 3.1 Specification

```yaml
openapi: 3.1.0
info:
  title: NamaMedical NICU API
  version: 1.0.0
servers:
  - url: https://api.jumanasoft.com/v1
security:
  - bearerAuth: []

paths:
  /peds/nicu/admissions:
    get:
      summary: List NICU admissions
    post:
      summary: Create NICU admission
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/NicuAdmission' }

  /peds/nicu/admissions/{id}:
    get:
      summary: Get admission detail

  /peds/nicu/admissions/{id}/vitals:
    get:
      summary: List vitals (time series)
    post:
      summary: Record vitals

  /peds/nicu/admissions/{id}/respiratory:
    get:
      summary: List respiratory support
    post:
      summary: Add respiratory support (vent, CPAP, surfactant)

  /peds/nicu/admissions/{id}/feeds:
    get:
      summary: List feeds
    post:
      summary: Record feed

  /peds/nicu/admissions/{id}/medications:
    get:
      summary: List medications
    post:
      summary: Order medication (weight-based)

  /peds/nicu/admissions/{id}/screenings:
    get:
      summary: List screenings (ROP, hearing, metabolic)
    post:
      summary: Add screening

  /peds/nicu/admissions/{id}/developmental:
    get:
      summary: Developmental assessment
    post:
      summary: Add developmental milestone

  /peds/nicu/admissions/{id}/parents:
    get:
      summary: Parent contact + visit log
    post:
      summary: Add parent

  /peds/nicu/corrected-age:
    post:
      summary: Calculate corrected age
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [birthDate, currentDate]
              properties:
                birthDate: { type: string, format: date }
                currentDate: { type: string, format: date }

  /peds/nicu/pews:
    post:
      summary: Calculate PEWS score
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/VitalsInput' }

components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
  schemas:
    NicuAdmission:
      type: object
      required: [patientId, admittedAt, birthWeightGrams, gestationalAgeWeeks]
      properties:
        id: { type: integer }
        patientId: { type: integer }
        admittedAt: { type: string, format: date-time }
        dischargedAt: { type: string, format: date-time, nullable: true }
        primaryDiagnosis: { type: string }
        birthWeightGrams: { type: integer }
        gestationalAgeWeeks: { type: integer }
        apgar1min: { type: integer }
        apgar5min: { type: integer }
        deliveryMode: { type: string, enum: [SVD, C_SECTION, VACUUM, BREECH] }
        multipleBirth: { type: boolean }
        sex: { type: string, enum: [M, F, A] }
        levelOfCare: { type: string, enum: [II, III, IV] }
        respiratorySupport: { type: string, enum: [NONE, NC, CPAP, NIV, CONVENTIONAL, HFOV, INVASIVE, EXTRACORPOREAL] }
    VitalsInput:
      type: object
      required: [heartRate, respiratoryRate, spo2, temperatureC]
      properties:
        heartRate: { type: integer }
        respiratoryRate: { type: integer }
        spo2: { type: integer }
        temperatureC: { type: number }
        capillaryRefill: { type: integer }
        mentalStatus: { type: string, enum: [ALERT, VOICE, PAIN, UNRESPONSIVE] }
```
