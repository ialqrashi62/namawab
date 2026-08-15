Feature: Robotic CV Surgery — Heart Team + Risk
  As a cardiac surgeon
  I want to evaluate candidates via Heart Team
  So that I can recommend optimal surgical approach

  Background:
    Given authenticated user with role "doctor"
    And tenant_id = 1
    And patient_id = 67890

  Scenario: Low STS Risk → Open Surgery Acceptable
    Given age 60, EF 60%, no comorbidities
    When POST /api/rcv/score/sts
    Then score < 4
    And risk is "low"
    And recommendation includes "open"

  Scenario: High STS Risk → Consider TAVI
    Given age 80, EF 25%, dialysis, prior cardiac surgery
    When POST /api/rcv/score/sts
    Then score > 8
    And risk is "high" or "very_high"
    And recommendation mentions "TAVI"

  Scenario: TAVI Eligibility for Elderly
    Given age 80, STS 5, annulus 24, EF 50
    When POST /api/rcv/eligibility/tavi
    Then eligible is true
    And device is "Sapien 3" or "Evolut"

  Scenario: TAVI Ineligible for Young Patient
    Given age 50, STS 1, annulus 24, EF 60
    When POST /api/rcv/eligibility/tavi
    Then eligible is false

  Scenario: MitraClip Eligibility per COAPT
    Given MR Grade 4, EF 45, NYHA III, STS 10
    When POST /api/rcv/eligibility/mitraclip
    Then eligible is true
    And recommendation mentions "COAPT"

  Scenario: WATCHMAN Eligibility
    Given CHA2DS2-VASc 4, HAS-BLED 4, GI bleeding
    And LAA ostium 22 mm
    When POST /api/rcv/eligibility/watchman
    Then eligible is true
    And device is "WATCHMAN FLX"

  Scenario: Robotic Surgery Eligibility
    Given age 60, EF 50, no prior surgery, BMI 25
    When POST /api/rcv/eligibility/robotic
    Then eligible is true

  Scenario: Pre-Op Checklist Complete
    Given all 10 pre-op items true
    When POST /api/rcv/checklist/preop
    Then ready is true
    And completed is 10

  Scenario: Pre-Op Checklist Missing PDPL Consent
    Given 9 items true, PDPL consent false
    When POST /api/rcv/checklist/preop
    Then ready is false
    And recommendation mentions "PDPL consent"

  Scenario: High Conversion Risk
    Given BMI 45, prior cardiac surgery, complex anatomy
    When POST /api/rcv/risk/conversion
    Then risk is "high"
    And recommendation mentions "sternotomy set"

  Scenario: High Post-Op Complication Risk
    Given STS 12, age 80, EF 25, long bypass
    When POST /api/rcv/risk/postop
    Then level is "high"

  Scenario: Discharge Ready
    Given all 6 discharge criteria true
    When POST /api/rcv/discharge/readiness
    Then ready is true
