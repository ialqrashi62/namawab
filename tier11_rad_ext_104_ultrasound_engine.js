// filepath: tier11_rad_ext_104_ultrasound_engine.js
// TIER11_RAD_EXT-104: Ultrasound advanced (FAST, vascular, obstetric, MSK, contrast)
'use strict';

const CITATIONS = ['AIUM_2024','SRU_VASCULAR_2024','ISUOG_OB_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function us_fast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.window, 'window', ['right_upper_quadrant','left_upper_quadrant','pelvic','subxiphoid_cardiac','right_lung','left_lung','all_extended']);
  ensureBool(req.free_fluid_present, 'free_fluid_present');
  ensureNumber(req.fluid_estimate_ml, 'fluid_estimate_ml');
  ensureBool(req.pericardial_effusion, 'pericardial_effusion');
  ensureEnum(req.interpretation, 'interpretation', ['negative','equivocal','positive_unstable','positive_stable','positive_critical','technically_difficult','incomplete','deferred_to_ct']);

  let fast_status;
  if (req.interpretation === 'positive_critical') fast_status = 'critical_positive_immediate_surgical_consult';
  else if (req.interpretation === 'positive_unstable') fast_status = 'positive_unstable_immediate_intervention';
  else if (req.interpretation === 'positive_stable') fast_status = 'positive_stable_observe_and_imaging_follow_up';
  else if (req.interpretation === 'equivocal') fast_status = 'equivocal_consider_ct_or_repeat_fast';
  else if (req.interpretation === 'technically_difficult') fast_status = 'technically_difficult_ct_recommended';
  else fast_status = 'negative_no_action';
  return { fast_status, interpretation: req.interpretation, fluid_ml: req.fluid_estimate_ml };
}

function us_vascular(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.exam_type, 'exam_type', ['carotid_duplex','dvt_lower','dvt_upper','arterial_lower','arterial_upper','renal_artery_duplex','mesenteric_artery','aaa_screen','venous_mapping','av_fistula','vein_graft','other']);
  ensureEnum(req.stenosis_band, 'stenosis_band', ['normal','less_than_20','20_to_50','50_to_70','70_to_99','occluded','subtotal_occluded','non_diagnostic','not_assessed']);
  ensureBool(req.bilateral, 'bilateral');
  ensureNumber(req.psv_cm_s, 'psv_cm_s');
  ensureEnum(req.plaque, 'plaque', ['none','minimal','mild','moderate','severe','complex','calcified','echolucent','ulcerated','not_assessed']);

  let vasc_status;
  if (req.stenosis_band === '70_to_99' || req.stenosis_band === 'occluded') vasc_status = 'significant_stenosis_or_occlusion_review_clinical';
  else if (req.exam_type === 'carotid_duplex' && req.stenosis_band === '50_to_70') vasc_status = 'moderate_stenosis_surveillance_or_intervention';
  else if (req.exam_type.includes('dvt') && req.stenosis_band === 'occluded') vasc_status = 'dvt_confirmed_anticoagulation';
  else if (req.plaque === 'ulcerated') vasc_status = 'ulcerated_plaque_high_embolic_risk';
  else if (req.stenosis_band === 'non_diagnostic') vasc_status = 'non_diagnostic_repeat_with_contrast_or_ancillary';
  else vasc_status = 'no_significant_disease';
  return { vasc_status, stenosis: req.stenosis_band, plaque: req.plaque };
}

function us_ob(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.efw_grams, 'efw_grams');
  ensureEnum(req.growth_percentile_band, 'growth_percentile_band', ['normal_appropriate','small_for_age','large_for_age','intrauterine_growth_restriction_suspected','macrosomia_suspected','not_assessed','pending']);
  ensureEnum(req.amniotic_fluid, 'amniotic_fluid', ['normal','oligohydramnios','polyhydramnios','anhydramnios','not_visualized']);
  ensureNumber(req.cervical_length_mm, 'cervical_length_mm');
  ensureEnum(req.doppler_umbilical, 'doppler_umbilical', ['normal','elevated_s_d_ratio','absent_end_diastolic','reversed_end_diastolic','not_assessed']);
  ensureBool(req.anatomy_survey_complete, 'anatomy_survey_complete');

  let ob_status;
  if (req.growth_percentile_band.includes('restriction') && req.doppler_umbilical.includes('reversed')) ob_status = 'iugr_with_reversed_doppler_high_risk';
  else if (req.amniotic_fluid === 'anhydramnios') ob_status = 'anhydramnios_evaluate_cause_and_delivery';
  else if (req.cervical_length_mm < 25 && req.gestational_age_weeks >= 16) ob_status = 'short_cervix_high_risk_ptl_review';
  else if (!req.anatomy_survey_complete && req.gestational_age_weeks >= 18) ob_status = 'anatomy_survey_incomplete_repeat';
  else ob_status = 'ob_ultrasound_within_normal';
  return { ob_status, growth: req.growth_percentile_band, fluid: req.amniotic_fluid };
}

function us_msk(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.joint, 'joint', ['shoulder','elbow','wrist','hand','hip','knee','ankle','foot','spine_cervical','spine_lumbar','temporomandibular','other']);
  ensureEnum(req.pathology_band, 'pathology_band', ['normal','tendinopathy','partial_tear','complete_tear','bursitis','effusion','synovitis','ganglion_cyst','mass','nerve_compression','foreign_body','bone_fracture','dislocation','avascular_necrosis','plantar_fasciitis','carpal_tunnel','rotator_cuff','meniscal_tear','acl_tear','other']);
  ensureBool(req.dynamic_assessment, 'dynamic_assessment');
  ensureBool(req.comparison_with_contralateral, 'comparison_with_contralateral');

  let msk_status;
  if (req.pathology_band === 'complete_tear' && req.joint === 'rotator_cuff') msk_status = 'complete_rotator_cuff_tear_refer_ortho';
  else if (req.pathology_band === 'acl_tear') msk_status = 'acl_tear_refer_ortho_for_reconstruction';
  else if (req.pathology_band === 'avascular_necrosis') msk_status = 'avn_urgent_ortho_referral';
  else if (!req.dynamic_assessment && req.joint === 'shoulder') msk_status = 'dynamic_assessment_recommended_for_shoulder';
  else if (req.pathology_band === 'normal') msk_status = 'normal_no_action';
  else msk_status = 'pathology_identified_clinical_correlate';
  return { msk_status, joint: req.joint, pathology: req.pathology_band };
}

function us_contrast(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.contrast_agent, 'contrast_agent', ['definity','luminity','sonazoid','optison','sonovue','other']);
  ensureNumber(req.dose_ml, 'dose_ml');
  ensureEnum(req.indication, 'indication', ['liver_lesion','kidney_lesion','breast_lesion','prostate','pancreas','endocavitary','lymph_node','tumor_vascularity','tumor_response_assessment','other']);
  ensureEnum(req.enhancement_phase, 'enhancement_phase', ['arterial','portal_venous','late','delayed','washout','persistent','none','hyper_arterial','hypo','mixed','other']);
  ensureBool(req.reaction_monitoring, 'reaction_monitoring');

  let contrast_status;
  if (!req.reaction_monitoring) contrast_status = 'reaction_monitoring_required_blocking';
  else if (req.enhancement_phase === 'washout' && req.indication === 'liver_lesion') contrast_status = 'washout_pattern_suspicious_for_malignancy';
  else if (req.enhancement_phase === 'persistent') contrast_status = 'persistent_enhancement_benign_pattern_likely';
  else contrast_status = 'contrast_ultrasound_complete';
  return { contrast_status, phase: req.enhancement_phase };
}

function funcs() { return { us_fast, us_vascular, us_ob, us_msk, us_contrast }; }
module.exports = { funcs, CITATIONS, ValidationError };