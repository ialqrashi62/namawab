<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — E2E Tests (Gherkin + Playwright, 8 critical paths)

## 1. STEMI Activation
`gherkin
Feature: STEMI activation triggers D2B timer
  Scenario: ED physician activates STEMI
    Given a 58-year-old male presents with chest pain
    When ECG shows ST elevation 3 mm in V1-V4
    Then ""Code STEMI"" button is visible
    And cath lab activation occurs within 5 min
    And D2B timer starts
`

## 2. Door-to-Balloon
`gherkin
Feature: D2B compliance
  Scenario: STEMI patient within 90 min
    Given patient arrives at 14:30
    When cath lab accepts at 14:42
    And balloon inflated at 15:50
    Then D2B = 80 min (compliant)
    And audit event cath.door_to_balloon recorded
`

## 3. Structural Heart MDT
`gherkin
Feature: TAVR requires Heart Team sign-off
  Scenario: TAVR scheduling blocked without MDT
    Given a 78F with severe AS
    When scheduling TAVR without MDT decision
    Then scheduling is blocked
    And error message: ""Heart Team MDT required""
`

## 4. Stent SFDA UDI
`gherkin
Feature: Stent implant requires SFDA UDI
  Scenario: Stent deployment without UDI
    Given operator tries to deploy stent
    When UDI not scanned
    Then deployment is blocked
    And error: ""SFDA UDI scan required""
`

## 5. High-Alert Drug Double-Check
`gherkin
Feature: UFH requires 2-RN witness
  Scenario: UFH bolus without witness
    Given RN prepares UFH 7000 U
    When witness signature missing
    Then administration is blocked
    And error: ""2-RN witness required""
`

## 6. ACT Out of Range
`gherkin
Feature: ACT must be 250-300s for UFH
  Scenario: ACT 220s after UFH bolus
    Given patient on UFH gtt
    When ACT measured at 220s
    Then re-bolus alert
    And recheck ACT in 5 min
`

## 7. CIN Surveillance
`gherkin
Feature: Post-PCI creatinine surveillance
  Scenario: 48h post-PCI Cr elevation
    Given patient with eGFR 45
    When 200 mL contrast used
    And Cr at 48h shows ≥0.5 mg/dL elevation
    Then CIN event recorded
    And nephrology consult triggered
`

## 8. DAPT Compliance
`gherkin
Feature: DAPT duration based on DAPT score
  Scenario: Extended DAPT (30+ months)
    Given DAPT score 3, ischemic risk high
    When PCI completed
    Then DAPT 30+ months recommended
    And provider must confirm or override
`

---
*Section 19 of CARD-002. Tests. L1 DRAFT.*