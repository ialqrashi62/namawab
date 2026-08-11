# Clinical Specification — Billing_Coding (DEP-057)

> **CMO:** Dr. Sarah Chen · Generated 2026-08-08

## 1. Scope
This department handles general, inpatient_billing, outpatient_billing, ed_billing, surgical_billing, professional_coding, facility_coding, denial_management within facility types: medical_city, tertiary_hospital, general_hospital, polyclinic, all_facilities.

## 2. Top 10 Conditions

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 1 | claim_denial | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 2 | undercoding | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 3 | overcoding | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 4 | unbilled_services | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 5 | late_billing | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 6 | ZATCA_non_compliance | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 7 | NPHIES_rejection | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 8 | charge_capture_issue | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 9 | coding_audit_finding | TBD | ESC/AHA/NICE guidelines |

| # | Condition | ICD-10 | Evidence |
|---|---|---|---|
| 10 | payer_specific_denial | TBD | ESC/AHA/NICE guidelines |


## 3. Top 20 Procedures

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 1 | charge_capture | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 2 | code_assignment_CPT | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 3 | code_assignment_ICD_10 | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 4 | code_assignment_HCPCS | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 5 | claim_submission | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 6 | claim_resubmission | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 7 | denial_appeal | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 8 | payment_posting | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 9 | account_followup | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 10 | write_off_process | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 11 | refund_process | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 12 | ZATCA_invoice_generation | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 13 | NPHIES_claim_submission | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 14 | batch_billing | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 15 | individual_billing | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 16 | recurring_billing | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 17 | insurance_verification | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 18 | prior_authorization | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 19 | coding_audit | TBD | Moderate |

| # | Procedure | SNOMED-CT | Risk |
|---|---|---|---|
| 20 | revenue_cycle_analytics | TBD | Moderate |


## 4. Critical Red Flags

- **claim_denial_high_value**: immediate action per protocol

- **coding_fraud_allegation**: immediate action per protocol

- **ZATCA_penalty_risk**: immediate action per protocol

- **payer_audit_finding**: immediate action per protocol

- **charge_master_error_critical**: immediate action per protocol


## 5. Risk Scores
- denial_rate
- days_in_AR
- clean_claim_rate
- first_pass_resolution_rate
- net_collection_rate
- gross_collection_rate
- charge_lag_days
- coding_accuracy_rate
- cost_to_collect
- revenue_per_encounter


## 6. Drug Interactions (Top 10)
- N_A_billing: monitor renal/hepatic dose


## 7. Saudi-Specific Epidemiology
- NCDs prevalence: Saudi MoH 2024 data
- Genetic disorders: consanguinity rates 50-60%
- Endemic infections: MERS-CoV, TB, Malaria (regional)

## 8. Quality Measures
- 30-day mortality
- Readmission rate
- Door-to-needle time
- Medication adherence
- Patient satisfaction

## 9. References
- UpToDate 2024
- Cochrane Database
- NICE Guidelines
- Saudi MoH Clinical Protocols
- CBAHI Standards