/**
 * TIER3_GI-304 Pancreas / Biliary Engine
 * Acute pancreatitis severity (BISAP) + Chronic pancreatitis + Gallstone disease + Cholangitis (Tokyo) + Biliary stricture
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACG_AP: 'ACG Acute Pancreatitis 2024', TOKYO: 'Tokyo Guidelines 2018 (TG18) 2021 Update' };

function acutePancreatitisBisap(input) {
  const { bun_mg_dl_gt_25_or_rising, impaired_mental_status, sirs_present, age_years, pleural_effusion_present } = input;
  let bisap_score = 0;
  if (bun_mg_dl_gt_25_or_rising === 'yes') bisap_score += 1;
  if (impaired_mental_status === 'yes') bisap_score += 1;
  if (sirs_present === 'yes') bisap_score += 1;
  if (age_years >= 60) bisap_score += 1;
  if (pleural_effusion_present === 'yes') bisap_score += 1;
  let severity = 'mild_predictable_low_mortality';
  if (bisap_score >= 3) severity = 'severe_with_high_mortality_risk_15_to_30pct';
  else if (bisap_score >= 2) severity = 'moderate_mortality_risk_2_to_5pct';
  return {
    bisap_score, severity,
    treatment: ['aggressive_IV_fluid_resuscitation_with_isotonic_crystal_LR_beneficial', 'pain_control_IV_opioid', 'NPO_with_advance_to_low_fat_diet_as_pain_resolves_and_enzymes_trending_down', 'early_oral_feeding_if_tolerating_and_pain_controlled_per_current_evidence', 'antibiotics_only_if_cholangitis_or_pancreatic_necrosis_with_suspected_infection'],
    severe_disease_management: ['ICU_admission_or_step_down', 'early_enteral_feeding_via_NGT_or_nasojejunal', 'contrast_CT_abdomen_at_72h_to_assess_necrosis', 'MRCP_if_gallstone_suspected', 'urgent_ERCP_with_sphincterotomy_for_cholangitis'],
    prognosis: 'mortality_3pct_overall_severe_disease_15_to_30pct',
    follow_up: 'lipase_Q1_to_2_days_during_acute_phase_then_Q3_months_Q1_year_imaging_for_etiology_workup',
    citation: CITATIONS.ACG_AP,
  };
}

function chronicPancreatitis(input) {
  const { epigastric_pain_chronic, weight_loss, malabsorption_diarrhea_fecal_fat, diabetes_new_onset_or_worsening, imaging_calcifications_or_ductal_changes, etiology_alcohol_or_other } = input;
  let classification = 'probable_chronic_pancreatitis';
  if (imaging_calcifications_or_ductal_changes === 'yes' && malabsorption_diarrhea_fecal_fat === 'yes') classification = 'chronic_pancreatitis_with_exocrine_insufficiency';
  return {
    diagnosis: classification, epigastric_pain_chronic, weight_loss,
    exocrine_insufficiency_workup: 'fecal_elastase_1_below_200mcg_per_g_diagnostic_for_PE_serum_b12_vitamin_D_levels',
    treatment: ['pancreatic_enzyme_replacement_therapy_25_to_75_thousand_units_lipase_per_meal', 'PPN_across_all_meals_typically_3_meals_plus_2_to_3_snacks', 'vitamin_D_supplementation_for_deficiency', 'fat_soluble_vitamins_A_D_E_K_monitoring_and_replacement', 'pain_management_multimodal_include_gabapentin_or_pregabalin_tramadol_or_nsaid', 'consider_endoscopic_therapy_or_surgery_for_persistent_pain_or_ductal_obstruction'],
    diabetes_management: 'consider_type_3c_diabetes_with_insulin_typically_required_as_insulin_secretion_fails',
    lifestyle: 'alcohol_cessation_smoking_cessation_small_frequent_meals',
    follow_up: 'CT_or_MRCP_Q6_to_12_months_fecal_elastase_annually',
    citation: CITATIONS.ACG_AP,
  };
}

function gallstoneDisease(input) {
  const { biliary_colic_episodes, common_bile_duct_stone_present, gallbladder_wall_thickening_present, gallstone_size_cm, comorbidity, symptomatic_frequency } = input;
  let cholecystectomy_indicated = false;
  if (biliary_colic_episodes === 'recurrent' || common_bile_duct_stone_present === 'yes' || gallstone_size_cm >= 2) cholecystectomy_indicated = true;
  return {
    cholecystectomy_indicated, gallstone_size_cm, common_bile_duct_stone_present,
    management: cholecystectomy_indicated ? 'laparoscopic_cholecystectomy_pre_operative_MRCP_or_EUS_if_CBD_stone_suspected_then_ERCP_with_sphincterotomy_pre_or_intra_op' : 'observation_with_avoidance_of_fatty_foods',
    cbst_management: common_bile_duct_stone_present === 'yes' ? 'ERCP_with_sphincterotomy_and_stone_extraction_then_laparoscopic_cholecystectomy_within_6_weeks' : 'no_intervention',
    asymptomatic_gallstones: 'no_cholecystectomy_recommended_for_asymptomatic_in_diabetics_or_high_operative_risk_can_observe_with_Q12_to_24_month_imaging',
    complications_to_recognize: ['cholecystitis', 'choledocholithiasis', 'gallstone_pancreatitis', 'cholangitis', 'Mirizzi_syndrome'],
    citation: CITATIONS.TOKYO,
  };
}

function acuteCholangitis(input) {
  const { charcot_triad_present, reynolds_pentad_present, white_blood_cell_count, bilirubin_mg_dl, imaging_biliary_dilation, mental_status_change } = input;
  let severity = 'no_cholangitis';
  if (charcot_triad_present === 'yes') severity = 'definite_acute_cholangitis_per_Tokyo_criteria';
  else if (reynolds_pentad_present === 'yes') severity = 'severe_cholangitis_with_sepsis_per_Tokyo_criteria';
  return {
    severity, charcot_triad_present, reynolds_pentad_present,
    tokyo_severity: reynolds_pentad_present === 'yes' ? 'grade_III_severe_with_organ_dysfunction' : charcot_triad_present === 'yes' && (wbc_above_12_or_bilirubin_above_5) ? 'grade_II_moderate' : 'grade_I_mild',
    immediate_management: ['IV_fluids_aggressive_resuscitation', 'broad_spectrum_antibiotics_piperacillin_tazobactam_or_ceftriaxone_plus_metronidazole', 'urgent_biliary_decompression_within_24_to_72h_with_ERCP_or_percutaneous_transhep_bial_drainage_PTBD'],
    surgery: 'cholecystectomy_after_recovery_within_6_weeks_if_gallstone_etiology',
    follow_up: 'clinical_review_with_Q2_week_liver_function_tests_post_ERCP_then_Q3M_first_year',
    prognosis: 'mortality_10_to_30pct_for_severe_untreated_with_sepsis_early_decompression_reduces_mortality',
    citation: CITATIONS.TOKYO,
  };
}

function biliaryStrictureManagement(input) {
  const { stricture_location, stricture_etiology, multiplicity_single_vs_multiple, stricture_pattern_focal_vs_long, prior_surgery, jaundice_present, weight_loss_present } = input;
  let suspected_malignancy = false;
  if (stricture_pattern_focal_vs_long === 'long' && weight_loss_present === 'yes' && jaundice_present === 'yes') suspected_malignancy = true;
  return {
    suspected_malignancy, stricture_etiology,
    workup: ['ERCP_with_brushing_for_cytology_and_forceps_biopsy', 'cholangiography_via_MRCP_or_EUS', 'consider_cholangiocarcinoma_workup_CA_19_9_AFP_CEA_and_EUS_with_FNA', 'consider_chromoendoscopy_or_peroral_cholangioscopy_for_indeterminate_strictures'],
    differential: ['cholangiocarcinoma', 'pancreatic_adenocarcinoma_head', 'post_surgical_benign_stricture', 'primary_sclerosing_cholangitis', 'IgG4_related_cholangitis'],
    treatment: suspected_malignancy === true ? 'surgical_resection_or_palliative_stenting_with_chemotherapy' : stricture_etiology === 'benign_post_surgical' ? 'endoscopic_dilation_and_stenting_with_elective_removal_Q3_to_6_months' : stricture_etiology === 'PSC' ? 'monitor_for_disease_progression_and_cholangiocarcinoma_screening_Q6M_MRCP' : 'refer_to_specialized_center_for_diagnostic_evaluation',
    citation: CITATIONS.TOKYO,
  };
}

module.exports = { acutePancreatitisBisap, chronicPancreatitis, gallstoneDisease, acuteCholangitis, biliaryStrictureManagement, CITATIONS, ValidationError };