/**
 * TIER3_GI-303 Hepatology Engine
 * Liver fibrosis assessment (NAFLD/HCV) + Hepatitis B treatment + Hepatitis C DAA + Cirrhosis decompensation (MELD-Na) + HCC staging (BCLC)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AASLD_HBV: 'AASLD HBV 2018', AASLD_HCV: 'AASLD HCV 2020', EASL_NAFLD: 'EASL NAFLD 2024' };

function fibrosisAssessmentNafldHcv(input) {
  const { age_years, bmi, diabetes_present, alt_level, ast_alt_ratio, platelets_count, fibroscan_kpa } = input;
  let fib4_score = (age_years * ast_alt_ratio) / (platelets_count * Math.sqrt(alt_level || 1));
  let fibrosis_interpretation = 'low_risk';
  if (fib4_score >= 2.67 || (fibroscan_kpa && fibroscan_kpa >= 9.5)) fibrosis_interpretation = 'high_risk_advanced_fibrosis';
  else if (fib4_score >= 1.3 || (fibroscan_kpa && fibroscan_kpa >= 7)) fibrosis_interpretation = 'intermediate_risk';
  return {
    fib4_score: fib4_score.toFixed(2), fibrosis_interpretation,
    next_step: fibrosis_interpretation === 'high_risk_advanced_fibrosis' ? 'gastroenterology_consultation_for_liver_biopsy_or_MRE_for_fibrosis_confirmation' : fibrosis_interpretation === 'intermediate_risk' ? 'consider_fibroscan_or_ELFTM_plus_or_liver_biopsy_to_clarify_fibrosis_stage' : 'continue_routine_monitoring_Q1_to_2_year_labs',
    treatment: fibrosis_interpretation === 'high_risk_advanced_fibrosis' ? 'lifestyle_modification_plus_consider_resmetirom_for_MASH_with_F2_to_F3_fibrosis_or_piopropenate_for_MASH' : 'lifestyle_modification_weight_loss_7_to_10pct_diabetes_control',
    monitoring: fibrosis_interpretation === 'high_risk_advanced_fibrosis' ? 'consider_HCC_screening_liver_US_Q6_months_with_AFP_Q6_months' : 'routine_care',
    citation: CITATIONS.EASL_NAFLD,
  };
}

function hepatitisBTreatment(input) {
  const { hbeag_status, alt_level, hbvdna_level_iu_ml, hbsag_positive, treatment_naive, liver_fibrosis_stage } = input;
  let treatment_indicated = false;
  if (hbvdna_level_iu_ml >= 2000 && alt_level >= 80 && treatment_naive === 'yes') treatment_indicated = true;
  if (liver_fibrosis_stage === 'F2_or_greater') treatment_indicated = true;
  if (hbeag_status === 'negative' && hbvdna_level_iu_ml >= 2000 && alt_level >= 80) treatment_indicated = true;
  return {
    treatment_indicated, treatment_naive, hbvdna_level_iu_ml,
    first_line_agent: 'tenofovir_alafenamide_or_tenofovir_disoproxil_fumarate_or_entecavir_first_line',
    contraindications: 'nucleosides_or_nucleotides_used_lifelong_monitoring_creatinine_phosphate_for_tenofovir',
    monitoring: 'LFTs_Q3_months_for_first_year_then_Q6_months_HBVDNA_Q6_months',
    screening_for_complications: 'liver_imaging_and_AFP_Q6_months_if_cirrhosis_or_advanced_fibrosis_or_high_risk_for_HCC',
    special_populations: ['pregnancy_tenofovir_safe', 'HIV_coinfection_tenofovir_combined_with_HIV_regimen', 'preventive_antiviral_for_immunosuppressed_HSCT_recipients'],
    citation: CITATIONS.AASLD_HBV,
  };
}

function hepatitisCDaaTherapy(input) {
  const { hcv_genotype, hcv_rna_iu_ml, fibrosis_stage, prior_treatment_experienced, renal_function, hbv_coinfection } = input;
  let treatment = 'glecaprevir_pibrentasvir_8_weeks_for_non_cirrhotic_or_12_weeks_with_cirrhosis_GT1_to_6';
  if (hcv_genotype === '3') treatment = 'sofosbuvir_velpatasvir_12_weeks';
  if (prior_treatment_experienced === 'yes') treatment = 'consider_retreatment_with_3_DAA_regimen_sofosbuvir_velpatasvir_plus_voxilaprevir_12_weeks';
  if (renal_function === 'egfr_lt_30') treatment = 'glecaprevir_pibrentasvir_safe_in_advanced_CKD_no_need_for_dose_adjustment';
  return {
    treatment, hcv_genotype, fibrosis_stage, hcv_rna_iu_ml,
    pretreatment_workup: ['HCV_RNA_quantitative', 'hepatitis_B_serology_HAV', 'liver_imaging', 'renal_function', 'CBC_CMP', 'HIV_serology'],
    monitoring: 'HCV_RNA_Q4_weeks_during_treatment_Q12_weeks_post_treatment_for_SVR12',
    target: 'SVR12_sustained_virologic_response_12_weeks_post_treatment_indicates_cure',
    drug_drug_interactions: 'screen_DAA_with_all_medications_especially_anticoagulants_statins_anticonvulsants',
    citation: CITATIONS.AASLD_HCV,
  };
}

function cirrhosisDecompensationMeldNa(input) {
  const { bilirubin_mg_dl, inr_value, creatinine_mg_dl, sodium_meq_l, dialysis_2x_past_7_days, ascites_present, hepatic_encephalopathy_grade } = input;
  let meld_na = 3.78 * Math.log(bilirubin_mg_dl) + 11.2 * Math.log(inr_value) + 9.57 * Math.log(creatinine_mg_dl) + 6.43;
  if (sodium_meq_l < 137) meld_na += 1.59 * (137 - sodium_meq_l);
  meld_na = Math.round(meld_na);
  let risk_category = 'compensated_cirrhosis';
  if (ascites_present === 'yes' || hepatic_encephalopathy_grade >= 2) risk_category = 'decompensated_cirrhosis';
  return {
    meld_na_score: meld_na, risk_category, meld_na_target_for_transplant_listing: meld_na >= 15 ? 'yes_meld_15_or_above_per_UNOS_for_transplant_listing' : 'no_continue_monitoring',
    immediate_intervention: ascites_present === 'yes' ? 'large_volume_paracentesis_with_albumin_8g_per_L_removed_or_diuretics_spironolactone_and_furosemide_in_ratio_100_to_40' : hepatic_encephalopathy_grade >= 2 ? 'lactulose_titration_to_2_to_3_stools_per_day_plus_rifaximin_550mg_BID_for_recurrent' : 'no_immediate_intervention',
    survival_estimate: meld_na >= 40 ? '3_month_mortality_50_to_70pct' : meld_na >= 30 ? '3_month_mortality_20_to_30pct' : meld_na >= 15 ? '3_month_mortality_5_to_10pct' : '3_month_mortality_lt_5pct',
    citation: CITATIONS.AASLD_HCV,
  };
}

function hepatocellularCarcinomaBclc(input) {
  const { liver_function_status, performance_status, tumor_size_cm, tumor_count, vascular_invasion_present, metastasis_present } = input;
  let stage = 'BCLC_A_early';
  if (metastasis_present === 'yes' || performance_status >= 2) stage = 'BCLC_C_advanced';
  else if (vascular_invasion_present === 'yes' || tumor_size_cm >= 5) stage = 'BCLC_B_intermediate';
  else if (tumor_count >= 3) stage = 'BCLC_B_intermediate';
  let treatment = 'surgical_resection_or_ablation_for_BCLC_A';
  if (stage === 'BCLC_B_intermediate') treatment = 'TACE_trans_arterial_chemoembolization';
  else if (stage === 'BCLC_C_advanced') treatment = 'systemic_therapy_atezolizumab_plus_bevacizumab_or_durvalumab_or_sorafenib_or_lenvatinib';
  return {
    stage, treatment, tumor_size_cm, tumor_count,
    transplant_consideration: 'milan_criteria_1_tumor_lt_5cm_or_3_tumors_each_lt_3cm_without_vascular_invasion_for_liver_transplant',
    surveillance: 'liver_imaging_US_Q3_to_6_months_AFP_Q3_months_for_high_risk_cirrhotic_patients',
    citation: CITATIONS.AASLD_HBV,
  };
}

module.exports = { fibrosisAssessmentNafldHcv, hepatitisBTreatment, hepatitisCDaaTherapy, cirrhosisDecompensationMeldNa, hepatocellularCarcinomaBclc, CITATIONS, ValidationError };