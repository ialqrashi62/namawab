# 19 — OpenAPI Spec (CARD-001)

> Owner: SA · Snippet: snippet:openapi-3-1 · Tier 1

```yaml
openapi: 3.1.0
info:
  title: NamaMedical Cardiology API
  version: 1.0.0
  description: |
    Cardiology outpatient + inpatient + cath lab + device + co-pilot + red-flag + NPHIES API.
    Multi-tenant via RLS. Golden Access Rule enforced.

servers:
  - url: https://jumanasoft.com
  - url: http://localhost:3000

security:
  - bearerAuth: []
  - sessionAuth: []

tags:
  - { name: encounter, description: Cardiology encounters }
  - { name: ecg, description: ECG records }
  - { name: echo, description: Echo reports }
  - { name: stress, description: Stress tests }
  - { name: holter, description: Holter reports }
  - { name: cath, description: Cath lab reports }
  - { name: device, description: Device implants (PM/ICD/CRT) }
  - { name: rehab, description: Cardiac rehab plans }
  - { name: risk-score, description: Risk score calculators }
  - { name: copilot, description: Cardiology AI co-pilot }
  - { name: red-flag, description: Red flag activation }
  - { name: nphies, description: NPHIES integration }

paths:
  /api/cardiology/encounters:
    get:
      tags: [encounter]
      summary: List cardiology encounters
      parameters:
        - { in: query, name: patient_id, schema: { type: string, format: uuid } }
        - { in: query, name: doctor_id, schema: { type: string, format: uuid } }
        - { in: query, name: from, schema: { type: string, format: date-time } }
        - { in: query, name: to, schema: { type: string, format: date-time } }
        - { in: query, name: limit, schema: { type: integer, default: 50 } }
        - { in: query, name: offset, schema: { type: integer, default: 0 } }
      responses:
        '200': { description: List of encounters, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Encounter' } } } } }
        '403': { $ref: '#/components/responses/Forbidden' }
    post:
      tags: [encounter]
      summary: Create cardiology encounter
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/EncounterCreate' } } }
      responses:
        '201': { description: Created, content: { application/json: { schema: { $ref: '#/components/schemas/Encounter' } } } }
        '400': { $ref: '#/components/responses/BadRequest' }
        '403': { $ref: '#/components/responses/Forbidden' }

  /api/cardiology/encounters/{id}:
    parameters:
      - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
    get:
      tags: [encounter]
      summary: Get encounter by id
      responses:
        '200': { description: Encounter, content: { application/json: { schema: { $ref: '#/components/schemas/Encounter' } } } }
        '404': { $ref: '#/components/responses/NotFound' }
    put:
      tags: [encounter]
      summary: Update encounter
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/EncounterUpdate' } } }
      responses:
        '200': { description: Updated }
        '400': { $ref: '#/components/responses/BadRequest' }

  /api/cardiology/ecg:
    get:
      tags: [ecg]
      summary: List ECG records
      parameters:
        - { in: query, name: patient_id, schema: { type: string, format: uuid } }
        - { in: query, name: red_flag, schema: { type: boolean } }
      responses:
        '200': { description: List }
    post:
      tags: [ecg]
      summary: Upload + auto-interpret ECG
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file: { type: string, format: binary }
                patient_id: { type: string, format: uuid }
                encounter_id: { type: string, format: uuid }
                context: { type: string, description: 'JSON with age, sex, symptoms' }
      responses:
        '201': { description: Created + interpreted, content: { application/json: { schema: { $ref: '#/components/schemas/ECGRecord' } } } }
        '400': { $ref: '#/components/responses/BadRequest' }
        '413': { description: File too large }

  /api/cardiology/cath:
    post:
      tags: [cath]
      summary: Create cath report (PCI)
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/CathReportCreate' } } }
      responses:
        '201': { description: Created }
      parameters:
        - { in: header, name: Idempotency-Key, required: true, schema: { type: string } }

  /api/cardiology/devices:
    post:
      tags: [device]
      summary: Implant device (PM/ICD/CRT)
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/DeviceImplantCreate' } } }
      parameters:
        - { in: header, name: Idempotency-Key, required: true, schema: { type: string } }
      responses:
        '201': { description: Implanted }

  /api/cardiology/risk-scores/heart:
    post:
      tags: [risk-score]
      summary: Compute HEART score
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/HEARTScoreInput' } } }
      responses:
        '200': { description: Result, content: { application/json: { schema: { $ref: '#/components/schemas/HEARTScoreOutput' } } } }

  /api/cardiology/risk-scores/cha2ds2vasc:
    post:
      tags: [risk-score]
      summary: Compute CHA2DS2-VASc score
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/CHA2DS2VAScInput' } } }
      responses:
        '200': { description: Result }

  /api/cardiology/risk-scores/hasbled:
    post:
      tags: [risk-score]
      summary: Compute HAS-BLED score
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/HASBLEDInput' } } }
      responses:
        '200': { description: Result }

  /api/cardiology/risk-scores/hf-gdmt:
    post:
      tags: [risk-score]
      summary: HF GDMT optimization
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/HFGDMTInput' } } }
      responses:
        '200': { description: Optimization plan }

  /api/cardiology/copilot/query:
    post:
      tags: [copilot]
      summary: Cardiology AI co-pilot query
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/CopilotInput' } } }
      responses:
        '200': { description: Co-pilot response, content: { application/json: { schema: { $ref: '#/components/schemas/CopilotOutput' } } } }
        '503': { description: LLM service unavailable }

  /api/cardiology/red-flags/{rf_id}/activate:
    parameters:
      - { in: path, name: rf_id, required: true, schema: { type: string, enum: [STEMI, dissection, tamponade, PE, SCD, ...] } }
    post:
      tags: [red-flag]
      summary: Activate red flag CODE pathway
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/RedFlagInput' } } }
      parameters:
        - { in: header, name: Idempotency-Key, required: true, schema: { type: string } }
      responses:
        '201': { description: Activated, content: { application/json: { schema: { $ref: '#/components/schemas/RedFlagActivation' } } } }

  /api/cardiology/nphies/claim:
    post:
      tags: [nphies]
      summary: Submit NPHIES claim
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/NPHIESClaimInput' } } }
      parameters:
        - { in: header, name: Idempotency-Key, required: true, schema: { type: string } }
      responses:
        '201': { description: Submitted, content: { application/json: { schema: { $ref: '#/components/schemas/NPHIESClaimOutput' } } } }
        '502': { description: NPHIES service error }

components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
    sessionAuth: { type: apiKey, in: cookie, name: connect.sid }
  responses:
    BadRequest: { description: Bad request }
    Forbidden: { description: Forbidden — missing role or tenant }
    NotFound: { description: Not found }
  schemas:
    Encounter: { type: object, properties: { id: { type: string, format: uuid }, patient_id: { type: string, format: uuid }, doctor_id: { type: string, format: uuid }, type: { type: string }, status: { type: string }, started_at: { type: string, format: date-time }, diagnosis_primary: { type: string }, red_flags: { type: array, items: { type: string } } } }
    EncounterCreate: { type: object, required: [patient_id, doctor_id, type, chief_complaint], properties: { patient_id: { type: string, format: uuid }, doctor_id: { type: string, format: uuid }, type: { type: string, enum: [outpatient, inpatient, er, telehealth] }, chief_complaint: { type: string } } }
    EncounterUpdate: { type: object, properties: { diagnosis_primary: { type: string }, diagnosis_secondary: { type: array, items: { type: string } }, disposition: { type: string } } }
    ECGRecord: { type: object, properties: { id: { type: string, format: uuid }, patient_id: { type: string, format: uuid }, rate: { type: integer }, rhythm: { type: string }, pr_ms: { type: integer }, qrs_ms: { type: integer }, qtc_ms: { type: integer }, axis_deg: { type: integer }, st_per_lead: { type: object }, q_per_lead: { type: object }, impression: { type: string }, urgency: { type: string }, red_flag: { type: boolean } } }
    CathReportCreate: { type: object, required: [encounter_id, procedure_type, performed_by, findings, interventions, nphies_bundle, amount_total], properties: { encounter_id: { type: string, format: uuid }, procedure_type: { type: string, enum: [diagnostic_cath, PCI, TAVR, MitraClip, Watchman, ASD_closure, peripheral] }, performed_by: { type: string, format: uuid }, access_site: { type: string }, findings: { type: object }, interventions: { type: array, items: { type: object } }, complications: { type: string }, nphies_bundle: { type: string }, amount_total: { type: number, format: decimal } } }
    DeviceImplantCreate: { type: object, required: [encounter_id, device_type, manufacturer, model, implanted_by, nphies_bundle, amount_total], properties: { encounter_id: { type: string, format: uuid }, device_type: { type: string, enum: [PM, ICD, CRT_P, CRT_D, leadless_PM, S_ICD] }, manufacturer: { type: string }, model: { type: string }, serial: { type: string }, implanted_by: { type: string, format: uuid }, leads: { type: array, items: { type: object } }, nphies_bundle: { type: string }, amount_total: { type: number, format: decimal } } }
    HEARTScoreInput: { type: object, required: [history, ecg, age, riskFactors, troponin], properties: { history: { type: integer, minimum: 0, maximum: 2 }, ecg: { type: integer, minimum: 0, maximum: 2 }, age: { type: integer, minimum: 0, maximum: 2 }, riskFactors: { type: integer, minimum: 0, maximum: 2 }, troponin: { type: integer, minimum: 0, maximum: 2 } } }
    HEARTScoreOutput: { type: object, properties: { score: { type: integer, minimum: 0, maximum: 10 }, risk: { type: string, enum: [low, moderate, high] }, recommendation: { type: string }, redFlag: { type: boolean } } }
    CHA2DS2VAScInput: { type: object, properties: { chf: { type: integer }, htn: { type: integer }, age: { type: integer, enum: [0, 1, 2] }, diabetes: { type: integer }, stroke_tia_thromboembolism: { type: integer }, vascular: { type: integer }, sex: { type: integer } } }
    HASBLEDInput: { type: object, properties: { htn_uncontrolled: { type: integer }, renal_disease: { type: integer }, liver_disease: { type: integer }, stroke: { type: integer }, prior_bleed: { type: integer }, inr_unstable: { type: integer }, elderly: { type: integer }, drugs: { type: integer }, alcohol: { type: integer } } }
    HFGDMTInput: { type: object, required: [ef, nyha, bp_systolic, hr, egfr, k, current_meds], properties: { ef: { type: number }, nyha: { type: integer, enum: [1, 2, 3, 4] }, bp_systolic: { type: integer }, hr: { type: integer }, egfr: { type: number }, k: { type: number }, current_meds: { type: array, items: { type: object } }, allergies: { type: array, items: { type: string } } } }
    CopilotInput: { type: object, required: [question, encounter_id], properties: { question: { type: string }, encounter_id: { type: string, format: uuid }, patient_id: { type: string, format: uuid }, include_patient_context: { type: boolean, default: true }, stream: { type: boolean, default: false } } }
    CopilotOutput: { type: object, properties: { answer_ar: { type: string }, answer_en: { type: string }, sources: { type: array, items: { type: object } }, evidence_level: { type: string, enum: [A, B, C] }, warnings: { type: array, items: { type: string } }, cds_rules: { type: array, items: { type: string } }, red_flag: { type: boolean }, trace_id: { type: string }, cost_usd: { type: number } } }
    RedFlagInput: { type: object, required: [patient_id, encounter_id, severity], properties: { patient_id: { type: string, format: uuid }, encounter_id: { type: string, format: uuid }, severity: { type: string, enum: [critical, urgent, warning] }, notes: { type: string } } }
    RedFlagActivation: { type: object, properties: { id: { type: string, format: uuid }, rf_id: { type: string }, severity: { type: string }, activated_at: { type: string, format: date-time }, timeline: { type: array, items: { type: object } }, notifications: { type: array, items: { type: object } } } }
    NPHIESClaimInput: { type: object, required: [encounter_id, patient_id, bundle, lines], properties: { encounter_id: { type: string, format: uuid }, patient_id: { type: string, format: uuid }, bundle: { type: string }, lines: { type: array, items: { type: object } } } }
    NPHIESClaimOutput: { type: object, properties: { nphies_claim_id: { type: string }, status: { type: string }, amount: { type: number }, response_code: { type: string } } }
```
