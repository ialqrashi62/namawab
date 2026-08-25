/**
 * TIER3_NEPHRO-304 Glomerulonephritis Engine
 * Nephrotic syndrome (adult vs peds) + Nephritic syndrome + IgA nephropathy + MPGN + Rapidly progressive GN
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_GN: 'KDIGO GN 2021' };

function nephroticSyndromeAdult(input) {
  const { urine_protein_g_24h, serum_albumin_g_dl, edema_present, hyperlipidemia_present, age_years, diabetes_present, complement_low, biopsy_findings } = input;
  let diagnosis = 'unclassified';
  if (urine_protein_g_24h >= 3.5 && serum_albumin_g_dl < 3 && edema_present === 'yes') diagnosis = 'nephrotic_syndrome_confirmed';
  if (biopsy_findings === 'minimal_change_disease') diagnosis = 'minimal_change_disease_MCD_first_line_steroid';
  else if (biopsy_findings === 'FSGS') diagnosis = 'focal_segmental_glomerulosclerosis_FSGS';
  else if (biopsy_findings === 'membranous_nephropathy') diagnosis = 'membranous_nephropathy';
  return {
    diagnosis, urine_protein_g_24h, serum_albumin_g_dl, edema_present,
    first_line_treatment: diagnosis.includes('MCD') ? 'high_dose_prednisone_1mg_per_kg_per_day_x_8_weeks_then_taper_x_8_to_12_weeks' : diagnosis.includes('FSGS') ? 'high_dose_steroid_x_8_weeks_with_CNI_tacrolimus_or_cyclosporine_x_6_months' : diagnosis.includes('membranous') ? 'supportive_ACE_ARB_then_consider_CNI_or_rituximab_per_anti_PLA2R_status' : 'supportive_care_then_immunosuppression_per_biopsy',
    supportive_care: ['low_salt_lt_2g_per_day', 'loop_diuretic_for_edema', 'ACE_inhibitor_or_ARB_to_reduce_proteinuria', 'statin_for_hyperlipidemia', 'consider_anticoagulation_for_albumin_below_2.5_with_risk_factors'],
    biopsy_indicated: diabetes_present === 'no' || age_years < 60 || complement_low === 'yes' ? 'yes' : 'no_if_diabetes_with_classic_features_diagnosis_can_be_diabetic_nephropathy',
    citation: CITATIONS.KDIGO_GN,
  };
}

function nephriticSyndrome(input) {
  const { hematuria_microscopic_or_macroscopic, dysmorphic_rbc_present, rbc_casts, hypertension, oliguria, proteinuria_g_24h, creatinine_rise, complement_low, age_years } = input;
  let interpretation = 'unclassified';
  if (dysmorphic_rbc_present === 'yes' && rbc_casts === 'yes' && hypertension === 'yes') interpretation = 'nephritic_syndrome_glomerular_origin';
  if (creatinine_rise > 0.5 && oliguria === 'yes') interpretation += '_rapidly_progressive';
  return {
    interpretation, hematuria_microscopic_or_macroscopic, rbc_casts, complement_low,
    etiologies_to_consider: ['post_infectious_glomerulonephritis_complement_low', 'IgA_nephropathy_normal_complement', 'lupus_nephritis_complement_low', 'ANCA_associated_pauci_immune_vasculitis', 'anti_GBM_disease_goodpasture', 'membranoproliferative_GN'],
    workup: ['complement_C3_C4', 'ANA_anti_dsDNA', 'ANCA_p_c', 'anti_GBM_antibody', 'renal_biopsy', 'consider_post_streptococcal_ASO_or_anti_DNase_B'],
    treatment: 'per_biopsy_based_diagnosis',
    prognosis: 'highly_variable_depending_on_underlying_etiology',
    citation: CITATIONS.KDIGO_GN,
  };
}

function igaNephropathy(input) {
  const { persistent_hematuria, mesangial_iga_deposition_biopsy, oxford_mest_c_score, proteinuria_g_24h, egfr_ml_min_1_73m2, blood_pressure_control } = input;
  let risk_stratification = 'low_risk';
  if (oxford_mest_c_score === 'M1_E1_S1_T1_T2' || proteinuria_g_24h >= 1 || egfr_ml_min_1_73m2 < 60) risk_stratification = 'high_risk_for_progression';
  return {
    diagnosis: 'IgA_nephropathy', oxford_mest_c_score, risk_stratification,
    treatment: ['supportive_ACE_inhibitor_or_ARB_for_24_weeks_to_assess_proteinuria_response', 'low_salt_diet_2g_per_day', 'BP_target_under_130_over_80_per_KDIGO', 'if_proteinuria_persists_above_1g_per_24h_then_add_steroid_regimen_targeted_release_formulation_budesonide_or_systemic_steroid', 'consider_SGLT2_inhibitor_for_proteinuria_reduction_in_CKD_per_DAPA_CKD_principles', 'consider_endothelin_receptor_antagonist_sparsentan_in_selected'],
    monitoring: 'creatinine_Q1_to_3_months_proteinuria_Q3_months_BP_at_each_visit',
    biopsy_follow_up: 'consider_repeat_biopsy_if_sudden_decline_in_egfr_or_increase_in_proteinuria',
    citation: CITATIONS.KDIGO_GN,
  };
}

function mpgnClassification(input) {
  const { complement_low_persistent, c3_dominant_deposition, immune_complex_deposition, monoclonal_gammopathy_present, autoimmune_serology_positive } = input;
  let classification = 'MPGN_type_III_indeterminate';
  if (c3_dominant_deposition === 'yes' && immune_complex_deposition === 'no') classification = 'C3_glomerulopathy_C3GN_or_DDD';
  else if (immune_complex_deposition === 'yes' && autoimmune_serology_positive === 'yes') classification = 'immune_complex_MPGN_due_to_underlying_etiology_such_as_lupus_or_infection';
  else if (monoclonal_gammopathy_present === 'yes') classification = 'monoclonal_immunoglobulin_associated_MPGN_or_monoclonal_gammopathy_of_renal_significance';
  return {
    classification, complement_low_persistent,
    workup: ['complement_C3_C4_Q1_month_during_initial_evaluation', 'autoimmune_serology_ANA_anti_dsDNA', 'serum_protein_immunofixation_free_light_chain_ratio', 'viral_screening_HBV_HCV_HIV', 'genetic_testing_in_young_patients_with_persistent_low_complement'],
    treatment: classification.includes('C3') ? 'complement_inhibitor_ravulizumab_or_emicizumab_investigational_or_MYC_then_CNI' : 'per_underlying_etiology_chemotherapy_for_monoclonal_gammopathy_or_treat_infection',
    citation: CITATIONS.KDIGO_GN,
  };
}

function rapidlyProgressiveGn(input) {
  const { creatinine_rise_rate, oliguria_present, glomerular_crescents_biopsy_pct, anca_positive, anti_gbm_positive, pulmonary_involvement } = input;
  let interpretation = 'RPGN_emergent';
  if (glomerular_crescents_biopsy_pct >= 50) interpretation = 'severe_crescentic_GN_high_risk_for_ESRD';
  if (anca_positive === 'yes') interpretation = 'p_ANCA_or_c_ANCA_associated_pauci_immune_crescentic_GN';
  else if (anti_gbm_positive === 'yes' && pulmonary_involvement === 'yes') interpretation = 'anti_GBM_disease_with_pulmonary_renal_syndrome_goodpasture';
  return {
    interpretation, glomerular_crescents_biopsy_pct, anca_positive,
    treatment: ['urgent_plasmapheresis_daily_x_5_if_anti_GBM_positive_or_severe_ANCA_with_PRP_or_dialysis_dependent', 'IV_methylprednisolone_500mg_IV_daily_x_3_then_oral_prednisone', 'cyclophosphamide_or_rituximab_for_ANCA_associated', 'anti_GBM_disease_use_cyclophosphamide_in_addition_to_plasma_ex_and_steroids', 'supportive_care_RRT_if_dialysis_dependent'],
    prognosis: 'outcomes_improved_with_early_aggressive_treatment_delay_in_treatment_increases_ESRD_risk',
    citation: CITATIONS.KDIGO_GN,
  };
}

module.exports = { nephroticSyndromeAdult, nephriticSyndrome, igaNephropathy, mpgnClassification, rapidlyProgressiveGn, CITATIONS, ValidationError };