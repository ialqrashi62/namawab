# User Stories — Cardiology

> **Owner:** PM/UX
> **Date:** 2026-07-22

---

## US-1: CHA₂DS₂-VASc Risk Assessment

**As a** cardiologist
**I want to** calculate stroke risk for a new AF patient at the point-of-care
**So that** I can make an informed anticoagulation decision

### Acceptance Criteria (Gherkin)

```gherkin
Feature: CHA2DS2-VASc risk scoring

  Scenario: Cardiologist assesses new AF patient
    Given a 65-year-old male patient with new-onset AF
    And the patient has CHF, HTN, and DM
    When the cardiologist opens the cardiology station
    And clicks "Calculate stroke risk"
    Then the system shows CHA₂DS₂-VASc = 3 (CHF + HTN + DM)
    And the system suggests "Oral anticoagulation indicated per ESC 2023"
    And cites "chunk_id=cv-2023-esc-af-007, score=0.91"
    And provides a button to "Order apixaban 5mg BID"

  Scenario: HAS-BLED bleeding risk
    Given a 75-year-old on warfarin with HTN
    When the cardiologist clicks "Calculate bleeding risk"
    Then the system shows HAS-BLED = 2
    And notes "Caution — high BP, monitor INR closely"
```

## US-2: Echo Report Upload

**As a** sonographer
**I want to** upload a TTE report with images
**So that** the cardiologist can review and sign

### Acceptance Criteria

```gherkin
  Scenario: Upload echo with measurements
    Given I have a TTE DICOM file
    When I upload via the cardiology station
    Then the system extracts LVEF, valve assessment, wall motion
    And routes to the assigned cardiologist for sign-off
    And the report appears in the patient's chart within 30 seconds
```

## US-3: Cath Lab Scheduling

**As a** cardiology nurse
**I want to** schedule a patient for cardiac catheterization
**So that** the lab has a clear daily roster

### Acceptance Criteria

```gherkin
  Scenario: Schedule elective cath
    Given a patient with stable angina and abnormal stress test
    When I open "Cath Lab → Schedule"
    And select the patient, procedure type, and slot
    Then the system checks pre-procedure checklist (EKG, labs, consent)
    And if any are missing, flags them with red X
    And if all are complete, confirms the slot
    And sends notification to the interventional cardiologist
```

## US-4: ACS Bundle Activation

**As an** ER physician
**I want to** activate the cath lab from the ER
**So that** a STEMI patient reaches the lab in <90 minutes

### Acceptance Criteria

```gherkin
  Scenario: STEMI cath lab activation
    Given a patient with chest pain + ST elevation on ECG
    When I click "Activate Cath Lab (STEMI)"
    Then the system:
      - Pages the on-call interventional cardiologist
      - Pages the cath lab team
      - Reserves the next cath lab slot
      - Sets "door-to-balloon" timer
      - Flags the patient in the cardiology station
    And the cardiology station shows "STEMI ACTIVE — ETA 25 min"
```

## US-5: Heart Failure GDMT Tracking

**As a** heart failure nurse
**I want to** track GDMT optimization for HFrEF patients
**So that** patients are on all 4 pillars of GDMT

### Acceptance Criteria

```gherkin
  Scenario: GDMT pillar compliance
    Given an HFrEF patient (LVEF ≤40%)
    When I open the patient's HF dashboard
    Then the system shows 4 GDMT pillars (ARNI/ACE-i, BB, MRA, SGLT2i)
    And highlights which are on board
    And suggests the next GDMT step if any pillar is missing
```

## US-6: Anticoagulation Clinic INR Tracking

**As an** anticoagulation nurse
**I want to** see all patients due for INR
**So that** I can review the daily clinic queue

### Acceptance Criteria

```gherkin
  Scenario: Daily anticoagulation clinic
    Given today is the anticoagulation clinic day
    When I open the cardiology station → "Anticoag Clinic"
    Then the system shows:
      - All patients with INR due today
      - Last 3 INR values + trend arrow
      - Patients with INR >3.5 (over-anticoagulated, red flag)
      - Patients with INR <2.0 (under-anticoagulated, red flag)
    And I can document the new INR and dose adjustment inline
```

## US-7: AI CDS Refusal

**As a** cardiologist
**I want to** know when CDS refuses a question
**So that** I know the AI is not silently hallucinating

### Acceptance Criteria

```gherkin
  Scenario: Out-of-scope question
    Given I ask "What is the treatment for pediatric leukemia?"
    When the CDS engine processes
    Then the system returns "This is outside cardiology scope. Please consult Pediatric Hematology-Oncology."
    And logs the refusal in the audit trail
    And does NOT provide a made-up answer
```

---

End of user stories.
