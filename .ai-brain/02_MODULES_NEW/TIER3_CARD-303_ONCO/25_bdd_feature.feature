Feature: Cardio-Onc — Pre-Treatment Risk Assessment
  As a cardio-onc specialist
  I want to assess cancer therapy cardiac risk
  So that I can predict and prevent cardiotoxicity

  Background:
    Given authenticated user with role "doctor"
    And tenant_id = 1
    And patient_id = 67890

  Scenario: Low risk patient
    Given age 50, baseline EF 60, cumulative doxorubicin 100 mg/m²
    And no hypertension, no diabetes, no smoking
    When POST /api/coo/score/hfa-icos
    Then score < 4
    And risk is low or moderate

  Scenario: Very high risk patient
    Given age 70, baseline EF 45, cumulative doxorubicin 450 mg/m²
    And prior_cardiotoxicity = true
    And al_amyloidosis = true
    When POST /api/coo/score/hfa-icos
    Then risk is "very_high"
    And recommendation mentions "MUST involve Cardio-Onc"

  Scenario: GLS-guided hold chemo
    Given baseline GLS -20%, current GLS -16%
    When POST /api/coo/score/gls
    Then relative_change_pct > 15
    And action is "hold_chemo"

  Scenario: ICI Myocarditis confirmed
    Given troponin 0.5 (ULN 0.1), EF 25, hemodynamics unstable
    When POST /api/coo/score/ici-myocarditis
    Then severity is "fulminant"
    And treatment mentions "ICU + mechanical support"

  Scenario: Trastuzumab severe cardiotoxicity
    Given baseline EF 60%, current EF 45%, prior anthracycline 300 mg/m²
    When POST /api/coo/score/trastuzumab
    Then severity is "severe"
    And action is "Permanent D/C trastuzumab"

  Scenario: QTc >500ms
    Given baseline QTc 420, current QTc 510
    When POST /api/coo/monitor/qtc
    Then action is "hold_agent"

  Scenario: Cancer VTE — DOAC first-line
    Given cancer type "breast", no GI lesions, platelets 200K, creatinine 1.0
    When POST /api/coo/decision/vte
    Then first_line is "doac"

  Scenario: Cancer VTE — LMWH for gastric cancer
    Given cancer type "gastric", GI lesions true
    When POST /api/coo/decision/vte
    Then first_line is "lmwh"

  Scenario: Cardiac Amyloid — High suspicion
    Given pyrophosphate_scan grade 3
    When POST /api/coo/workup/amyloid
    Then suspicion is "high"
    And next_step mentions "TTR_genetic_test"

  Scenario: Cardioprotection for very high risk
    Given risk_category "very_high", EF 30, anthracycline 450 mg/m²
    When POST /api/coo/decision/cardioprotection
    Then recommended.length >= 3
    And note mentions "discuss with oncology"
