# filepath: 02_MODULES/DEP-011/30_test_bdd.feature
# BDD scenarios for General_Surgery (DEP-011)
# Language: Gherkin (English for international tooling)

Feature: General_Surgery clinical workflow

  Background:
    Given a CBAHI/JCI-accredited hospital
    And a tenant with id 1
    And a genSurg specialist user
    And a patient with MRN 100045

  Scenario: List encounters for patient
    Given the patient has 3 active encounters
    When the specialist requests GET /api/genSurg/list?patient_id=100045
    Then the response status is 200
    And the response contains 3 encounters

  Scenario: Create new encounter with valid data
    Given the specialist is authenticated
    When the specialist POSTs to /api/genSurg/ with patient_id=100045
    Then the response status is 201
    And the encounter has status "active"

  Scenario: Unauthorized access is rejected
    Given no auth token
    When the user requests GET /api/genSurg/list
    Then the response status is 401

  Scenario: Cross-tenant access is blocked
    Given a tenant A with id 1
    And a tenant B with id 2
    And an encounter in tenant A
    When tenant B user requests that encounter
    Then the response status is 404

  Scenario: AI diagnosis returns differential
    Given the patient has chest pain
    When the specialist requests POST /api/genSurg/ai/diagnose
    Then the response includes 3 differential diagnoses
    And each diagnosis has an ICD-10 code

  Scenario: Drug interaction check warns
    Given the patient takes warfarin
    When the specialist orders amiodarone
    Then the system warns about CYP3A4 interaction
    And the warning severity is "high"