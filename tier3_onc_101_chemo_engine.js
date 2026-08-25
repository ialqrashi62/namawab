/**
 * TIER3_ONC-101 Chemotherapy Safety / Dosing Engine
 * Dose calculation + Renal/hepatic adjustment + Drug interactions + Toxicity monitoring
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASCO_CHEMO: 'ASCO Chemo Safety 2024', NCCN_CHEMO: 'NCCN Chemotherapy Order Templates 2024' };

function chemotherapyDoseCalculation(input) {
  const { bsa_m2, age_years, regimen_name, egfr, total_bilirubin, ast_alt, performance_status, prior_tolerance, obesity_adjustment, primary_cancer_type } = input;
  let dose_mg_per_m2 = 0;
  let dose_total_mg = bsa_m2 * dose_mg_per_m2;
  let dose_capped = false;
  if (obesity_adjustment === 'yes' && bsa_m2 > 2.0) dose_capped = true;
  let dose_recommendation = 'use_full_BSA_dose_for_curative_intent_no_cap';
  if (primary_cancer_type === 'palliative') dose_recommendation = 'consider_capping_dose_at_BSA_2.0_for_palliative_to_reduce_toxicity';
  return {
    dose_recommendation, dose_total_mg, dose_capped,
    dose_calculation: 'BSA_dose_mg_per_m2_x_BSA_or_AUC_dose_x_GFR_plus_adjustments',
    performance_status_factor: 'ECOG_0_to_1_full_dose_ECOG_2_consider_75_to_100pct_ECOG_3_to_4_palliative_intent_only_or_reduction',
    prior_tolerance_factor: 'if_grade_3_to_4_toxicity_prior_cycle_reduce_25pct_next_cycle_or_hold_then_reassess',
    citation: CITATIONS.ASCO_CHEMO,
  };
}

function renalHepaticDoseAdjustment(input) {
  const { egfr, total_bilirubin, ast, alt, drug_name, dose_initial } = input;
  let adjustment = 'no_adjustment_full_dose';
  if (egfr >= 30 && egfr < 60) adjustment = 'consider_reduction_for_renally_cleared_drugs_carboplatin_methotrexate_cisplatin_capecitabine';
  if (egfr < 30) adjustment = 'significant_reduction_or_avoid_for_renally_cleared_drugs_dialysis_dose_per_protocol';
  if (total_bilirubin > 3 || ast > 5 * upper_limit || alt > 5 * upper_limit) adjustment = 'significant_reduction_for_hepatically_cleared_drugs_irinotecan_doxorubicin_vincristine_cyclophosphamide';
  if (total_bilirubin > 5) adjustment = adjustment + '_avoid_hepatically_cleared_drugs_or_75pct_reduction_with_close_monitoring';
  return {
    adjustment,
    carboplatin_auc: 'Calvert_formula_AUC_target_x_GFR_plus_25_per_renal_dose_with_target_AUC_5_to_7_per_protocol',
    cisplatin: 'avoid_below_GFR_60_reduce_dose_to_75pct_GFR_45_to_60',
    methotrexate: 'high_dose_only_with_normal_GFR_above_60_and_alkaline_urine_and_leucovorin_rescue',
    capecitabine: 'avoid_below_GFR_30_reduce_25pct_GFR_30_to_50',
    citation: CITATIONS.NCCN_CHEMO,
  };
}

function chemoDrugInteractions(input) {
  const { drug_name, concomitant_meds, cyp3a4_interaction, qt_prolongation_risk, immunosuppressant, vaccine_use, herbal_supplements } = input;
  let interactions = [];
  if (cyp3a4_interaction === 'yes') interactions.push('CYP3A4_strong_inhibitors_clarithromycin_ketoconazole_itraconazole_reduce_dose_or_alternative_avoid_for_vincristine_vinorelbine_paclitaxel_etoposide');
  if (qt_prolongation_risk === 'yes') interactions.push('QT_prolonging_drugs_ondansetron_antiarrhythmics_fluoroquinolones_ECG_monitoring_or_alternative');
  if (immunosuppressant === 'yes') interactions.push('live_vaccines_contraindicated_with_active_chemo_use_inactivated_or_recombinant_vaccines');
  if (herbal_supplements === 'yes') interactions.push('St_Johns_wart_induces_CYP_reduces_drug_levels_garlic_ginkgo_increase_bleeding');
  return {
    interactions,
    supportive_care_drug_interactions: ['aprepitant_CYP3A4_inhibitor_increases_drug_levels_of_vincristine_docetaxel_ifosfamide', 'metoclopramide_QT_prolongation_with_ondansetron', 'g_csf_with_concurrent_chemo_risk_of_myelosuppression_avoid_concurrent_24h_before_or_after_cytotoxic_dose'],
    citation: CITATIONS.ASCO_CHEMO,
  };
}

function chemotherapyToxicityMonitoring(input) {
  const { regimen_name, day_of_cycle, cumulative_dose_present, prior_neutropenia, neuropathy_present, ototoxicity_present, cardiotoxicity_present, nephrotoxicity_present, nadir_day } = input;
  let monitoring = 'CBC_day_8_to_14_for_nadir_CMP_for_renal_hepatic_Q_cycle_clinical_assessment_for_toxicity';
  let specific_tests = [];
  if (cardiotoxicity_present === 'yes' || regimen_name === 'doxorubicin_containing') specific_tests.push('baseline_and_Q3_month_echo_or_MUGA_for_LVEF_cumulative_doxorubicin_above_450mg_per_m2_reduces_continued_use');
  if (ototoxicity_present === 'yes' || regimen_name === 'cisplatin_high_dose') specific_tests.push('baseline_audiometry_Q_cycle_with_high_dose_cisplatin_for_ototoxicity');
  if (nephrotoxicity_present === 'yes' || regimen_name === 'cisplatin_high_dose_methotrexate') specific_tests.push('creatinine_clearance_each_cycle_with_cisplatin_high_dose_methotrexate');
  if (neuropathy_present === 'yes' || regimen_name === 'taxane_or_vincristine_or_bortezomib') specific_tests.push('clinical_neurologic_assessment_Q_cycle_consider_nerve_conduction_studies_for_persistent');
  return {
    monitoring, specific_tests,
    nadir_management: 'G_CSF_pegfilgrastim_or_filgrastim_for_high_risk_regimens_or_prior_neutropenic_fever_antibiotic_prophylaxis_for_low_neutrophil',
    dose_modification: 'grade_3_to_4_toxicity_per_CTCAE_reduce_dose_25pct_or_hold_then_resume_when_resolved_to_grade_1_or_baseline',
    citation: CITATIONS.NCCN_CHEMO,
  };
}

function chemoExtravasationManagement(input) {
  const { extravasated_drug_name, vesicant_or_irritant, volume_extravasated, tissue_injury_severity, location, time_to_recognition_minutes, antidote_available } = input;
  let first_response = 'STOP_infusion_immediately_needle_in_place_aspirate_drug_then_remove_then_cold_or_warm_compress_per_drug_specific';
  let antidote_plan = 'see_drug_specific_antidote_dexrazoxane_for_anthracyclines_dimethyl_sulfoxide_DMSO_for_anthracyclines_mitomycin_hyaluronidase_for_vinorelbine_vincristine_vinblastine';
  if (vesicant_or_irritant === 'vesicant') antidote_plan = antidote_plan + '_urgent_consult_to_plastic_surgery_for_surgical_debridement_consider_if_tissue_injury_severity_high';
  return {
    first_response, antidote_plan,
    drug_specific: ['anthracyclines_dexrazoxane_within_6h_or_DMSO_topical_cool_compress', 'mitomycin_DMSO_topical', 'vinca_alkaloids_hyaluronidase_1mL_subcutaneous_5_injections_then_warm_compress', 'taxanes_consider_no_antidote_dilute_with_saline_warm_compress', 'mechlorethamine_sodium_thiosulfate_antidote_2mL_of_4pct_subcutaneous_then_cold_compress'],
    prevention: 'central_venous_access_for_vesicants_infusion_nurse_competency_peripheral_IV_site_check_Q15min_during_vesicant_infusion',
    citation: CITATIONS.ASCO_CHEMO,
  };
}

module.exports = { chemotherapyDoseCalculation, renalHepaticDoseAdjustment, chemoDrugInteractions, chemotherapyToxicityMonitoring, chemoExtravasationManagement, CITATIONS, ValidationError };