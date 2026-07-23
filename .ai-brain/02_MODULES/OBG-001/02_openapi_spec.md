# OBG-001 — OpenAPI 3.1 Specification

```yaml
openapi: 3.1.0
info:
  title: NamaMedical OB/GYN API
  version: 1.0.0
  description: OB/GYN module - pregnancies, deliveries, gynecological care, high-risk pregnancy

servers:
  - url: https://api.jumanasoft.com/v1

security:
  - bearerAuth: []

paths:
  /obg/pregnancies:
    get:
      summary: List pregnancies
      tags: [Pregnancies]
    post:
      summary: Create pregnancy record
      tags: [Pregnancies]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Pregnancy' }

  /obg/pregnancies/{id}:
    get:
      summary: Get pregnancy detail
      tags: [Pregnancies]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
    put:
      summary: Update pregnancy
      tags: [Pregnancies]

  /obg/pregnancies/{id}/prenatal-visits:
    get:
      summary: List prenatal visits
      tags: [Prenatal]
    post:
      summary: Add prenatal visit
      tags: [Prenatal]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PrenatalVisit' }

  /obg/pregnancies/{id}/preeclampsia-screen:
    post:
      summary: Screen for preeclampsia
      tags: [Preeclampsia]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PreeclampsiaScreen' }

  /obg/pregnancies/{id}/gdm-screen:
    post:
      summary: GDM screening (OGTT)
      tags: [GDM]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/GdmScreen' }

  /obg/pregnancies/{id}/ultrasound:
    post:
      summary: Record ultrasound
      tags: [Ultrasound]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Ultrasound' }

  /obg/deliveries:
    post:
      summary: Record delivery
      tags: [Deliveries]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Delivery' }

  /obg/deliveries/{id}/newborn:
    post:
      summary: Add newborn
      tags: [Newborn]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Newborn' }

  /obg/preeclampsia-risk:
    post:
      summary: ASPRE-based preeclampsia risk (AI)
      tags: [AI]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PreeclampsiaRiskInput' }
      responses:
        '200':
          description: Risk score + recommendation
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AiRecommendation' }

  /obg/labor-and-delivery/active:
    get:
      summary: Active labors (L&D board)
      tags: [L&D]

components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }

  schemas:
    Pregnancy:
      type: object
      required: [patientId, lmpDate]
      properties:
        id: { type: integer }
        patientId: { type: integer }
        lmpDate: { type: string, format: date }
        eddDate: { type: string, format: date }
        gravida: { type: integer }
        para: { type: integer }
        bloodType: { type: string }
        rhFactor: { type: string }
        bmi: { type: number }
        riskLevel: { type: string, enum: [LOW, MODERATE, HIGH] }
    PrenatalVisit:
      type: object
      required: [visitDate, gestationalAgeWeeks]
      properties:
        visitDate: { type: string, format: date-time }
        gestationalAgeWeeks: { type: integer }
        weightKg: { type: number }
        bpSystolic: { type: integer }
        bpDiastolic: { type: integer }
        fundalHeightCm: { type: number }
        fetalHeartRate: { type: integer }
        urineProtein: { type: string }
        complaints: { type: string }
        plan: { type: string }
    PreeclampsiaScreen:
      type: object
      required: [bpSystolic, bpDiastolic, proteinuria]
      properties:
        bpSystolic: { type: integer }
        bpDiastolic: { type: integer }
        proteinuria: { type: string }
        symptoms: { type: string }
        platelets: { type: integer }
        aspartateAminotransferase: { type: integer }
    GdmScreen:
      type: object
      required: [testType, fastingMgDl, oneHourMgDl, twoHourMgDl]
      properties:
        testType: { type: string, enum: [OGTT_50G, OGTT_75G, OGTT_100G] }
        fastingMgDl: { type: integer }
        oneHourMgDl: { type: integer }
        twoHourMgDl: { type: integer }
        threeHourMgDl: { type: integer }
    Ultrasound:
      type: object
      required: [ultrasoundDate, gestationalAgeWeeks, type]
      properties:
        ultrasoundDate: { type: string, format: date-time }
        gestationalAgeWeeks: { type: integer }
        type: { type: string, enum: [FIRST_TRIMESTER, ANOMALY, GROWTH, BIOPHYSICAL, DOPPLER] }
        estimatedFetalWeightG: { type: integer }
        amnioticFluidIndex: { type: number }
        umbilicalArteryDoppler: { type: string }
        cervicalLengthCm: { type: number }
    Delivery:
      type: object
      required: [pregnancyId, patientId, deliveryDate, deliveryMode]
      properties:
        pregnancyId: { type: integer }
        patientId: { type: integer }
        deliveryDate: { type: string, format: date-time }
        deliveryMode: { type: string, enum: [SVD, OPERATIVE_VD, C_SECTION, VBAC] }
        gestationalAgeAtDelivery: { type: integer }
        estimatedBloodLossMl: { type: integer }
        complications: { type: string }
        apgar1min: { type: integer }
        apgar5min: { type: integer }
    Newborn:
      type: object
      required: [deliveryId, sex, weightGrams]
      properties:
        sex: { type: string, enum: [M, F, A] }
        weightGrams: { type: integer }
        lengthCm: { type: number }
        headCircumferenceCm: { type: number }
        apgar1min: { type: integer }
        apgar5min: { type: integer }
        resuscitationRequired: { type: boolean }
        nicuAdmission: { type: boolean }
    PreeclampsiaRiskInput:
      type: object
      required: [age, bmi, meanArterialPressure, pregnancyHistory]
      properties:
        age: { type: integer }
        bmi: { type: number }
        meanArterialPressure: { type: number }
        pregnancyHistory: { type: string, enum: [NULLIPAROUS, MULTIPAROUS_NO_PE, MULTIPAROUS_WITH_PE] }
        familyHistory: { type: boolean }
        chronicHypertension: { type: boolean }
    AiRecommendation:
      type: object
      properties:
        riskScore: { type: number }
        riskLevel: { type: string, enum: [LOW, MODERATE, HIGH] }
        recommendations: { type: array, items: { type: string } }
        asaIndicated: { type: boolean }
```
