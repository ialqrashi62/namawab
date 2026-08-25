/**
 * TIER3_DERM-302 Dermatologic Oncology Engine
 * Melanoma staging (AJCC 8) + Melanoma surgical margins + Basal cell carcinoma (BCC) + Squamous cell carcinoma (SCC) staging + Merkel cell carcinoma
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NCCN_MEL: 'NCCN Melanoma 2024', AAD_ONC: 'AAD Dermatologic Oncology 2024' };

function melanomaStagingAjcc8(input) {
  const { t_category, n_category, m_category, ld_hd_status } = input;
  let stage_group = 'stage_0_in_situ';
  if (t_category === 'T1a' && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_Ia';
  else if ((t_category === 'T1b' || t_category === 'T2a') && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_Ib';
  else if (t_category === 'T2b' && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_IIa';
  else if (t_category === 'T3a' && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_IIb';
  else if (t_category === 'T3b' && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_IIC';
  else if (n_category !== 'N0' && m_category === 'M0') stage_group = 'stage_III';
  else if (m_category === 'M1') stage_group = 'stage_IV';
  return {
    stage_group, t_category, n_category, m_category, ld_hd_status,
    workup: stage_group.includes('II') || stage_group.includes('III') || stage_group.includes('IV') ? ['PET_CT_for_stage_III_and_above', 'BRAF_mutation_test', 'LDH_for_prognosis', 'brain_MRI_for_stage_III_IV'] : 'wide_local_excision_with_sentinel_lymph_node_for_T1b_and_above',
    citation: CITATIONS.NCCN_MEL,
  };
}

function melanomaSurgicalMargins(input) {
  const { tumor_thickness_mm, location, reconstruction_needed } = input;
  let margin_cm = 1;
  if (tumor_thickness_mm > 1 && tumor_thickness_mm <= 2) margin_cm = 1;
  else if (tumor_thickness_mm > 2 && tumor_thickness_mm <= 4) margin_cm = 2;
  else if (tumor_thickness_mm > 4) margin_cm = 2;
  if (location === 'face_or_acral') margin_cm = Math.max(1, margin_cm - 0.5);
  return {
    margin_cm, tumor_thickness_mm, location,
    technique: 'full_thickness_wide_local_excision_with_atraumatic_technique',
    reconstruction: reconstruction_needed === 'yes' ? 'linear_closure_or_local_flap_or_skin_graft_based_on_size_and_location' : 'primary_closure',
    sentinel_lymph_node_biopsy: tumor_thickness_mm >= 0.8 ? 'yes' : 'consider',
    citation: CITATIONS.NCCN_MEL,
  };
}

function basalCellCarcinoma(input) {
  const { lesion_size_cm, location_high_risk, histology_subtype, recurrent, immunosuppression } = input;
  let treatment = 'standard_electrodessication_and_curettage_or_simple_excision_for_low_risk';
  let mohs_indicated = false;
  if (location_high_risk === 'yes' || recurrent === 'yes' || histology_subtype === 'infiltrative_morpheaform_micronodular' || immunosuppression === 'yes') { mohs_indicated = true; treatment = 'Mohs_micrographic_surgery_preferred'; }
  if (lesion_size_cm >= 2 && location_high_risk === 'yes') { mohs_indicated = true; treatment = 'Mohs_micrographic_surgery_preferred_for_high_risk_features'; }
  return {
    treatment, mohs_indicated, lesion_size_cm, location_high_risk, histology_subtype,
    alternative_for_inoperable: ['vismodegib_or_sonidegib_oral_Hedgehog_inhibitor_for_locally_advanced_or_metastatic', 'radiation_therapy_for_primary_or_adjuvant'],
    follow_up: 'Q3_to_6M_first_2_years_then_Q6_to_12M_for_5_years',
    citation: CITATIONS.AAD_ONC,
  };
}

function squamousCellCarcinomaStaging(input) {
  const { tumor_size_cm, depth_invasion, perineural_invasion, immunosuppression, high_risk_location, nodal_status } = input;
  let stage_group = 'stage_I_low_risk';
  if (tumor_size_cm >= 2 || depth_invasion >= 4 || perineural_invasion === 'yes' || immunosuppression === 'yes' || high_risk_location === 'yes') stage_group = 'stage_II_high_risk';
  if (nodal_status === 'positive') stage_group = 'stage_III_nodal';
  let mohs_indicated = false;
  if (high_risk_location === 'yes' || perineural_invasion === 'yes' || tumor_size_cm >= 2) mohs_indicated = true;
  return {
    stage_group, tumor_size_cm, depth_invasion, perineural_invasion,
    treatment: stage_group === 'stage_III_nodal' ? 'wide_local_excision_with_mohs_and_lymph_node_dissection_then_consider_radiation_or_immunotherapy_cemiplimab' : mohs_indicated ? 'Mohs_micrographic_surgery_preferred' : 'wide_local_excision_with_4_to_6mm_margins',
    follow_up: 'Q3_to_6M_first_2_years_then_Q6_to_12M_with_lifelong_skin_surveillance',
    citation: CITATIONS.AAD_ONC,
  };
}

function merkelCellCarcinoma(input) {
  const { tumor_size_cm, nodal_status, distant_metastasis, immunosuppression } = input;
  let stage = 'localized';
  if (distant_metastasis === 'yes') stage = 'metastatic';
  else if (nodal_status === 'positive') stage = 'nodal';
  let workup = 'PET_CT_brain_MRI_to_assess_distant_metastasis';
  return {
    stage, tumor_size_cm, immunosuppression,
    workup,
    treatment: stage === 'localized' ? 'wide_local_excision_with_1_to_2cm_margins_with_sentinel_lymph_node_biopsy_then_adjuvant_radiation' : stage === 'nodal' ? 'wide_local_excision_plus_lymph_node_dissection_plus_adjuvant_radiation_then_consider_immunotherapy_avelumab_or_pembrolizumab' : 'systemic_immunotherapy_avelumab_pembrolizumab_or_chemotherapy_with_palliative_intent',
    prognosis: (stage === 'localized') ? '5_year_survival_60_to_80pct' : (stage === 'nodal') ? '5_year_survival_30_to_50pct' : 'median_survival_9_to_15_months',
    citation: CITATIONS.AAD_ONC,
  };
}

module.exports = { melanomaStagingAjcc8, melanomaSurgicalMargins, basalCellCarcinoma, squamousCellCarcinomaStaging, merkelCellCarcinoma, CITATIONS, ValidationError };