Feature: Patient Portal — Identity, Booking, Caregiver
  As a patient
  I want to access my health records and book appointments
  So that I can manage my care

  Background:
    Given authenticated patient via Nafath L2
    And tenant_id = 1
    And patient_id = 67890

  Scenario: Identity verification via Nafath OTP
    Given national_id "1234567890", mobile "0501234567", otp_verified true
    When POST /api/pp/auth/verify-identity
    Then verified is true
    And level is "L2_otp"

  Scenario: Appointment booking with insurance
    Given specialty "cardiology", insurance_approved true
    When POST /api/pp/appointments
    Then cost is 0
    And status is "confirmed"

  Scenario: Appointment booking without insurance
    Given specialty "cardiology", insurance_approved false
    When POST /api/pp/appointments
    Then cost is 200

  Scenario: Telehealth eligible for follow-up
    Given chief_complaint "follow-up", requires_physical_exam false, has_video_capability true
    When POST /api/pp/telehealth/eligibility
    Then eligible is true
    And modality is "video"

  Scenario: Telehealth NOT eligible for physical exam
    Given requires_physical_exam true
    When POST /api/pp/telehealth/eligibility
    Then eligible is false
    And reason is "physical_exam_required"

  Scenario: Normal lab result disclosed
    Given result "WBC 7000", critical false, patient_consented true
    When POST /api/pp/lab-results/disclose
    Then disclosed is true

  Scenario: Critical lab result requires verification
    Given result "K 6.8", critical true, patient_consented true
    When POST /api/pp/lab-results/disclose
    Then response errors with "UNVERIFIED"

  Scenario: Refill eligible
    Given prescription_id 1, refills_remaining 2, controlled false
    When POST /api/pp/refills/request
    Then eligible is true

  Scenario: Refill blocked - no refills
    Given refills_remaining 0
    When POST /api/pp/refills/request
    Then eligible is false
    And reason is "no_refills_remaining"

  Scenario: Refill blocked - controlled substance
    Given controlled true
    When POST /api/pp/refills/request
    Then eligible is false
    And reason is "controlled_substance"

  Scenario: Caregiver proxy granted to spouse
    Given caregiver_national_id "1234567890", relationship "spouse", consent_doc_id "CONSENT-001"
    When POST /api/pp/caregiver/grant
    Then active is true

  Scenario: Caregiver proxy rejected - invalid relationship
    Given relationship "friend"
    When POST /api/pp/caregiver/grant
    Then response errors with "INVALID"

  Scenario: Self-reported BP normal
    Given systolic_bp 120
    When POST /api/pp/vitals/record
    Then abnormal is false

  Scenario: Self-reported BP severe
    Given systolic_bp 180
    When POST /api/pp/vitals/record
    Then abnormal is true

  Scenario: FHIR export all sections
    Given patient_id 67890
    When GET /api/pp/export/fhir/67890
    Then format is "json"
    And sections includes "medications"

  Scenario: Insurance verified with copay
    Given member_id "MEM001", payer_id "PAYER001", deductible_remaining 1000, copay_pct 20
    When POST /api/pp/insurance/verify
    Then eligible is true
    And copay_amount is 40

  Scenario: Consent withdrawal
    Given patient_id 1, withdrawal_type "marketing"
    When POST /api/pp/consent/withdraw
    Then withdrawn is true

  Scenario: High health risk detected
    Given age 70, bmi 35, systolic_bp 180, glucose 250, smoking true
    When POST /api/pp/risk/score
    Then risk is "high"
