<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 DBML Schema (13 tables)

## 1. transplant_waitlist
- id UUID PK
- tenant_id UUID FK
- patient_id BIGINT
- listing_date, blood_type, cpra_pct, epts_score
- dialysis_years, diabetes_status, prior_transplant_count
- hla_antibodies JSONB
- status (ACTIVE|HOLD|TRANSPLANTED|REMOVED|DEATH)
- priority_score NUMERIC(6,2)

## 2. donor_registry
- id UUID PK
- tenant_id UUID FK
- donor_id VARCHAR(50)
- donor_type (LRD|LURD|DD|PAIRED)
- age, height_cm, weight_kg, blood_type
- hla_typing JSONB
- kdpi_score
- cause_of_death, comorbidities JSONB
- ecmo_used, dcd
- cross_clamp_time, cold_ischemia_minutes
- biopsy_remuzzi_score JSONB
- recovered_at

## 3. recipient_evaluation
- id UUID PK
- tenant_id UUID FK
- patient_id BIGINT
- evaluation_date
- cardiac_clearance, pulmonary_clearance, malignancy_screening
- infection_screening JSONB (HBV, HCV, HIV, CMV, EBV, TB)
- psychosocial_clearance, financial_clearance
- mdt_approval_date, approved_for_listing
- exclusions JSONB

## 4. hla_typing
- id UUID PK
- tenant_id UUID FK
- subject_type (DONOR|RECIPIENT)
- subject_id BIGINT
- locus VARCHAR(10) (A, B, C, DRB1, DQB1, DPA1)
- allele_1, allele_2 VARCHAR(20)
- resolution (LOW|HIGH)
- typing_method (NGS|SSO|SSP)
- tested_at, lab_id

## 5. crossmatch_results
- id UUID PK
- tenant_id UUID FK
- donor_id BIGINT, recipient_id BIGINT
- cdc_t_cell, cdc_b_cell (POS|NEG|EQUIVOCAL)
- flow_t_cell_mcs, flow_b_cell_mcs
- virtual_xm, dsa_locus JSONB
- performed_at, performed_by_user_id

## 6. transplant_procedure
- id UUID PK
- tenant_id UUID FK
- recipient_id, donor_id
- procedure_date, transplant_type
- cold_ischemia_minutes, warm_ischemia_minutes
- vascular_anastomosis_time_min
- ureteral_stent_placed, foley_duration_days
- induction_agent, induction_dose
- surgeon_id, anesthesiologist_id
- estimated_blood_loss_ml, complications_intraop
- status

## 7. immunosuppression_log (HIGH-ALERT)
- id UUID PK
- tenant_id UUID FK
- patient_id, encounter_id
- drug_name (TACROLIMUS|CYCLOSPORINE|MMF|PREDNISONE|SIROLIMUS)
- dose_mg, frequency, route
- trough_level_ng_ml, trough_date
- prescriber_id, pharmacist_verified_id (DUAL)
- started_at, stopped_at
- side_effects JSONB
- high_alert_flag TRUE

## 8. rejection_episodes
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- episode_date
- rejection_type (ACR|AMR|MIXED|CHRONIC_AMR|BORDERLINE)
- banff_grade (IA|IB|IIA|IIB|III|CAAMR)
- dsa_mfi_at_event JSONB
- treatment_given JSONB
- response (RESOLVED|PARTIAL|REFRACTORY)
- graft_outcome

## 9. protocol_biopsies
- id UUID PK
- tenant_id UUID FK
- transplant_id, patient_id
- biopsy_date, biopsy_type (PROTOCOL_3M|PROTOCOL_6M|PROTOCOL_12M|FOR_CAUSE)
- indication, cores_taken, glomeruli_count
- light_microscopy_findings JSONB
- immunofluorescence_findings JSONB
- electron_microscopy_findings JSONB
- sv40_immunostain (BK virus)
- c4d_score (0-3)
- banff_category
- pathologist_id
- report_url_phi_vault TEXT (per SNIP-03)

## 10. graft_surveillance
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- visit_date
- scr, egfr, urea, proteinuria_g_24h
- bk_virus_pcr_copies_ml, cmv_pcr_copies_ml
- dsa_panel JSONB
- tacrolimus_trough
- bp_systolic, bp_diastolic, weight_kg
- medication_adherence_pct
- alert_flags JSONB

## 11. post_transplant_infections
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- infection_date, pathogen
- infection_site, severity
- treatment JSONB
- hospitalization_required
- prophylaxis_status

## 12. long_term_followup
- id UUID PK
- tenant_id UUID FK
- patient_id, transplant_id
- years_post_transplant
- graft_function (FUNCTIONING|FAILED)
- comorbidities JSONB (HTN, DM, dyslipidemia, malignancy, CVD)
- medication_adherence
- qol_score (SF-36 or KDQOL)
- rehospitalizations_ytd
- last_biopsy_date, last_dsa_date

## 13. paired_exchange_pool
- id UUID PK
- tenant_id UUID FK
- donor_id, recipient_id
- pool_entry_date
- incompatibility_reason (ABOi|POS_XM|HIGH_cPRA)
- match_run_id
- match_offered_at
- match_accepted_at
- match_completed_at
- match_status (PENDING|MATCHED|ACCEPTED|REJECTED|TRANSPLANTED|EXPIRED)

## RLS Pattern (all 13)
`sql
ALTER TABLE {t} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {t} FORCE ROW LEVEL SECURITY;
CREATE POLICY {t}_tenant ON {t} USING (tenant_id = current_setting('app.tenant_id')::UUID);
`

---
*Section 04 of NEPH-002. SA voice. L1 DRAFT.*