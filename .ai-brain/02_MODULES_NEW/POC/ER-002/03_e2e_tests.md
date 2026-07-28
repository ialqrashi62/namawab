<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — E2E Tests (Gherkin)

`gherkin
Feature: Tier 1 activation
  Scenario: MVC ejection
    Given a 28M ejected from MVC
    When trauma team paged
    Then full team assembled <15 min
    And primary survey starts

Feature: MTP trigger
  Scenario: Shock + FAST+
    Given patient SBP 80, HR 130, FAST positive
    When MTP trigger check
    Then MTP activated
    And cooler #1 prepared in 10 min

Feature: Damage control lap
  Scenario: Unstable + peritonitis
    Given FAST+ + unstable
    When OR available
    Then damage control lap <60 min
    And temporary closure

Feature: TBI craniectomy
  Scenario: Severe TBI + herniation
    Given GCS 6, blown pupil
    When CT shows mass effect
    Then decompressive craniectomy <4h

Feature: Transfer to higher level
  Scenario: Pediatric trauma
    Given 8y with ISS 25
    When adult trauma center
    Then transfer to pediatric center <60 min
`

---
*Section 19 of ER-002. L1 DRAFT.*