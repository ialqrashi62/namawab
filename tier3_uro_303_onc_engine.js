/**
 * TIER3_URO-303 Urologic Oncology Engine
 * Prostate cancer risk stratification (NCCN) + Renal cell carcinoma staging + Bladder cancer (NMIBC vs MIBC) + Testicular cancer staging + Penile cancer
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NCCN_PROS: 'NCCN Prostate Cancer 2024', AUA_ONC: 'AUA Urologic Oncology 2024' };

function prostateCancerRiskNccn(input) {
  const { psa_value_ng_ml, gleason_grade_group, clinical_stage_t, percent_positive_cores_count } = input;
  let risk_group = 'favorable_intermediate';
  let primary_treatment = 'radical_prostatectomy_or_external_radiation_with_ADT';
  if (psa_value_ng_ml < 10 && gleason_grade_group <= 6 && clinical_stage_t === 'T1c_to_T2a') risk_group = 'low_risk';
  else if (psa_value_ng_ml >= 10 && psa_value_ng_ml < 20 && gleason_grade_group === 7 && clinical_stage_t === 'T2b') risk_group = 'unfavorable_intermediate';
  else if (psa_value_ng_ml >= 20 || gleason_grade_group >= 8 || clinical_stage_t === 'T3_or_T4') risk_group = 'high_risk_or_very_high_risk';
  if (risk_group === 'low_risk') primary_treatment = 'active_surveillance_appropriate_for_most_with_close_follow_up';
  return {
    risk_group, psa_value_ng_ml, gleason_grade_group, clinical_stage_t,
    primary_treatment, follow_up: 'post_treatment_PSA_Q3_months_x_2_years_then_Q6_months',
    advanced_disease_workup: 'consider_PSMA_PET_CT_for_high_risk_or_recurrent_disease_to_assess_metastasis',
    citation: CITATIONS.NCCN_PROS,
  };
}

function renalCellCarcinoma(input) {
  const { tumor_size_cm, location, histological_subtype, necrosis_present, sarcomatoid_features, nodal_status, metastatic_status, renal_function } = input;
  let stage = 'T1a_lt_4cm';
  if (tumor_size_cm >= 4 && tumor_size_cm < 7) stage = 'T1b_4_to_7cm';
  else if (tumor_size_cm >= 7) stage = 'T2';
  else if (location === 'adrenal_or_perinephric_invasion') stage = 'T4';
  let surgical_approach = 'partial_nephrectomy_if_tumor_lt_7cm';
  if (tumor_size_cm >= 7) surgical_approach = 'radical_nephrectomy';
  if (metastatic_status === 'yes') surgical_approach = 'cytoreductive_nephrectomy_if_eligible_then_systemic_therapy_IO_combination';
  return {
    stage, tumor_size_cm, histological_subtype, metastatic_status,
    surgical_approach, systemic_options: metastatic_status === 'yes' ? ['nivolumab_plus_cabozantinib', 'pembrolizumab_plus_axitinib', 'ipilimumab_plus_nivolumab_for_intermediate_poor_risk'] : 'surveillance_with_imaging_Q3_to_6_months',
    ablation_options: tumor_size_cm < 4 ? 'consider_thermal_ablation_cryotherapy_or_radiofrequency_for_small_peripheral_tumors_in_selected_patients' : 'not_indicated',
    citation: CITATIONS.AUA_ONC,
  };
}

function bladderCancer(input) {
  const { stage_invasion, tumor_count, tumor_size_cm, cis_concurrent, prior_recurrence_rate, lymphovascular_invasion, g3_high_grade } = input;
  let nmibc = false;
  if (stage_invasion === 'Tis_Ta_or_T1') nmibc = true;
  let risk_category = 'low_risk';
  if (g3_high_grade === 'yes' && (tumor_count >= 5 || tumor_size_cm >= 3 || cis_concurrent === 'yes')) risk_category = 'high_risk_nmiBC';
  else if (g3_high_grade === 'yes') risk_category = 'intermediate_risk';
  let treatment = nmibc ? 'TURBT_with_intravesical_BCG_or_chemotherapy_per_risk' : 'radical_cystectomy_with_neobladder_ileal_conduit';
  return {
    nmibc, stage_invasion, risk_category, tumor_count,
    treatment: nmibc && risk_category === 'low_risk_nmiBC' ? 'TURBT_with_single_dose_intravesical_chemotherapy' : nmibc && risk_category === 'intermediate_risk_nmiBC' ? 'TURBT_with_BCG_or_chemotherapy_x_1_year' : nmibc && risk_category === 'high_risk_nmiBC' ? 'TURBT_with_induction_BCG_x_6_weeks_then_maintenance_BCG_3_years' : 'radical_cystectomy_with_neoadjuvant_chemotherapy_for_cT2_or_greater',
    follow_up: nmibc ? 'cystoscopy_Q3M_x_2_years_then_Q6M_x_2_years_then_Q12M_lifelong' : 'post_cystectomy_imaging_CT_Q3_to_6_months_x_2_years_then_Q12M_lifelong',
    citation: CITATIONS.AUA_ONC,
  };
}

function testicularCancer(input) {
  const { laterality, histology_type, pre_afp_value, pre_hcg_value, pre_ldh_value, tumor_size_cm, retroperitoneal_mass_present, lung_metastasis_present } = input;
  let classification = 'seminoma_classical';
  if (histology_type === 'non_seminoma_embryonal_yolk_sac_choriocarcinoma_teratoma') classification = 'non_seminomatous_germ_cell_tumor';
  let risk_group = 'good_risk';
  if (retroperitoneal_mass_present === 'yes' || lung_metastasis_present === 'yes') risk_group = 'intermediate_or_poor_risk';
  return {
    classification, pre_afp_value, pre_hcg_value, pre_ldh_value, retroperitoneal_mass_present, lung_metastasis_present,
    treatment: classification === 'seminoma_classical' && risk_group === 'good_risk' ? 'radical_orchiectomy_then_surveillance_or_1_cycle_carboplatin' : 'radical_orchiectomy_then_chemotherapy_BEP_x_3_to_4_cycles_per_risk',
    post_orchiectomy_workup: ['CT_chest_abdomen_pelvis', 'serum_tumor_markers_repeat', 'sperm_banking_referral', 'consider_fertility_preservation'],
    post_chemotherapy_residual_mass: 'consider_post_chemotherapy_RPLND_for_non_seminoma_with_residual_mass_gt_1cm',
    citation: CITATIONS.AUA_ONC,
  };
}

function penileCancer(input) {
  const { tumor_size_cm, location_glans_or_shaft, invasion_depth, nodal_status, hpv_related_lesion_present, histology_squamous_cell_carcinoma } = input;
  let stage = 'Tis_or_Ta';
  if (invasion_depth === 'subepithelial') stage = 'T1';
  else if (invasion_depth === 'corpus_spongiosum_or_cavernosum') stage = 'T2';
  else if (invasion_depth === 'urethra_or_prostate') stage = 'T3';
  return {
    stage, tumor_size_cm, location_glans_or_shaft,
    treatment: stage === 'Tis_or_Ta' ? 'glansectomy_or_laser_ablation_with_circumcision_or_topical_5FU_or_imiquimod' : stage === 'T1' ? 'partial_penectomy_with_Q2cm_margins_or_glansectomy' : 'partial_or_total_penectomy_with_inguinal_lymphadenectomy_if_clinically_node_positive',
    inguinal_node_management: nodal_status === 'palpable_nodes' ? 'fine_needle_aspiration_and_modified_inguinal_lymphadenectomy_if_positive' : 'surveillance_with_US_Q3M_for_2_years_for_T1_or_greater',
    follow_up: 'Q3_months_x_2_years_then_Q6_months_x_3_years_then_Q12M_lifelong',
    citation: CITATIONS.AUA_ONC,
  };
}

module.exports = { prostateCancerRiskNccn, renalCellCarcinoma, bladderCancer, testicularCancer, penileCancer, CITATIONS, ValidationError };