/**
 * TIER3_ER-305 Emergency Observation Unit Engine
 * Observation unit admission criteria + Chest pain observation protocol + Syncope observation + Atrial fibrillation observation + Observation disposition decision
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACEP: 'ACEP Observation Medicine 2024', SHM: 'Society of Hospital Medicine 2024' };

function observationAdmissionCriteria(input) {
  const { working_diagnosis, expected_los_hours, requires_24h_monitoring, intensity_low, comorbidities_unstable, requires_active_intervention } = input;
  const meets_criteria = requires_24h_monitoring === 'yes' && intensity_low === 'yes' && comorbidities_unstable === 'no' && expected_los_hours <= 24 && working_diagnosis !== 'uncertain_high_risk';
  return {
    admission_to_observation_appropriate: meets_criteria,
    reason: meets_criteria ? 'meets_observation_unit_criteria' : 'consider_inpatient_admission_or_discharge_with_follow_up',
    expected_los_hours, working_diagnosis,
    intervention_required: requires_active_intervention,
    observation_unit_benefits: ['avoid_inpatient_admission_for_selected_patients', 'reduce_length_of_stay', 'improve_patient_throughput', 'reduce_costs'],
    citation: CITATIONS.ACEP,
  };
}

function chestPainObservation(input) {
  const { initial_troponin, ecg_findings, heinz_score, repeat_troponin_planned, grace_score } = input;
  let disposition = 'observe_in_unit';
  if (initial_troponin === 'elevated' || ecg_findings === 'st_elevation') disposition = 'admit_for_acute_coronary_syndrome';
  else if (heinz_score <= 3 && repeat_troponin_planned === 'yes' && grace_score && grace_score < 109) disposition = 'stress_test_or_ct_coronary_angiography_then_discharge';
  return {
    disposition, initial_troponin, ecg_findings, heinz_score, grace_score,
    observation_protocol: ['serial_troponin_Q3_to_6h_x_2', 'continuous_telemetry', 'aspirin_and_statin_per_protocol', 'risk_stratification_with_HEART_or_GRACE_score', 'stress_test_or_CT_coronary_angiography_if_low_to_intermediate_risk', 'cardiology_consultation_if_intermediate_to_high_risk'],
    length_of_stay_target: '24_hours_or_less',
    citation: CITATIONS.ACEP,
  };
}

function syncopeObservation(input) {
  const { cardiac_history, ecg_findings, troponin, orthostatic_changes, symptom_during_attempt } = input;
  let disposition = 'observe_in_unit';
  if (ecg_findings === 'abnormal_brugada_or_long_QT_or_arvd') disposition = 'admit_for_cardiac_syncope_evaluation';
  else if (cardiac_history === 'heart_failure_or_chf') disposition = 'admit_for_cardiac_syncope_evaluation';
  else if (orthostatic_changes === 'positive' && symptom_during_attempt === 'yes') disposition = 'discharge_with_diagnosis_orthostatic_hypotension';
  else if (troponin === 'elevated') disposition = 'admit_for_cardiac_evaluation';
  return {
    disposition, cardiac_history, ecg_findings, orthostatic_changes,
    observation_protocol: ['continuous_telemetry_Q12_to_24h', 'orthostatic_vital_signs', 'echocardiogram_if_undiagnosed', 'review_medications_causing_hypotension', 'fall_precautions'],
    admission_indications: ['abnormal_ECG', 'history_of_heart_failure_or_arrhythmia', 'elevated_troponin', 'anemia', 'syncope_during_exertion'],
    citation: CITATIONS.ACEP,
  };
}

function atrialFibrillationObservation(input) {
  const { chads2vasc_score, symptom_severity, hemodynamic_status, duration_afib_hours, anticoagulation_status } = input;
  let disposition = 'observe_in_unit';
  if (hemodynamic_status === 'unstable') disposition = 'admit_for_cardioversion_or_rate_control';
  else if (duration_afib_hours <= 48 && symptom_severity === 'significant' && anticoagulation_status === 'started') disposition = 'cardioversion_in_observation_unit';
  else if (chads2vasc_score >= 2 && anticoagulation_status === 'pending') disposition = 'admit_for_anticoagulation_initiation';
  return {
    disposition, chads2vasc_score, symptom_severity, duration_afib_hours,
    observation_protocol: ['rate_control_with_b_blocker_or_diltiazem', 'anticoagulation_initiation_with_DOAC_preferred', 'echocardiogram', 'cardiology_consultation_for_rhythm_control_strategy'],
    targets: ['ventricular_rate_less_than_110_bpm_at_rest', 'symptom_improvement', 'safe_discharge_with_anticoagulation'],
    citation: CITATIONS.SHM,
  };
}

function observationDispositionDecision(input) {
  const { observation_los_hours, primary_diagnosis_resolved, criteria_met_for_discharge, new_concerns, social_support_for_discharge } = input;
  let decision = 'continue_observation';
  if (primary_diagnosis_resolved === 'yes' && criteria_met_for_discharge === 'yes' && new_concerns === 'no') decision = 'discharge_home_with_follow_up';
  else if (observation_los_hours >= 24 && primary_diagnosis_resolved === 'no' && criteria_met_for_discharge === 'no') decision = 'admit_to_inpatient';
  else if (social_support_for_discharge === 'inadequate' && new_concerns === 'yes') decision = 'extend_observation_consider_admission';
  return {
    decision, observation_los_hours,
    discharge_follow_up: decision === 'discharge_home_with_follow_up' ? ['PCP_follow_up_Q2_to_7_days', 'specialty_follow_up_if_needed', 'medication_reconciliation', 'return_precaution_instructions'] : 'continue_inpatient_or_observation_care',
    citation: CITATIONS.SHM,
  };
}

module.exports = { observationAdmissionCriteria, chestPainObservation, syncopeObservation, atrialFibrillationObservation, observationDispositionDecision, CITATIONS, ValidationError };