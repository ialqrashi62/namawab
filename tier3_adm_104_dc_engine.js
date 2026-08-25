/**
 * TIER3_ADM-104 Discharge Planning Engine
 * Discharge planning + Med reconciliation + Discharge summary + Follow-up arrangements + AMA
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHRQ_DC: 'AHRQ Project RED 2023', JC_DC: 'Joint Commission Discharge 2024' };

function dischargePlanning(input) {
  const { los_days, diagnosis, anticipated_disposition, caregiver_available, social_work_needed, equipment_needed_home_health, transportation, language_barrier, discharge_readiness_screen, expected_discharge_date } = input;
  let plan = 'begin_discharge_planning_at_admission_with_daily_assessment_of_barriers';
  if (anticipated_disposition === 'home_with_home_health') plan = 'coordinate_home_health_nursing_PT_OT_with_equipment_wound_care';
  if (anticipated_disposition === 'rehab_or_snf') plan = 'screen_for_rehab_or_SNF_acceptance_and_transport_date';
  if (anticipated_disposition === 'hospice') plan = 'hospice_referral_for_end_of_life_care_with_comfort_measures';
  return {
    plan,
    elements: ['anticipated_disposition_documented', 'caregiver_assessment', 'social_work_referral_for_psychosocial_barriers', 'home_health_coordination', 'patient_education_disease_specific', 'medication_reconciliation', 'follow_up_appointments', 'transportation_arrangement'],
    teach_back: 'teach_back_method_for_disease_self_management_and_warning_signs_red_flags',
    citation: CITATIONS.AHRQ_DC,
  };
}

function medicationReconciliationDischarge(input) {
  const { admission_medications, discharge_medications, medications_changed, high_risk_medications, new_medications_education, formulations_changed, formulary_changes_with_insurance, allergies_recheck, follow_up_lab_monitoring } = input;
  let plan = 'medication_reconciliation_completed_with_admission_meds_discontinued_continued_or_modified_documented';
  let high_risk_action = 'highlight_high_risk_medications_anticoagulants_antiplatelets_insulin_opioids_digoxin';
  if (high_risk_medications === 'yes') high_risk_action = 'individualized_patient_education_with_demonstration_of_administration_plus_follow_up_phone_call_3d_post_discharge';
  return {
    plan, high_risk_action,
    elements: ['accurate_dose_route_frequency_duration', 'indication_for_each_medication', 'side_effects_to_report', 'interactions_avoid', 'follow_up_lab_monitoring_INR_for_warfarin_renal_for_diuretics', 'pill_organizer_or_pharmacy_delivery_setup'],
    follow_up: 'PCP_or_specialist_visit_within_7_to_14d_post_discharge_for_medication_review',
    citation: CITATIONS.JC_DC,
  };
}

function dischargeSummaryRequirements(input) {
  const { admission_diagnosis, hospital_course_documented, procedures_performed, complications, condition_at_discharge, medications_listed, follow_up_plan, pending_results_plan, allergies, code_status } = input;
  let required_elements = ['admission_diagnosis_and_reason', 'hospital_course_with_significant_events', 'procedures_with_findings', 'discharge_medications_with_indication', 'follow_up_appointments_within_7_to_14d', 'pending_results_with_action_plan', 'allergies_and_reactions', 'code_status', 'patient_family_education_completed'];
  let ready = admission_diagnosis === 'yes' && hospital_course_documented === 'yes' && procedures_performed === 'yes' && condition_at_discharge === 'yes' && medications_listed === 'yes' && follow_up_plan === 'yes';
  return {
    ready, required_elements,
    pending_results_plan: 'PCP_responsible_for_follow_up_within_24h_of_result_availability_or_specialist_if_consulted',
    patient_copy: 'patient_and_family_receive_written_summary_at_discharge_in_language_of_choice',
    pcp_copy: 'PCP_receives_summary_within_24h_fax_or_HIE_or_email',
    citation: CITATIONS.JC_DC,
  };
}

function followUpArrangements(input) {
  const { condition_requiring_follow_up, pcp_appointment_scheduled, specialist_appointment_scheduled, diagnostic_follow_up_imaging_labs, home_health_referral, transportation_barriers_resolved, financial_barriers_resolved, telephone_follow_up_planned } = input;
  let ready = pcp_appointment_scheduled === 'yes' || specialist_appointment_scheduled === 'yes';
  let plan = 'follow_up_appointment_within_7d_for_high_risk_within_14d_for_routine_with_PCP';
  if (diagnostic_follow_up_imaging_labs === 'yes') plan = 'arrange_outpatient_lab_or_imaging_within_2_to_4_weeks';
  if (home_health_referral === 'yes') plan = 'home_health_nurse_first_visit_within_48h_post_discharge';
  if (telephone_follow_up_planned === 'yes') plan = 'nurse_led_telephone_follow_up_within_48_to_72h_to_assess_symptoms_and_reinforce_plan';
  return {
    ready, plan,
    high_risk_follow_up: 'transition_coach_or_care_coordinator_for_high_risk_patients_with_multiple_comorbidities_or_polypharmacy',
    red_flags_education: 'patient_and_family_educated_on_warning_signs_when_to_seek_emergency_care',
    citation: CITATIONS.AHRQ_DC,
  };
}

function againstMedicalAdviceDischarge(input) {
  const { patient_capacity_documented, mental_capacity_assessment, risk_assessment, alternative_treatment_offered, informed_refusal_documented, witness_present, follow_up_offered_and_refused, lethality_assessment_done, family_or_support_notified } = input;
  let plan = 'AMA_form_signed_by_patient_and_witness_with_acknowledged_risks';
  let safety_plan = 'patient_advised_to_return_any_time_for_recurrence_provided_with_follow_up_resources_and_safe_discharge_instructions';
  if (mental_capacity_assessment === 'no') plan = 'if_patient_lacks_capacity_involuntary_hold_per_local_psychiatric_law_with_assessment';
  if (lethality_assessment_done === 'yes' && lethality_risk === 'high') plan = 'psychiatric_evaluation_before_discharge_or_involuntary_hold_per_local_law';
  return {
    plan, safety_plan,
    documentation: 'AMA_form_with_diagnosis_risks_acknowledged_alternatives_offered_patient_signature_witness_signature_physician_signature',
    follow_up: 'PCP_or_specialist_follow_up_still_offered_with_patient_acknowledgement',
    citation: CITATIONS.JC_DC,
  };
}

module.exports = { dischargePlanning, medicationReconciliationDischarge, dischargeSummaryRequirements, followUpArrangements, againstMedicalAdviceDischarge, CITATIONS, ValidationError };