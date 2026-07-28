<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — E2E Tests (Gherkin)

`gherkin
Feature: Recipient evaluation
  Scenario: Add patient to waitlist
    Given a 38M with ESRD on HD for 4 years
    When evaluation complete
    And MDT approves
    Then patient added to waitlist

Feature: Donor match
  Scenario: Living donor match
    Given donor 42F and recipient 38M
    When ABO compat, HLA MM 2/6, crossmatch NEG
    Then match score 87 (proceed)

Feature: Positive CDC XM = absolute decline
  Scenario: Positive T-cell CDC
    Given donor and recipient with positive T-cell CDC
    When crossmatch reported
    Then decision = absolute_decline
    And no further transplant workup

Feature: Trough >20 = HARD BLOCK
  Scenario: Tacrolimus trough 22 ng/mL
    Given patient on tacrolimus 2 mg BID
    When trough measured 22 ng/mL
    Then dose hold + escalate to nephrologist
    And pharmacist blocked

Feature: Biopsy Banff + treatment
  Scenario: ACR IIA
    Given biopsy shows tubulitis (t2), intimal arteritis (v1)
    When pathology report received
    Then Banff grade IIA
    And treatment: rATG 1.5 mg/kg x 3-5 days
    And MD sign-off required

Feature: SCOT reporting
  Scenario: Transplant procedure
    Given transplant completed
    When procedure signed
    Then SCOT report filed within 7 days
    And national registry updated