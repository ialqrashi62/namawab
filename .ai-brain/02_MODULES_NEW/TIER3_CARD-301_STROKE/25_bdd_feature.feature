Feature: Stroke Center — Code Stroke Pathway
  As a stroke neurologist
  I want to activate code stroke and track door-to-needle SLA
  So that I can deliver time-critical treatment within 60 minutes

  Background:
    Given authenticated user with role "doctor"
    And tenant_id = 1
    And patient_id = 12345
    And patient weight = 70 kg
    And admission time = "2026-08-15T08:00:00Z"
    And last known well = "2026-08-15T07:30:00Z"

  Scenario: Code Stroke activation with NIHSS calculated
    When POST /api/stroke/cases with NIHSS scores
    Then response status is 201
    And response has case_id
    And code_stroke_activated = true

  Scenario: Patient is eligible for thrombolysis
    Given patient has no contraindications
    And BP is 160/90
    And INR is 1.0
    And platelets are 250000
    When POST /api/stroke/eligibility/thrombolysis
    Then response.eligible = true
    And response.exclusions is empty

  Scenario: Patient is excluded due to active bleeding
    Given patient has active internal bleeding
    When POST /api/stroke/eligibility/thrombolysis
    Then response.eligible = false
    And response.exclusions contains "Active_internal_bleeding"

  Scenario: Door-to-needle compliance
    Given thrombolysis administered at "2026-08-15T08:50:00Z"
    When POST /api/stroke/compliance/door-to-needle with minutes=50
    Then response.compliant = true
    And response.target = 60

  Scenario: Door-to-needle non-compliance triggers alert
    Given thrombolysis administered at "2026-08-15T09:15:00Z"
    When POST /api/stroke/compliance/door-to-needle with minutes=75
    Then response.compliant = false
    And recommendation contains "Above target"

  Scenario: Tenecteplase dose calculation
    Given patient weight 70 kg
    When POST /api/stroke/dose/tenecteplase
    Then response.dose_mg = 17.5

  Scenario: NIHSS calculation for minor stroke
    Given all NIHSS subscores = 0
    When POST /api/stroke/score/nihss
    Then response.score = 0
    And response.severity = "minor"

  Scenario: ASPECTS scoring for favorable case
    Given all 10 regions scored 1
    When POST /api/stroke/score/aspects
    Then response.score = 10
    And response.prognosis = "favorable"

  Scenario: Secondary prevention bundle complete
    Given all 5 elements present
    When POST /api/stroke/bundle/secondary-prevention
    Then response.complete = true
    And response.completeness_pct = 100

  Scenario: CHA2DS2-VASc scoring for AFib patient
    Given patient age 75, female, AFib, HTN, DM
    When POST /api/stroke/score/cha2ds2vasc
    Then response.score >= 5
    And response.anticoag_recommendation = "recommended"
