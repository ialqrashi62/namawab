Feature: Advanced Heart Failure — GDMT 4-Pillar
  As an HF cardiologist
  I want to optimize GDMT 4-pillar therapy
  So that I can reduce mortality and hospitalization

  Background:
    Given authenticated user with role "doctor"
    And tenant_id = 1
    And patient_id = 67890

  Scenario: HFrEF patient eligible for all 4 pillars
    Given EF 25%, NYHA III, SBP 110, K 4.5, GFR 60, HR 70
    When POST /api/ahf/gdmt/eligibility
    Then all 4 pillars are eligible
    And complete = true

  Scenario: Hypotension excludes ARNI
    Given EF 25%, NYHA III, SBP 90, K 4.5, GFR 60
    When POST /api/ahf/gdmt/eligibility
    Then ARNI is excluded
    And reason is "SBP <100"

  Scenario: Hyperkalemia excludes MRA
    Given EF 25%, NYHA III, SBP 110, K 5.5, GFR 60
    When POST /api/ahf/gdmt/eligibility
    Then MRA is excluded
    And reason is "K+ >5.0"

  Scenario: Low GFR excludes SGLT2i + MRA
    Given EF 25%, NYHA III, SBP 110, K 4.5, GFR 25
    When POST /api/ahf/gdmt/eligibility
    Then SGLT2i is excluded
    And MRA is excluded
    And reason includes "GFR <30"

  Scenario: ARNI dosing
    Given SBP 110, K 4.0, GFR 60, no ACEi
    When POST /api/ahf/dose/arni
    Then start_dose = "24/26 mg BID"
    And target_dose = "97/103 mg BID"

  Scenario: ARNI contraindicated by ACEi
    Given SBP 110, K 4.0, GFR 60, on ACEi
    When POST /api/ahf/dose/arni
    Then response errors with "36-hour washout required"

  Scenario: INTERMACS 1-2 are urgent MCS candidates
    Given patient on inotropes, INTERMACS 1
    When POST /api/ahf/score/intermacs
    Then profile = 1
    And mcs_candidate = true

  Scenario: Cardiogenic shock SCAI C
    Given SBP 80, lactate 3, CI 1.5, inotropes 2
    When POST /api/ahf/score/scai-shock
    Then stage = "C"
    And description = "Classic cardiogenic shock"

  Scenario: LVAD checklist complete
    Given all 10 checklist items true
    When POST /api/ahf/lvad/checklist
    Then ready = true
    And completed = 10

  Scenario: Heart transplant listing 1A
    Given patient in ICU on inotropes + MCS
    When POST /api/ahf/transplant/listing
    Then status = "1A"
    And eligible = true

  Scenario: Palliative care trigger
    Given ACC Stage D, NYHA IV, INTERMACS 2, multiple hospitalizations
    When POST /api/ahf/palliative/trigger
    Then eligible = true
    And triggers >= 2
