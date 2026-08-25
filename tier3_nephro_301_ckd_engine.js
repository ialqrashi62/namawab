/**
 * TIER3_NEPHRO-301 Chronic Kidney Disease (CKD) Engine
 * CKD staging (KDIGO) + CKD progression risk + Anemia management (EPO) + Mineral bone disorder + Hypertension in CKD
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_CKD: 'KDIGO CKD 2024', KDIGO_BP: 'KDIGO BP 2021' };

function ckdStagingKdigo(input) {
  const { egfr_ml_min_1_73m2, urine_albumin_to_creatinine_ratio_mg_g, structural_abnormality_on_imaging, biopsy_proven_kidney_disease, persistent_low_egfr_3_months } = input;
  let ckd_stage = 'no_ckd';
  if (egfr_ml_min_1_73m2 >= 90 && urine_albumin_to_creatinine_ratio_mg_g < 30) ckd_stage = 'G1_normal_or_high_other_markers_no_disease';
  else if (egfr_ml_min_1_73m2 >= 90 && urine_albumin_to_creatinine_ratio_mg_g >= 30) ckd_stage = 'G1_A_albuminuria_present';
  else if (egfr_ml_min_1_73m2 >= 60 && egfr_ml_min_1_73m2 < 90) ckd_stage = 'G2_mildly_decreased';
  else if (egfr_ml_min_1_73m2 >= 45 && egfr_ml_min_1_73m2 < 60) ckd_stage = 'G3a_mildly_to_moderately_decreased';
  else if (egfr_ml_min_1_73m2 >= 30 && egfr_ml_min_1_73m2 < 45) ckd_stage = 'G3b_moderately_to_severely_decreased';
  else if (egfr_ml_min_1_73m2 >= 15 && egfr_ml_min_1_73m2 < 30) ckd_stage = 'G4_severely_decreased';
  else if (egfr_ml_min_1_73m2 < 15) ckd_stage = 'G5_kidney_failure';
  let albuminuria_grade = 'A1_normal';
  if (urine_albumin_to_creatinine_ratio_mg_g >= 300) albuminuria_grade = 'A3_severely_increased';
  else if (urine_albumin_to_creatinine_ratio_mg_g >= 30) albuminuria_grade = 'A2_moderately_increased';
  return {
    ckd_stage, albuminuria_grade, egfr_ml_min_1_73m2,
    diagnosis: ckd_stage.startsWith('G') && ckd_stage !== 'G1_normal_or_high_other_markers_no_disease' && persistent_low_egfr_3_months === 'yes' ? 'CKD_confirmed' : 'further_evaluation_required',
    referral_to_nephrology: egfr_ml_min_1_73m2 < 30 || urine_albumin_to_creatinine_ratio_mg_g >= 300 || rapid_decline_egfr_gt_5ml_per_year ? 'yes' : 'no_primary_care_follow_up_Q6_to_12_months',
    citation: CITATIONS.KDIGO_CKD,
  };
}

function ckdProgressionRisk(input) {
  const { baseline_egfr_ml_min_1_73m2, current_egfr_ml_min_1_73m2, years_follow_up, urine_albumin_to_creatinine_ratio_mg_g, diabetes_status, hypertension_status, age_years } = input;
  const annual_decline = (baseline_egfr_ml_min_1_73m2 - current_egfr_ml_min_1_73m2) / (years_follow_up || 1);
  let risk = 'slow_progression';
  if (annual_decline >= 5) risk = 'rapid_progression';
  else if (annual_decline >= 3) risk = 'moderate_progression';
  return {
    annual_decline_ml_per_year: annual_decline.toFixed(2), risk,
    risk_factors: diabetes_status === 'yes' || hypertension_status === 'yes' || urine_albumin_to_creatinine_ratio_mg_g >= 300 ? 'modifiable_risk_factors_present' : 'limited_modifiable_risk_factors',
    intervention: ['optimize_BP_target_less_than_130_over_80_per_KDIGO', 'optimize_diabetes_control_with_SGLT2_inhibitor_preferred_in_CKD', 'consider_finerenone_in_CKD_with_diabetes_and_albuminuria', 'consider_ACE_inhibitor_or_ARB_for_albuminuria', 'avoid_nephrotoxins_NSAIDs_aminoglycosides_contrast_when_possible'],
    referral: risk === 'rapid_progression' ? 'urgent_nephrology_referral' : 'routine_nephrology_follow_up',
    citation: CITATIONS.KDIGO_CKD,
  };
}

function ckdAnemiaEpoManagement(input) {
  const { hemoglobin_g_dl, transferrin_saturation_pct, ferritin_ng_ml, egfr_ml_min_1_73m2, epo_use_planned, target_hemoglobin, current_esa_dose } = input;
  let epo_initiation = false;
  if (hemoglobin_g_dl < 10 && transferrin_saturation_pct >= 20 && ferritin_ng_ml >= 100 && egfr_ml_min_1_73m2 < 60) epo_initiation = true;
  let iron_repletion_needed = false;
  if (transferrin_saturation_pct < 20 || ferritin_ng_ml < 100) iron_repletion_needed = true;
  let epo_dosing = 'darbepoetin_alfa_0.45mcg_per_kg_Q4_weeks_or_methoxy_polyethylene_glycol_epoetin_beta_0.6mcg_per_kg_Q2_weeks';
  if (current_esa_dose) epo_dosing = 'titrate_ESA_to_maintain_target_Hgb_Q1_month_dose_adjust_per_response';
  return {
    epo_initiation_indicated: epo_initiation, iron_repletion_needed,
    hemoglobin_g_dl, target_hemoglobin_g_dl: target_hemoglobin || '10_to_11pct_target_per_KDIGO',
    iron_therapy: iron_repletion_needed ? 'IV_iron_preferred_over_oral_in_CKD_due_to_absorption_issues_refer_to_KDIGO_dosing_protocol' : 'continue_oral_iron_if_poor_response_consider_IV_iron',
    safety_targets: ['do_not_target_above_11pct_due_to_cardiovascular_risk', 'avoid_ESA_in_active_malignancy_or_recent_stroke', 'monitor_BP_for_hypertension_induction'],
    monitoring: 'hemoglobin_Q2_to_4_weeks_during_initiation_then_Q3_months_transferrin_saturation_Q3_months',
    citation: CITATIONS.KDIGO_CKD,
  };
}

function mineralBoneDisorder(input) {
  const { serum_calcium_mg_dl, serum_phosphate_mg_dl, intact_pth_pg_ml, alkaline_phosphatase, vitamin_d_25_oh_d_ng_ml, dialysis_status } = input;
  let interpretation = 'normal';
  if (serum_phosphate_mg_dl >= 5.5 || intact_pth_pg_ml >= 600) interpretation = 'severe_CKD_MBD_active_intervention_needed';
  else if (intact_pth_pg_ml >= 300 || serum_calcium_mg_dl >= 10.5 || vitamin_d_25_oh_d_ng_ml < 20) interpretation = 'moderate_CKD_MBD';
  return {
    interpretation, serum_calcium_mg_dl, serum_phosphate_mg_dl, intact_pth_pg_ml, vitamin_d_25_oh_d_ng_ml,
    treatment: ['dietary_phosphate_restriction_800_to_1000_mg_per_day', 'phosphate_binders_calcium_acetate_or_sevelamer_or_lanthanum', 'active_vitamin_D_calcitriol_or_paricalcitol_or_doxercalciferol_if_intact_PTH_above_target', 'calcimimetic_cinacalcet_if_intact_PTH_above_300_pg_ml_and_hyperparathyroidism_persists', 'cinacalcet_or_etelcalcetide_for_dialysis_patients'],
    monitoring: 'serum_calcium_phosphate_Q3_month_intact_PTH_Q3_month_vitamin_D_annually_alkaline_phosphatase_Q6_month',
    dialysis_considerations: dialysis_status === 'yes_on_dialysis' ? 'target_intact_PTH_2_to_9_times_upper_limit_per_KDIGO' : 'adjust_targets_per_KDIGO_for_nondialysis_CKD',
    citation: CITATIONS.KDIGO_CKD,
  };
}

function hypertensionInCkd(input) {
  const { systolic_bp_mmhg, diastolic_bp_mmhg, urine_albumin_to_creatinine_ratio_mg_g, egfr_ml_min_1_73m2, current_antihypertensives, hyperkalemia_present } = input;
  let bp_target = 'target_under_130_over_80_per_KDIGO_for_albuminuria_or_transplant';
  if (urine_albumin_to_creatinine_ratio_mg_g < 30 && egfr_ml_min_1_73m2 >= 60) bp_target = 'target_under_140_over_90_per_general_guidelines';
  let first_line = 'ACE_inhibitor_or_ARB_for_albuminuria_or_diabetes';
  if (hyperkalemia_present === 'yes') first_line = 'consider_non_ACE_non_ARB_options_like_dihydropyridine_CC_amlodipine';
  return {
    bp_target, systolic_bp_mmhg, diastolic_bp_mmhg, egfr_ml_min_1_73m2,
    first_line, additional_agents: ['thiazide_if_egfr_30_to_60', 'loop_diuretic_furosemide_if_egfr_below_30_or_volume_overload', 'beta_blocker_or_CC_post_transplant', 'consider_finerenone_mineralocorticoid_antagonist_in_CKD_with_diabetes_and_albuminuria'],
    monitoring: 'BP_at_each_visit_potassium_Q1_to_4_weeks_during_initiation_of_ACE_ARB_or_MRA_creatinine_Q1_to_4_weeks',
    citation: CITATIONS.KDIGO_BP,
  };
}

module.exports = { ckdStagingKdigo, ckdProgressionRisk, ckdAnemiaEpoManagement, mineralBoneDisorder, hypertensionInCkd, CITATIONS, ValidationError };