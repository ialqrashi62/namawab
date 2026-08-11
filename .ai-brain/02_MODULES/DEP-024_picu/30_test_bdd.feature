# filepath: 02_MODULES/DEP-024/30_test_bdd.feature
# BDD scenarios for PICU (DEP-024)
# Language: Gherkin (English for international tooling)

Feature: PICU clinical workflow

  Background:
    Given a CBAHI/JCI-accredited hospital
    And a tenant with id 1
    And a picu specialist user
    And a patient with MRN 100045

  Scenario: List encounters for patient
    Given the patient has 3 active encounters
    When the specialist requests GET /api/picu/list?patient_id=100045
    Then the response status is 200
    And the response contains 3 encounters

  Scenario: Create new encounter with valid data
    Given the specialist is authenticated
    When the specialist POSTs to /api/picu/ with patient_id=100045
    Then the response status is 201
    And the encounter has status "active"

  Scenario: Unauthorized access is rejected
    Given no auth token
    When the user requests GET /api/picu/list
    Then the response status is 401

  Scenario: Cross-tenant access is blocked
    Given a tenant A with id 1
    And a tenant B with id 2
    And an encounter in tenant A
    When tenant B user requests that encounter
    Then the response status is 404

  Scenario: AI diagnosis returns differential
    Given the patient has chest pain
    When the specialist requests POST /api/picu/ai/diagnose
    Then the response includes 3 differential diagnoses
    And each diagnosis has an ICD-10 code

  Scenario: Drug interaction check warns
    Given the patient takes warfarin
    When the specialist orders amiodarone
    Then the system warns about CYP3A4 interaction
    And the warning severity is "high"