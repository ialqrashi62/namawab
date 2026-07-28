<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-003 DBML (8 tables)

## 1. ep_procedures
- id, tenant_id, patient_id, encounter_id
- procedure_type (EP_STUDY|SVT_ABLATION|AF_ABLATION|VT_ABLATION|ICD_IMPLANT|PPM_IMPLANT|CRT_D|LEAD_EXTRACTION|GENERATOR_CHANGE)
- indication, urgency
- operator_user_id, assistant_user_id
- status, procedure_date
- findings_encrypted, complications jsonb
- cpt_codes jsonb

## 2. ep_study_findings
- id, tenant_id, procedure_id
- arrhythmia_induced, mechanism (AVNRT|AVRT|AFL|AF|VT)
- cycle_length_ms, ah_interval, hv_interval
- successful_ablation bool, recurrence_30d
- fluoroscopy_min, rf_time_min

## 3. device_registry (FDA-tracked, lifetime)
- id, tenant_id, patient_id
- udi, manufacturer, model
- device_type (PPM_SINGLE|PPM_DUAL|ICD_SINGLE|ICD_DUAL|CRT_D|LEADLESS_PPM)
- serial, batch_lot, implant_date
- generator_battery_indicator (BOL|ERI|EOL)
- mri_conditional bool
- lifetime_under_warranty

## 4. device_leads
- id, tenant_id, device_id
- lead_type (RA|RV|LV)
- manufacturer, model, serial
- implant_date, status
- threshold_v, sensing_mv, impedance_ohm
- last_followup_date

## 5. device_remote_monitoring
- id, tenant_id, device_id, transmission_date
- alert_type (ATRIAL_FIB|VT_EPISODE|SHOCK_DELIVERED|LOW_BATTERY|LEAD_IMPEDANCE_HIGH)
- episode_details jsonb
- action_taken, action_by

## 6. device_followup
- id, tenant_id, device_id
- followup_date, followup_type (IN_PERSON|REMOTE)
- battery_voltage, lead_thresholds jsonb
- events (shocks, ATP, mode switches)
- reprogramming_done, reprogramming_details

## 7. ep_red_flags
- id, tenant_id, procedure_id
- flag_type (tamponade|av_block|esophageal_injury|pv_stenosis|phrenic_injury)
- detected_at, response_action, response_time_seconds

## 8. ep_audit_log (hash-chained)
- id, tenant_id, procedure_id
- action, input_hash, output_hash, prev_hash

All 8 with FORCE ROW LEVEL SECURITY.