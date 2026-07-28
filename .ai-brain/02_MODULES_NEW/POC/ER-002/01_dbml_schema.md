<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 DBML Schema (14 tables)

## 1. trauma_activations
- id, tenant_id, encounter_id
- activation_tier (1|2|3)
- activated_at, activated_by
- mechanism, criteria_met JSONB
- team_notified JSONB
- status

## 2. trauma_primary_survey
- id, tenant_id, encounter_id
- survey_type (ATLS_PRIMARY|ATLS_SECONDARY)
- airway, breathing, circulation, disability, exposure
- gcs_eye, gcs_verbal, gcs_motor, gcs_total
- recorded_at, recorded_by

## 3. trauma_secondary_survey
- id, tenant_id, encounter_id
- head_to_toe_findings
- past_medical_history
- allergies, medications, last_meal
- events_leading
- recorded_at

## 4. trauma_injuries_ais
- id, tenant_id, encounter_id
- body_region, ais_severity, ais_descriptor
- injury_description_encrypted (PHI)
- laterality, penetrating
- coding_by, coding_reviewed_by (MD-cosign if AIS>3)

## 5. trauma_iss_score
- id, tenant_id, encounter_id
- iss_total, max_ais, three_highest_ais JSONB
- mortality_band
- calculated_at, calculated_by
- formula_version

## 6. trauma_mtp_activations
- id, tenant_id, encounter_id
- activated_at, activated_by
- trigger_reason, abc_score
- lab_values JSONB
- units_ordered JSONB, units_transfused JSONB
- ratio_1to1to1_compliance
- terminated_at, terminated_by, termination_reason
- total_prbc, total_ffp, total_platelets, total_cryo

## 7. trauma_operative_log
- id, tenant_id, encounter_id
- procedure_time, procedure_name
- surgeon_id, anesthesia_id
- asa_class, approach
- estimated_blood_loss
- complications
- operative_time_min

## 8. trauma_transfers_in
- id, tenant_id, encounter_id
- sending_facility, sending_provider
- transfer_mode, transfer_time
- referring_diagnosis_encrypted (PHI)
- records_received

## 9. trauma_transfers_out
- id, tenant_id, encounter_id
- receiving_facility, receiving_provider
- transfer_mode, decision_time, departure_time
- capability_gap
- clinical_summary_encrypted (PHI)
- image_count_sent

## 10. trauma_registry_export
- id, tenant_id, export_batch_id
- ntdb_compliant
- exported_at, exported_by
- record_count, sha256_hash

## 11. trauma_pi_cases
- id, tenant_id, encounter_id
- opened_at, opened_by
- deviation_type, contributing_factors JSONB
- action_items JSONB
- loop_closed_at, loop_closed_by
- fmea_link, sentinel_event

## 12. trauma_outreach_events
- id, tenant_id, event_date
- event_type, audience
- participants_count, materials_distributed
- cost_sar, organizer

## 13. trauma_research_projects
- id, tenant_id, project_title, pi_name
- irb_number, status
- enrollment_target, current_enrollment
- publications, start_date, end_date

## 14. trauma_prevention_programs
- id, tenant_id, program_name
- target_population, delivery_mode
- reach_count, period_start, period_end
- kpis JSONB

## RLS: all 14 with FORCE ROW LEVEL SECURITY