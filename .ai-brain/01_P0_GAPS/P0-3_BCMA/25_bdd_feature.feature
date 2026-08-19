@bcma
Feature: Barcode Medication Administration

  Scenario: Normal drug passes 5 Rights
    Given a patient "أحمد" with no allergies
    And an active order for Amoxicillin 500mg PO
    When the nurse scans the patient wristband and drug barcode
    Then the system verifies 5 Rights and administers

  Scenario: Allergic patient is blocked
    Given a patient "فاطمة" allergic to Penicillin
    And an active order for Penicillin V 500mg PO
    When the nurse scans the drug barcode
    Then the system blocks and shows allergy alert

  Scenario: Insulin requires 2-nurse witness
    Given a patient "محمد" with active insulin order
    When the nurse scans insulin vial
    Then the system requires a second nurse witness before administration