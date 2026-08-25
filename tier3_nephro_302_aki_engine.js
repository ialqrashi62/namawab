/**
 * TIER3_NEPHRO-302 Acute Kidney Injury (AKI) Engine
 * AKI staging (KDIGO) + Pre-renal vs intrinsic vs post-renal + AKI workup + RRT initiation criteria + Contrast-induced AKI prevention
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_AKI: 'KDIGO AKI 2012' };

function akiStagingKdigo(input) {
  const { baseline_serum_creatinine, current_serum_creatinine, urine_output_ml_per_kg_per_h_6h, urine_output_ml_per_kg_per_h_12h, urine_output_ml_per_kg_per_h_24h } = input;
  const creatinine_rise_ratio = current_serum_creatinine / (baseline_serum_creatinine || 1);
  let stage = 'no_aki';
  if (creatinine_rise_ratio >= 3 || current_serum_creatinine >= 4 || dialysis_initiated === 'yes' || (urine_output_ml_per_kg_per_h_24h < 0.3 || anuria_for_12h)) stage = 'stage_3_severe_aki';
  else if (creatinine_rise_ratio >= 2 || current_serum_creatinine >= 2.5 || (urine_output_ml_per_kg_per_h_12h < 0.5)) stage = 'stage_2_moderate_aki';
  else if (creatinine_rise_ratio >= 1.5 || (urine_output_ml_per_kg_per_h_6h < 0.5)) stage = 'stage_1_mild_aki';
  return {
    aki_stage: stage, creatinine_rise_ratio: creatinine_rise_ratio.toFixed(2),
    immediate_workup: ['urine_output_monitoring_Q1h', 'urine_electrolytes_and_osmolality', 'urine_microscopy_for_casts_RBCs_crystals', 'FENa_or_FEUrea_for_intrinsic_vs_pre_renal', 'renal_ultrasound_if_obstruction_suspected', 'serum_electrolytes_Q6_to_12h', 'CBC_CMP_LDH_haptoglobin_if_hemolysis_suspected'],
    disposition: stage === 'stage_3_severe_aki' ? 'admit_for_monitoring_consider_RRT' : 'monitor_Q6_to_12h_as_outpatient_or_admit_per_clinical',
    citation: CITATIONS.KDIGO_AKI,
  };
}

function preRenalVsIntrinsicVsPostRenal(input) {
  const { fen_a_pct, urine_sodium_meq_l, fe_urea_pct, bun_creatinine_ratio, specific_gravity, sediment_findings, obstruction_present_on_imaging } = input;
  let classification = 'undetermined';
  if (obstruction_present_on_imaging === 'yes') classification = 'post_renal_obstructive_uropathy';
  else if (fen_a_pct < 1 && urine_sodium_meq_l < 20 && specific_gravity > 1.020 && sediment_findings === 'hyaline_casts_or_clear') classification = 'pre_renal_azotemia';
  else if (fen_a_pct >= 2 || fe_urea_pct >= 50 || urine_sodium_meq_l > 40) classification = 'intrinsic_renal_ATN_or_glomerular_disease';
  return {
    classification, fen_a_pct, urine_sodium_meq_l, bun_creatinine_ratio,
    treatment: (classification === 'pre_renal_azotemia') ? 'volume_resuscitation_with_isotonic_crystal_then_reassess_consider_diuretic_if_overload' : (classification === 'intrinsic_renal_ATN_or_glomerular_disease') ? 'avoid_nephrotoxins_address_underlying_cause_renal_biopsy_if_uncertain' : 'urgent_decompression_via_ureteral_stent_or_percutaneous_nephrostomy',
    pretest: bun_creatinine_ratio >= 20 ? 'suggests_pre_renal' : bun_creatinine_ratio < 10 ? 'suggests_intrinsic_low_reabsorption' : 'indeterminate',
    citation: CITATIONS.KDIGO_AKI,
  };
}

function akiWorkupStandardized(input) {
  const { aki_etiology_suspected, oliguria_present, dialysis_needed, metabolic_acidosis, hyperkalemia_severe, volume_status, nephrotoxin_exposure } = input;
  let management = 'supportive_care_avoid_nephrotoxins_adjust_doses_per_egfr';
  if (dialysis_needed === 'yes' || hyperkalemia_severe === 'yes' || metabolic_acidosis === 'yes' || volume_overload_unresponsive) management = 'urgent_RRT_consultation';
  return {
    management, aki_etiology_suspected,
    immediate_interventions: ['discontinue_nephrotoxins_NSAIDs_aminoglycosides_contrast_drugs', 'optimize_volume_status_with_crystalloid_or_diuretic', 'correct_electrolyte_acid_base_disturbances', 'monitor_urine_output_Q1h_vital_signs_Q4h', 'serum_creatinine_Q6_to_12h'],
    indications_for_urgent_RRT: ['refractory_hyperkalemia_K_above_6.5_or_rising', 'severe_metabolic_acidosis_pH_lt_7.1_or_HCO3_lt_8', 'volume_overload_unresponsive_to_diuretics', 'uremic_complications_pericarditis_encephalopathy_bleeding', 'intoxications_dialyzable_drugs'],
    prevention: ['limit_contrast_use_hydrate_with_normal_saline_pre_and_post', 'avoid_NSAIDs_in_volumedepleted_or_renally_impaired', 'dose_adjust_medications_per_egfr'],
    citation: CITATIONS.KDIGO_AKI,
  };
}

function rrtInitiationCriteria(input) {
  const { serum_potassium_meq_l, serum_bicarbonate_meq_l, ph_value, pao2_fio2_ratio, urine_output_ml_per_24h, serum_urea_nitrogen_mg_dl, refractory_acid_base } = input;
  let criteria_met = false;
  let reason_list = [];
  if (serum_potassium_meq_l >= 6.5) { criteria_met = true; reason_list.push('hyperkalemia_K_above_6.5'); }
  if (ph_value <= 7.1) { criteria_met = true; reason_list.push('severe_acidosis_pH_lt_7.1'); }
  if (serum_bicarbonate_meq_l < 8) { criteria_met = true; reason_list.push('severe_acidosis_HCO3_lt_8'); }
  if (urine_output_ml_per_24h < 100) { criteria_met = true; reason_list.push('oliguria_below_100ml_per_24h'); }
  return {
    rrt_indicated: criteria_met, reason_list, serum_potassium_meq_l, serum_bicarbonate_meq_l, ph_value,
    modality: criteria_met ? 'continuous_RRT_if_hemodynamically_unstable_or_intermittent_hemodialysis_if_stable' : 'continue_medical_management',
    buffer: 'bicarbonate_replacement_in_CVVH_to_correct_acidosis',
    citrate: 'regional_citrate_anticoagulation_preferred_in_CVVH_to_avoid_heparin_bleeding',
    timing: criteria_met ? 'initiate_within_1_to_2_hours_of_indications' : 'monitor_Q4h_to_Q6h',
    citation: CITATIONS.KDIGO_AKI,
  };
}

function contrastInducedAkiPrevention(input) {
  const { egfr_ml_min_1_73m2, age_years, diabetes_status, contrast_volume_ml, heart_failure_present, dehydration_status, planned_imaging } = input;
  let prevention = 'normal_saline_1mL_per_kg_per_h_12h_pre_and_12h_post_contrast_if_normal_risk';
  if (egfr_ml_min_1_73m2 < 60 || diabetes_status === 'yes') prevention = 'IV_isotonic_crystal_1mL_per_kg_per_h_pre_and_post_contrast_minimize_contrast_volume_consider_alternative_imaging';
  if (egfr_ml_min_1_73m2 < 30) prevention = 'consider_alternative_imaging_or_use_contrast_with_extreme_caution_consult_nephrology_for_urgent_imaging';
  return {
    prevention, egfr_ml_min_1_73m2, contrast_volume_ml,
    iso_osmolar_contrast: 'iodixanol_or_others_iso_osmolar_reduces_CIAKi_in_high_risk',
    n_acetylcysteine: 'evidence_weak_no_clear_benefit_in_high_quality_RCTs_but_may_be_used_in_combination_with_hydration_for_high_risk',
    monitoring: 'serum_creatinine_48_to_72h_post_contrast',
    outpatient_protocol: 'premedicate_with_IV_crystal_3mL_per_kg_per_h_1h_pre_contrast_then_1mL_per_kg_per_h_6h_post_then_continue_outpatient_normal_saline_or_PO_fluids',
    citation: CITATIONS.KDIGO_AKI,
  };
}

module.exports = { akiStagingKdigo, preRenalVsIntrinsicVsPostRenal, akiWorkupStandardized, rrtInitiationCriteria, contrastInducedAkiPrevention, CITATIONS, ValidationError };