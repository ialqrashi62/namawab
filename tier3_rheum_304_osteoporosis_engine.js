/**
 * TIER3_RHEUM-304 Osteoporosis / Musculoskeletal Engine
 * FRAX score + DXA interpretation + Osteoporosis treatment + Glucocorticoid-induced osteoporosis + Paget's disease of bone
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NOF: 'National Osteoporosis Foundation 2024', ACR_GIOP: 'ACR Glucocorticoid Induced 2023' };

function fraxScoreCalculation(input) {
  const { age_years, sex, weight_kg, height_cm, previous_fracture, parent_fracture_hip, smoking_current, glucocorticoids_current, ra_history, alcohol_3_units_per_day, femoral_neck_bmd_t_score } = input;
  let major_osteoporotic_fracture_pct = 0;
  let hip_fracture_pct = 0;
  if (previous_fracture === 'yes') major_osteoporotic_fracture_pct += 5;
  if (parent_fracture_hip === 'yes') hip_fracture_pct += 3;
  if (smoking_current === 'yes') major_osteoporotic_fracture_pct += 2;
  if (glucocorticoids_current === 'yes') major_osteoporotic_fracture_pct += 5;
  if (ra_history === 'yes') major_osteoporotic_fracture_pct += 2;
  if (femoral_neck_bmd_t_score <= -1) major_osteoporotic_fracture_pct += 5;
  else if (femoral_neck_bmd_t_score <= -2.5) major_osteoporotic_fracture_pct += 12;
  if (age_years >= 70) major_osteoporotic_fracture_pct += 8;
  else if (age_years >= 60) major_osteoporotic_fracture_pct += 4;
  return {
    major_osteoporotic_fracture_pct, hip_fracture_pct, age_years, femoral_neck_bmd_t_score,
    intervention_threshold: major_osteoporotic_fracture_pct >= 20 || hip_fracture_pct >= 3 || femoral_neck_bmd_t_score <= -2.5 ? 'treatment_indicated' : 'lifestyle_and_vitamin_d',
    treatment: 'bisphosphonates_alendronate_or_zoledronic_acid_or_Denosumab_or_teriparatide_for_severe',
    citation: CITATIONS.NOF,
  };
}

function dxaInterpretation(input) {
  const { lumbar_t_score, femoral_neck_t_score, forearm_t_score, age_years, fragility_fracture_history, secondary_osteoporosis_cause } = input;
  let lowest_t_score = Math.min(lumbar_t_score, femoral_neck_t_score, forearm_t_score || 0);
  let classification = 'normal';
  if (lowest_t_score <= -2.5 || fragility_fracture_history === 'hip_or_vertebral') classification = 'osteoporosis';
  else if (lowest_t_score <= -1) classification = 'osteopenia';
  return {
    classification, lowest_t_score, lumbar_t_score, femoral_neck_t_score,
    treatment: classification === 'osteoporosis' ? 'initiate_pharmacologic_therapy_bisphosphonate_first_line' : classification === 'osteopenia' ? (lowest_t_score <= -2 ? 'consider_pharmacologic_therapy_based_on_FRAX' : 'lifestyle_modification_D3_calcium_exercise') : 'lifestyle_modification_D3_calcium_exercise',
    fracture_risk: classification === 'osteoporosis' ? 'high_risk_for_fragility_fracture' : 'moderate_or_low',
    workup_for_secondary_osteoporosis: secondary_osteoporosis_cause === 'no_identified' ? ['TSH', 'PTH', 'vitamin_D_25_hydroxy', 'serum_calcium_phosphate', 'sex_hormones_in_men_or_postmenopausal_women', 'serum_protein_electrophoresis', '24h_urinary_calcium'] : 'workup_directed_by_clinical_suspicion',
    citation: CITATIONS.NOF,
  };
}

function osteoporosisTreatment(input) {
  const { fracture_history, t_score, frax_risk, renal_function, age_years, oral_intolerance, iv_intolerance, dental_procedure_planned } = input;
  let first_line = 'oral_alendronate_70mg_weekly_with_vitamin_D_and_calcium';
  if (oral_intolerance === 'yes') first_line = 'IV_zoledronic_acid_5mg_annually';
  if (iv_intolerance === 'yes' && oral_intolerance === 'yes') first_line = 'Denosumab_subcutaneous_60mg_every_6_months_noted_continuous_use_required';
  if (frax_risk >= 30 || fracture_history === 'multiple_vertebral') first_line = 'teriparatide_subcutaneous_daily_x_2_years_then_antiresorptive';
  return {
    first_line, fracture_history, t_score,
    duration: 'bisphosphonate_3_to_5_years_then_drug_holiday_with_re_evaluate_BMD_Q2_years',
    dental_pre_caution: dental_procedure_planned === 'yes' ? 'coordinate_with_dentist_to_avoid_invasive_procedures_while_on_antiresorptive_due_to_ONJ_risk' : 'regular_dental_hygiene',
    atypical_femur_fracture_warning: 'report_any_thigh_or_groin_pain_immediately',
    citation: CITATIONS.NOF,
  };
}

function glucocorticoidInducedOsteporosis(input) {
  const { glucocorticoid_dose_mg_prednisone_per_day, duration_months, age_years, postmenopausal, fragility_fracture_history, t_score } = input;
  let indication = false;
  if (glucocorticoid_dose_mg_prednisone_per_day >= 7.5 && duration_months >= 3) indication = true;
  if (fragility_fracture_history === 'yes') indication = true;
  if (t_score && t_score <= -1.5) indication = true;
  let treatment = 'lifestyle_vitamin_D_800_1000_IU_daily_calcium_1200_mg_per_day_weight_bearing_exercise';
  if (indication) treatment = 'bisphosphonate_alendronate_or_IV_zoledronic_acid_plus_lifestyle';
  return {
    indication, glucocorticoid_dose_mg_prednisone_per_day, duration_months, t_score,
    treatment, follow_up: 'BMD_Q1_year_after_initiating_therapy_then_Q2_year',
    fracture_risk_reduction: 'alendronate_reduces_vertebral_fracture_risk_in_GIOP',
    citation: CITATIONS.ACR_GIOP,
  };
}

function pagetsDiseaseOfBone(input) {
  const { alkaline_phosphatase_high, bone_pain_localized, xray_findings, bone_scan_extent, neurological_complications, cardiac_complications } = input;
  let pagets_likely = false;
  if (alkaline_phosphatase_high === 'yes' && xray_findings === 'cortical_thickening_bone_enlargement_osteolysis_sclerosis') pagets_likely = true;
  return {
    pagets_likely, alkaline_phosphatase_high,
    treatment: pagets_likely ? ['bisphosphonate_IV_zoledronic_acid_5mg_single_dose_preferred', 'oral_NSAID_for_pain', 'consider_calcitonin_if_bisphosphonate_contraindicated'] : 'observation',
    indications_for_treatment: ['bone_pain_at_paget_site', 'skull_or_spine_involvement_risk_for_neurologic', 'pre_surgery_to_active_paget_site', 'cardiac_complications_high_output_failure'],
    complications: ['pathologic_fracture', 'hearing_loss_with_skull_involvement', 'high_output_cardiac_failure', 'sarcoma_transformation_rare_less_than_1pct'],
    citation: CITATIONS.NOF,
  };
}

module.exports = { fraxScoreCalculation, dxaInterpretation, osteoporosisTreatment, glucocorticoidInducedOsteporosis, pagetsDiseaseOfBone, CITATIONS, ValidationError };