Feature: PE/DVT Response Team — PERT Activation
  As an emergency physician
  I want to activate PERT for PE
  So that I can deliver optimal care

  Background:
    Given authenticated user with role "doctor"
    And tenant_id = 1
    And patient_id = 67890

  Scenario: Massive PE detected
    Given SBP 85, HR 130, SpO2 85%, hemodynamically unstable
    When POST /api/pedvt/severity
    Then severity is "massive"
    And recommendation includes "PERT activation + thrombolysis"

  Scenario: Submassive Intermediate-High
    Given RV dysfunction positive, biomarker positive, hemodynamics stable
    When POST /api/pedvt/severity
    Then severity is "intermediate_high"

  Scenario: Low Risk PE
    Given no RV dysfunction, biomarker negative, hemodynamics stable
    When POST /api/pedvt/severity
    Then severity is "low"

  Scenario: Thrombolysis Eligibility
    Given massive_pe true, SBP 85, no contraindications
    When POST /api/pedvt/thrombolysis
    Then eligible is true
    And drug is "Alteplase" or "Tenecteplase"

  Scenario: Thrombolysis Contraindicated
    Given massive_pe true, SBP 85, recent_surgery true
    When POST /api/pedvt/thrombolysis
    Then eligible is false
    And contraindication mentions "Recent surgery"

  Scenario: Catheter-Directed Therapy
    Given intermediate_high_pe, systemic contraindication, EKOS available
    When POST /api/pedvt/cdt
    Then eligible is true
    And device is "EKOS"

  Scenario: Mechanical Thrombectomy
    Given massive_pe, systemic contraindication, FlowTriever available
    When POST /api/pedvt/thrombectomy
    Then eligible is true

  Scenario: IVC Filter for Contraindication
    Given acute_anticoagulation_contraindicated true
    When POST /api/pedvt/ivc-filter
    Then eligible is true
    And type is "Retrievable"

  Scenario: Anticoagulation DOAC Default
    Given no special conditions
    When POST /api/pedvt/anticoag
    Then first_line is "apixaban"

  Scenario: Anticoagulation LMWH for Gastric Cancer
    Given cancer true, gastric_cancer true
    When POST /api/pedvt/anticoag
    Then first_line is "lmwh"

  Scenario: CTEPH Suspected
    Given persistent_dyspnea_after_pe, vq_scan_mismatch, mean_pa_pressure_gt_20
    When POST /api/pedvt/cteph
    Then suspected is true
    And workup_recommendation mentions "V/Q scan"

  Scenario: PERT Activation for Massive PE
    Given massive_pe true
    When POST /api/pedvt/pert-activate
    Then activate is true
    And teams include "Cardiology", "Pulmonology", "ICU"
