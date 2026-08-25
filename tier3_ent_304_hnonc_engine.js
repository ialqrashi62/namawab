/**
 * TIER3_ENT-304 Head & Neck Oncology Engine
 * HPV-associated oropharynx cancer staging (AJCC 8) + Thyroid cancer risk stratification + Laryngeal cancer T-staging + Salivary gland tumor assessment + Neck mass evaluation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AJCC: 'AJCC 8th Edition 2024', ATA: 'ATA Thyroid 2015' };

function hpvOropharynxStaging(input) {
  const { t_category, n_category, m_category, hpv_p16_status } = input;
  let stage_group = 'stage_0_or_unstaged';
  if (hpv_p16_status === 'positive') {
    if (t_category === 'T1_or_T2' && n_category === 'N0_or_N1' && m_category === 'M0') stage_group = 'stage_I';
    else if (t_category === 'T1_or_T2' && n_category === 'N2' && m_category === 'M0') stage_group = 'stage_II';
    else if (t_category === 'T3_or_T4' && n_category === 'N0_to_N2' && m_category === 'M0') stage_group = 'stage_III';
    else stage_group = 'stage_IV_any_T_any_N_M1';
  } else if (hpv_p16_status === 'negative') {
    if (t_category === 'T1' && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_I';
    else if (t_category === 'T2' && n_category === 'N0' && m_category === 'M0') stage_group = 'stage_II';
    else if (t_category === 'T1_or_T2' && n_category === 'N1' && m_category === 'M0') stage_group = 'stage_III';
    else stage_group = 'stage_IV_any_T_any_N_or_M1';
  }
  return {
    stage_group, t_category, n_category, m_category, hpv_p16_status,
    prognosis: hpv_p16_status === 'positive' ? 'favorable_prognosis_for_most_HPV_positive_oropharynx_cancers' : 'standard_prognosis_per_stage',
    treatment: stage_group === 'stage_I' || stage_group === 'stage_II' ? 'definitive_radiation_or_surgery' : 'concurrent_chemoradiation_for_advanced',
    citation: CITATIONS.AJCC,
  };
}

function thyroidCancerRiskStratification(input) {
  const { age_years, tumor_size_cm, histology, extra_thyroidal_extension, lymph_node_metastases, distant_metastasis, braf_v600e_mutation, tert_promoter_mutation } = input;
  let risk = 'low_risk';
  if (extra_thyroidal_extension === 'yes' || distant_metastasis === 'yes') risk = 'high_risk';
  else if (lymph_node_metastases === 'yes' || (tumor_size_cm >= 4) || histology === 'aggressive_variants') risk = 'intermediate_risk';
  if (braf_v600e_mutation === 'yes' && tert_promoter_mutation === 'yes') risk = 'high_risk_due_to_combined_mutations';
  return {
    risk_category: risk, age_years, tumor_size_cm, histology, extra_thyroidal_extension, lymph_node_metastases, distant_metastasis,
    surgical_indication: 'yes_total_or_hemithyroidectomy_based_on_risk',
    ajcc_8_tnm: 'use_AJCC_8th_edition_for_differentiated_thyroid_cancer',
    follow_up: 'thyroglobulin_Q6_to_12M_neck_US_Q6_to_12M_iodine_whole_body_scan_if_high_risk',
    citation: CITATIONS.ATA,
  };
}

function laryngealCancerTstaging(input) {
  const { tumor_subsite, vocal_cord_mobility, extra_laryngeal_extension, cartilage_invasion, vocal_cord_fixation } = input;
  let t_category = 'TX_unable_to_assess';
  if (tumor_subsite === 'supraglottic_or_glottic_or_subglottic_limited_to_one_subsite_with_normal_mobility') t_category = 'T1';
  else if (tumor_subsite === 'extends_to_adjacent_subsite_or_glottic_with_impaired_mobility') t_category = 'T2';
  else if (vocal_cord_fixation === 'yes') t_category = 'T3';
  else if (extra_laryngeal_extension === 'yes' || cartilage_invasion === 'yes') t_category = 'T4a';
  return {
    t_category, tumor_subsite, vocal_cord_mobility, cartilage_invasion, extra_laryngeal_extension,
    treatment: t_category === 'T1' || t_category === 'T2' ? 'definitive_radiation_or_partial_laryngectomy' : t_category === 'T3' ? 'radiation_with_chemotherapy_or_total_laryngectomy' : 'total_laryngectomy_with_concurrent_chemoradiation',
    speech_rehabilitation: t_category === 'T3' || t_category === 'T4' ? 'tracheoesophageal_puncture_prosthesis_or_esophageal_speech_therapy' : 'standard',
    citation: CITATIONS.AJCC,
  };
}

function salivaryGlandTumor(input) {
  const { parotid_or_submandibular_or_sublingual_or_minor, tumor_size_cm, facial_nerve_invasion, lymph_node_metastases, cytology_fnab_result, malignancy_high_grade_signs } = input;
  let surgical_indication = 'yes_parotidectomy_or_submandibular_gland_resection_with_frozen_section';
  if (cytology_fnab_result === 'malignant_high_grade' || facial_nerve_invasion === 'yes') surgical_indication = 'yes_total_or_radical_gland_resection_with_facial_nerve_sacrifice_or_reconstruction';
  return {
    tumor_size_cm, cytology_fnab_result, facial_nerve_invasion, malignancy_high_grade_signs,
    surgical_indication,
    nerve_monitoring: facial_nerve_invasion === 'yes' ? 'consider_facial_nerve_monitoring_during_surgery' : 'routine_facial_nerve_identification',
    follow_up: 'neck_imaging_Q3_to_6_months_first_2_years_then_Q12_months',
    citation: CITATIONS.AJCC,
  };
}

function neckMassEvaluation(input) {
  const { mass_duration_weeks, mass_size_cm, mass_consistency, mobility, location_level, supraclavicular, hoarseness, dysphagia, otalgia, weight_loss, tobacco_alcohol_use, age_years, prior_cancer_history } = input;
  const red_flags_present = (mass_duration_weeks >= 2 && mass_size_cm >= 1.5) || supraclavicular === 'yes' || (hoarseness === 'yes' && prior_cancer_history === 'yes') || (weight_loss === 'yes' && tobacco_alcohol_use === 'yes') || age_years >= 40 || prior_cancer_history === 'yes';
  let workup = red_flags_present ? 'urgent_CT_neck_with_contrast_and_FNA_biopsy' : 'ultrasound_with_FNA_if_persistent_Q2_weeks';
  let suspicion_for_malignancy = 'low';
  if (red_flags_present) suspicion_for_malignancy = 'moderate_to_high';
  return {
    red_flags_present, mass_duration_weeks, mass_size_cm, location_level, supraclavicular,
    suspicion_for_malignancy, workup,
    cancer_origin_if_malignant: (supraclavicular === 'yes') ? 'consider_thoracic_or_gi_or_breast_primary_with_metastasis_to_supraclavicular' : (location_level === 'upper_jugular') ? 'consider_HPV_associated_oropharynx_cancer' : (location_level === 'mid_jugular') ? 'consider_thyroid_or_laryngeal_or_lung' : 'consider_lung_or_esophagus',
    citation: CITATIONS.AJCC,
  };
}

module.exports = { hpvOropharynxStaging, thyroidCancerRiskStratification, laryngealCancerTstaging, salivaryGlandTumor, neckMassEvaluation, CITATIONS, ValidationError };