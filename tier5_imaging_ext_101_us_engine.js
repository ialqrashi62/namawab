// filepath: tier5_imaging_ext_101_us_engine.js
// TIER5_IMAGING_EXT-101: Ultrasound protocols (FAST, vascular, echo, OB, MSK, contrast)
'use strict';

const CITATIONS = [
  'AIUM_Ultrasound_Practice_2023',
  'ACR_Contrast_Enhanced_US_2022',
  'ASE_Echo_Guidelines_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function fast_scan(req) {
  ensureBool(req.trauma_mechanism_blunt, 'trauma_mechanism_blunt');
  ensureBool(req.hypotension_sbp_below_90, 'hypotension_sbp_below_90');
  ensureBool(req.negative_initial_fast, 'negative_initial_fast');
  ensureNumber(req.minutes_since_injury, 'minutes_since_injury');
  ensureStr(req.organ_view, 'organ_view');
  ensureEnum(req.organ_view, 'organ_view', ['pericardial','right_upper_quadran_morison_pouch','left_upper_quadran_splenorenal','pelvic_pouch','bilateral_pneumothorax_lung_apex','all_views']);

  let fluid_presence;
  if (req.negative_initial_fast && req.minutes_since_injury > 30) fluid_presence = 'consider_serial_fast_or_ct_then_surgical_review';
  else if (req.organ_view === 'all_views' && req.hypotension_sbp_below_90) fluid_presence = 'free_fluid_detected_then_immediate_surgical_consult';
  else if (req.organ_view === 'all_views') fluid_presence = 'free_fluid_check_complete';
  else fluid_presence = 'continue_with_each_view';

  return { fluid_presence };
}

function vascular_dvt(req) {
  ensureStr(req.vein, 'vein');
  ensureEnum(req.vein, 'vein', ['femoral_common','femoral_deep','popliteal','calf_pair','subclavian','internal_jugular']);
  ensureBool(req.compressibility_lost, 'compressibility_lost');
  ensureBool(req.flow_absent_on_doppler, 'flow_absent_on_doppler');
  ensureNumber(req.days_since_symptoms, 'days_since_symptoms');
  ensureBool(req.symptom_unilateral_pain_and_swelling, 'symptom_unilateral_pain_and_swelling');

  let interpretation;
  if (req.compressibility_lost && req.flow_absent_on_doppler && req.symptom_unilateral_pain_and_swelling) interpretation = 'acute_dvt_confirmed_then_anticoagulation';
  else if (req.compressibility_lost || req.flow_absent_on_doppler) interpretation = 'indeterminate_then_consider_venogram_or_repeat_in_3_5_days';
  else interpretation = 'no_dvt_then_alternative_diagnosis';

  return { interpretation };
}

function echo_view(req) {
  ensureStr(req.view, 'view');
  ensureEnum(req.view, 'view', ['plax','psax','apex_4chamber','subcostal','suprasternal','m_mode','doppler_pw','doppler_cw']);
  ensureNumber(req.lvef_pct, 'lvef_pct');
  ensureBool(req.pericardial_effusion, 'pericardial_effusion');
  ensureNumber(req.tapse_cm, 'tapse_cm');
  ensureBool(req.valve_calcification, 'valve_calcification');

  let summary;
  if (req.pericardial_effusion && req.view === 'subcostal') summary = 'pericardial_effusion_then_measure_size_with_diastolic_collapse';
  else if (req.lvef_pct < 30) summary = 'severely_reduced_lvef_then_continue_heart_failure_pathway';
  else if (req.lvef_pct < 50) summary = 'reduced_lvef_then_continue_optimal_medical_therapy';
  else if (req.view === 'doppler_pw' || req.view === 'doppler_cw') summary = 'continue_with_doppler_assessment';
  else summary = 'continue_with_quantitative_assessment';
  return { summary };
}

function ob_us(req) {
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.estimated_fetal_weight_g, 'estimated_fetal_weight_g');
  ensureBool(req.fetal_heart_rate_present, 'fetal_heart_rate_present');
  ensureNumber(req.amniotic_fluid_index_cm, 'amniotic_fluid_index_cm');
  ensureNumber(req.nuchal_translucency_mm, 'nuchal_translucency_mm');
  ensureBool(req.anatomical_survey_complete, 'anatomical_survey_complete');

  let impression;
  if (!req.fetal_heart_rate_present) impression = 'non_viable_pregnancy_then_review_with_ob';
  else if (req.amniotic_fluid_index_cm < 5) impression = 'oligohydramnios_then_consider_anatomy_review';
  else if (req.amniotic_fluid_index_cm > 24) impression = 'polyhydramnios_then_glucose_screen_with_ob';
  else if (req.gestational_age_weeks >= 11 && req.gestational_age_weeks <= 14 && req.nuchal_translucency_mm > 3.5) impression = 'consider_genetic_counseling_and_advanced_screening';
  else if (req.anatomical_survey_complete) impression = 'continue_with_reassuring_impression';
  else impression = 'continue_with_ob_follow_up';

  return { impression };
}

function msk_us(req) {
  ensureStr(req.joint_or_tendon, 'joint_or_tendon');
  ensureEnum(req.joint_or_tendon, 'joint_or_tendon', ['rotator_cuff','achilles','plantar_fascia','elbow_lateral_epicondyle','wrist_carpal_tunnel','hip_gluteus','knee_quadriceps']);
  ensureBool(req.full_thickness_tear, 'full_thickness_tear');
  ensureNumber(req.thickness_mm, 'thickness_mm');
  ensureBool(req.bursal_fluid, 'bursal_fluid');

  let finding;
  if (req.full_thickness_tear) finding = 'full_thickness_tear_then_consider_mri_review_and_orthopedic_referral';
  else if (req.thickness_mm >= 10) finding = 'thickened_tendon_then_continue_with_therapeutic_options';
  else if (req.bursal_fluid) finding = 'bursal_fluid_then_drain_or_consider_steroid_injection';
  else finding = 'continue_with_imaging_review';
  return { finding };
}

function contrast_us(req) {
  ensureStr(req.organ, 'organ');
  ensureEnum(req.organ, 'organ', ['liver_focal_lesion','kidney_mass','pancreas_lesion','breast_lesion','lymph_node','vessel_pseudoaneurysm']);
  ensureBool(req.lesion_seen_on_grey_scale, 'lesion_seen_on_grey_scale');
  ensureStr(req.enhancement_pattern, 'enhancement_pattern');
  ensureEnum(req.enhancement_pattern, 'enhancement_pattern', ['arterial_centric','portal_centric','delayed_centric','washout_centric','no_enhancement','rim_enhancement','peripheral_nodular']);
  ensureBool(req.allergy_to_ultrasound_contrast, 'allergy_to_ultrasound_contrast');

  let interpretation;
  if (req.allergy_to_ultrasound_contrast) interpretation = 'avoid_ultrasound_contrast_then_consider_alternative_imaging';
  else if (req.enhancement_pattern === 'washout_centric' && req.organ === 'liver_focal_lesion') interpretation = 'suspicious_for_malignancy_then_refer_multidisciplinary_tumor_board';
  else if (req.enhancement_pattern === 'peripheral_nodular' && req.organ === 'liver_focal_lesion') interpretation = 'benign_hemangioma_pattern';
  else interpretation = 'continue_with_imaging_review';
  return { interpretation };
}

function funcs() { return { fast_scan, vascular_dvt, echo_view, ob_us, msk_us, contrast_us }; }
module.exports = { funcs, CITATIONS, ValidationError };
