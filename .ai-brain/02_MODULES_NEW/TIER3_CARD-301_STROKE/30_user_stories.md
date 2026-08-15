# CARD-301_STROKE — User Stories & Acceptance Criteria

## User Story 1: Code Stroke Activation
**As an** ER physician
**I want** to activate Code Stroke and immediately trigger the stroke team
**So that** time-critical treatment is initiated within 60 minutes of arrival

### Acceptance Criteria
- [ ] Given a patient with suspected stroke
- [ ] When I activate Code Stroke via the form
- [ ] Then the system sends alerts to neurologist, CT technician, lab
- [ ] And the SLA timer starts
- [ ] And the case is recorded with code_stroke_activated=true
- [ ] And the stroke team page within 5 minutes

### Test Cases
- TC-001: Activation sends page to all stroke team members
- TC-002: SLA timer starts at activation time
- TC-003: Form validates required fields (NIHSS, TLKW, patient_id)
- TC-004: Cancellation flow available within 30 min

## User Story 2: NIHSS Auto-Calculation
**As a** stroke team member
**I want** to enter NIHSS sub-scores and see the total severity
**So that** I can quickly assess stroke severity

### Acceptance Criteria
- [ ] When I enter 13 sub-scores
- [ ] Then the total is calculated (0-42)
- [ ] And severity is shown (minor/moderate/severe)
- [ ] And clinical recommendation is provided
- [ ] And citation is shown (AHA/ASA 2019)

## User Story 3: Thrombolysis Eligibility
**As a** stroke neurologist
**I want** to check thrombolysis eligibility for an AIS patient
**So that** I can make a safe treatment decision

### Acceptance Criteria
- [ ] When I submit patient vitals and history
- [ ] Then the system checks all contraindications
- [ ] And shows eligible/eligible=false result
- [ ] And lists all exclusions if any
- [ ] And recommends Tenecteplase or Alteplase
- [ ] And shows the dose based on weight

## User Story 4: Thrombolysis Treatment Recording
**As a** stroke nurse
**I want** to record thrombolysis administration
**So that** the case is documented for QI and billing

### Acceptance Criteria
- [ ] When I record the dose and time
- [ ] Then it's linked to the stroke case
- [ ] And door_to_needle_minutes is computed
- [ ] And compliance is checked (≤60 min)
- [ ] And consent is verified (PDPL compliant)

## User Story 5: Thrombectomy Tracking
**As a** interventional neuroradiologist
**I want** to record thrombectomy procedure and outcome
**So that** TICI score and mRS are tracked

### Acceptance Criteria
- [ ] When I record procedure
- [ ] Then TICI score is captured (0-3)
- [ ] And door_to_groin_minutes is computed
- [ ] And mRS at 24h, 7d, 30d is tracked
- [ ] And complications are recorded

## User Story 6: Quality Dashboard
**As a** quality coordinator
**I want** to see stroke center SLA metrics
**So that** I can identify QI opportunities

### Acceptance Criteria
- [ ] When I open the dashboard
- [ ] Then I see DNT, DTG, DTP averages
- [ ] And mRS distribution at 30 days
- [ ] And compliance rate trends
- [ ] And case volume by quarter

## User Story 7: Secondary Prevention Bundle
**As a** discharging physician
**I want** to verify 5-element secondary prevention bundle
**So that** recurrence risk is minimized

### Acceptance Criteria
- [ ] When I prepare discharge
- [ ] Then I see the 5 elements checklist
- [ ] And each is checked: antiplatelet, statin, anticoag, BP, lifestyle
- [ ] And completeness percentage is shown
- [ ] And patient education materials are linked

## User Story 8: 30-Day Follow-up
**As a** patient
**I want** to have a 30-day follow-up appointment
**So that** my recovery is tracked

### Acceptance Criteria
- [ ] When I discharge
- [ ] Then 30-day appointment is scheduled
- [ ] And SMS reminder is sent
- [ ] And mRS is assessed at visit
- [ ] And outcome is recorded for GWTG-S
