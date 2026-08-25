// filepath: tier5_imaging_ext_102_ct_engine.js
// TIER5_IMAGING_EXT-102: CT protocols (trauma, PE, stroke, cardiac, perfusion, low-dose)
'use strict';

const CITATIONS = [
  'ACR_CT_Appropriateness_2023',
  'NICE_Stroke_CT_2023',
  'RSNA_Perfusion_Guidelines_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function trauma_ct(req) {
  ensureBool(req.blunt_trauma_mechanism, 'blunt_trauma_mechanism');
  ensureBool(req.penetrating_trauma, 'penetrating_trauma');
  ensureBool(req.hypotension, 'hypotension');
  ensureBool(req.gcs_below_13, 'gcs_below_13');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureBool(req.fast_positive_or_unavailable, 'fast_positive_or_unavailable');

  let recommendation;
  if (req.hypotension && req.fast_positive_or_unavailable) recommendation = 'rapid_imaging_then_immediate_surgical_review';
  else if (req.gcs_below_13 && req.blunt_trauma_mechanism) recommendation = 'pan_scan_with_head_ct_and_c_spine_then_review';
  else if (req.penetrating_trauma) recommendation = 'consider_ct_angio_or_local_ct_then_surgical_review';
  else recommendation = 'continue_with_targeted_ct';
  return { recommendation };
}

function ct_pulmonary_angiogram(req) {
  ensureNumber(req.d_dimer_ng_ml, 'd_dimer_ng_ml');
  ensureBool(req.pre_test_pe_likelihood_high, 'pre_test_pe_likelihood_high');
  ensureBool(req.renal_impairment, 'renal_impairment');
  ensureBool(req.pregnancy, 'pregnancy');
  ensureBool(req.chronic_pe_history, 'chronic_pe_history');
  ensureNumber(req.age, 'age');

  let recommendation;
  if (req.d_dimer_ng_ml < 500 && req.age < 50 && !req.pre_test_pe_likelihood_high) recommendation = 'pe_ruled_out_consider_alternative_diagnosis';
  else if (req.d_dimer_ng_ml >= 500 || req.pre_test_pe_likelihood_high) recommendation = 'cta_chest_with_contrast_consider_pregnancy_protocol';
  else recommendation = 'continue_with_imaging_review';
  if (req.renal_impairment) recommendation += '_consider_renal_protection';
  if (req.pregnancy) recommendation += '_use_low_dose_pregnancy_protocol';
  if (req.chronic_pe_history) recommendation += '_review_with_chronic_thromboembolism_clinic';
  return { recommendation };
}

function stroke_ct(req) {
  ensureNumber(req.nihss_score, 'nihss_score');
  ensureNumber(req.last_known_well_hours, 'last_known_well_hours');
  ensureBool(req.cta_large_vessel_occlusion_suspected, 'cta_large_vessel_occlusion_suspected');
  ensureBool(req.bleed_present_on_ncct, 'bleed_present_on_ncct');
  ensureNumber(req.aspECTS_score, 'aspECTS_score');

  let action;
  if (req.bleed_present_on_ncct) action = 'hemorrhagic_then_neurosurgical_review';
  else if (req.last_known_well_hours <= 4.5) action = 'iv_thrombolysis_eligible_then_consider_thrombectomy';
  else if (req.last_known_well_hours <= 24 && req.cta_large_vessel_occlusion_suspected) action = 'thrombectomy_pathway_then_consider_perfusion';
  else if (req.aspECTS_score < 6) action = 'large_infarct_then_review_with_stroke_team';
  else action = 'continue_with_medical_therapy';
  return { action };
}

function cardiac_ct(req) {
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['coronary_anatomy','tavi_planning','mass_evaluation','congenital_heart_disease','pulmonary_vein_mapping','aortic_root']);
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureBool(req.irregular_rhythm_present, 'irregular_rhythm_present');
  ensureBool(req.iodine_allergy, 'iodine_allergy');
  ensureNumber(req.egfr, 'egfr');

  let advice;
  if (req.egfr < 30) advice = 'high_risk_contrast_then_alternative_imaging_consider';
  else if (req.heart_rate_bpm > 70) advice = 'consider_beta_blocker_then_re_check_heart_rate';
  else if (req.irregular_rhythm_present) advice = 'use_retrospective_gating_then_review_imaging';
  else if (req.iodine_allergy) advice = 'consider_premedication_then_continue_with_contrast';
  else advice = 'continue_with_standard_protocol';
  return { advice };
}

function ct_perfusion(req) {
  ensureNumber(req.cbf_ml_100g_min, 'cbf_ml_100g_min');
  ensureNumber(req.cbv_ml_100g, 'cbv_ml_100g');
  ensureNumber(req.tmax_seconds, 'tmax_seconds');
  ensureNumber(req.mismatch_ratio, 'mismatch_ratio');
  ensureNumber(req.infarct_core_volume_ml, 'infarct_core_volume_ml');

  let decision;
  if (req.mismatch_ratio >= 1.8 && req.infarct_core_volume_ml < 70 && req.tmax_seconds > 6) decision = 'thrombectomy_candidate_then_immediate_intervention';
  else if (req.mismatch_ratio < 1.8 && req.infarct_core_volume_ml >= 70) decision = 'large_core_then_review_with_neuro_intervention';
  else decision = 'continue_with_medical_therapy';
  return { decision };
}

function low_dose_ct(req) {
  ensureStr(req.scenario, 'scenario');
  ensureEnum(req.scenario, 'scenario', ['lung_cancer_screening','colonography','coronary_calcium','pediatric_chest','kidney_stone','trauma_follow_up']);
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.adult_or_pediatric, 'adult_or_pediatric');
  ensureBool(req.contrast_used, 'contrast_used');

  let dose_protocol;
  if (req.adult_or_pediatric === false) dose_protocol = 'pediatric_low_dose_then_review_imaging_quality';
  else if (req.scenario === 'lung_cancer_screening') dose_protocol = 'low_dose_chest_ct_120_kvp_then_iterative_reconstruction';
  else if (req.scenario === 'kidney_stone') dose_protocol = 'low_dose_non_contrast_then_review_stones';
  else if (req.bmi >= 35) dose_protocol = 'consider_higher_dose_for_obesity';
  else dose_protocol = 'continue_with_low_dose_protocol';
  if (req.contrast_used) dose_protocol += '_with_renal_check';
  return { dose_protocol };
}

function funcs() { return { trauma_ct, ct_pulmonary_angiogram, stroke_ct, cardiac_ct, ct_perfusion, low_dose_ct }; }
module.exports = { funcs, CITATIONS, ValidationError };
