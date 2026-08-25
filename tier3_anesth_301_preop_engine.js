/**
 * TIER3_ANESTH-301 Preoperative Assessment Engine
 * Preop cardiac risk (Revised Cardiac Risk Index) + Preop pulmonary risk (ARISCAT) + NPO status + Anticoagulation management + Preop testing selection
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACC_AHA: 'ACC/AHA Perioperative 2024', ESA: 'ESA Preop 2023' };

function revisedCardiacRiskIndex(input) {
  const { high_risk_surgery, ischemic_heart_disease, congestive_heart_failure, cerebrovascular_disease, diabetes_on_insulin, creatinine_mg_dl_gt_2 } = input;
  let score = 0;
  if (high_risk_surgery === 'yes') score += 1;
  if (ischemic_heart_disease === 'yes') score += 1;
  if (congestive_heart_failure === 'yes') score += 1;
  if (cerebrovascular_disease === 'yes') score += 1;
  if (diabetes_on_insulin === 'yes') score += 1;
  if (creatinine_mg_dl_gt_2 === 'yes') score += 1;
  let risk_pct = 0;
  if (score === 0) risk_pct = 0.4;
  else if (score === 1) risk_pct = 0.9;
  else if (score === 2) risk_pct = 6.6;
  else if (score === 3) risk_pct = 11;
  else risk_pct = 15;
  return {
    rcri_score: score, risk_of_cardiac_complication_pct: risk_pct,
    recommendation: score >= 2 ? 'consider_noninvasive_cardiac_testing_or_cardiology_consultation' : 'proceed_with_surgery_standard_monitoring',
    citation: CITATIONS.ACC_AHA,
  };
}

function ariscatPulmonaryRisk(input) {
  const { age_years, spo2_pct, respiratory_infection_last_month, preoperative_anemia, surgical_incision_type, surgery_duration_hours, emergency_surgery } = input;
  let score = 0;
  if (age_years >= 80) score += 6;
  else if (age_years >= 70) score += 4;
  else if (age_years >= 60) score += 3;
  else if (age_years >= 50) score += 2;
  if (spo2_pct >= 96) score += 0;
  else if (spo2_pct >= 91) score += 4;
  else if (spo2_pct <= 90) score += 8;
  if (respiratory_infection_last_month === 'yes') score += 5;
  if (preoperative_anemia === 'hb_lt_10') score += 3;
  if (surgical_incision_type === 'upper_abdominal') score += 4;
  else if (surgical_incision_type === 'intrathoracic') score += 5;
  if (surgery_duration_hours >= 3) score += 3;
  else if (surgery_duration_hours >= 2) score += 2;
  if (emergency_surgery === 'yes') score += 3;
  let risk_category = 'low_risk';
  if (score >= 65) risk_category = 'high_risk';
  else if (score >= 45) risk_category = 'moderate_risk';
  else if (score >= 26) risk_category = 'low_moderate_risk';
  return { ariscat_score: score, risk_category, recommendation: risk_category === 'high_risk' ? 'postop_ICU_or_high_dependence_unit_respiratory_physiotherapy_lung_expansion_interventions' : 'continue_standard_care_with_postop_respiratory_interventions', citation: CITATIONS.ESA };
}

function npoGuidelines(input) {
  const { intake_type, hours_since_intake, age_group } = input;
  let npo_status = 'clears';
  let ready_for_surgery = false;
  if (intake_type === 'clear_liquids' && hours_since_intake >= 2) { npo_status = 'clears_2h_compliant'; ready_for_surgery = true; }
  else if (intake_type === 'breast_milk' && hours_since_intake >= 4) { npo_status = 'breast_milk_4h_compliant'; ready_for_surgery = true; }
  else if (intake_type === 'non_human_milk' && hours_since_intake >= 6) { npo_status = 'non_human_milk_6h_compliant'; ready_for_surgery = true; }
  else if (intake_type === 'light_meal' && hours_since_intake >= 6) { npo_status = 'light_meal_6h_compliant'; ready_for_surgery = true; }
  else if (intake_type === 'heavy_meal_fatty' && hours_since_intake >= 8) { npo_status = 'heavy_meal_8h_compliant'; ready_for_surgery = true; }
  return {
    intake_type, hours_since_intake, age_group,
    npo_status, ready_for_surgery,
    additional_recommendation: age_group === 'pediatric' && intake_type === 'clear_liquids' ? 'pediatric_clear_liquids_still_2h_NPO_per_guidelines' : 'standard_NPO_per_ASA_guidelines',
    citation: CITATIONS.ASA,
  };
}

function anticoagulationPerioperativeManagement(input) {
  const { medication, surgical_bleeding_risk, renal_function, last_dose_hours } = input;
  let recommendation = 'continue_medication';
  if (surgical_bleeding_risk === 'high') {
    if (medication === 'warfarin') recommendation = 'bridge_with_low_molecular_weight_heparin_stop_warfarin_5d_preop_check_inr_preop';
    else if (medication === 'apixaban_or_rivaroxaban') recommendation = 'stop_24_to_48h_preop_renal_function_dose_dependent';
    else if (medication === 'dabigatran') recommendation = 'stop_24_to_72h_preop_renal_function_dependent_consider_idarucizumab_reversal';
    else if (medication === 'aspirin_81mg') recommendation = 'continue_if_high_cardiovascular_risk_or_consider_stopping_7d_preop_for_high_bleeding_risk_surgery';
    else if (medication === 'clopidogrel') recommendation = 'stop_5_to_7d_preop_consider_continuing_if_high_cardiovascular_risk';
    else if (medication === 'ticagrelor') recommendation = 'stop_5d_preop';
    else if (medication === 'prasugrel') recommendation = 'stop_7d_preop';
  }
  return {
    medication, surgical_bleeding_risk, renal_function, last_dose_hours,
    recommendation, last_dose_status: last_dose_hours,
    monitoring: medication === 'warfarin' ? 'INR_preop_target_less_than_1.5' : 'no_monitoring_needed',
    citation: CITATIONS.ACC_AHA,
  };
}

function preopTestingSelection(input) {
  const { asa_class, surgery_invasiveness, age_years, known_comorbidities, surgery_type } = input;
  const tests_needed = [];
  if (asa_class === 'class_3' || asa_class === 'class_4' || age_years >= 65) tests_needed.push('ECG_within_3_months');
  if (known_comorbidities === 'pulmonary_disease' || age_years >= 65) tests_needed.push('chest_xray');
  if (known_comorbidities === 'renal_disease' || known_comorbidities === 'diabetes') tests_needed.push('basic_metabolic_panel_BMP');
  if (known_comorbidities === 'liver_disease' || known_comorbidities === 'anticoagulation') tests_needed.push('coagulation_studies_PT_INR_aPTT_platelet_count');
  if (known_comorbidities === 'anemia' || surgery_type === 'high_blood_loss_risk') tests_needed.push('CBC_type_and_screen');
  return {
    tests_needed, asa_class, surgery_invasiveness, age_years, known_comorbidities,
    note: 'evidence_does_not_support_routine_preop_testing_for_asymptomatic_low_risk_patients_specific_indications_only',
    citation: CITATIONS.ESA,
  };
}

module.exports = { revisedCardiacRiskIndex, ariscatPulmonaryRisk, npoGuidelines, anticoagulationPerioperativeManagement, preopTestingSelection, CITATIONS, ValidationError };