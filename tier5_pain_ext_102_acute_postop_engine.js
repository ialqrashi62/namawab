// filepath: tier5_pain_ext_102_acute_postop_engine.js
// TIER5_PAIN_EXT-102: Acute postoperative / procedural / OB analgesia
'use strict';

const CITATIONS = [
  'PROSPECT_Perioperative_2023',
  'ERAS_Protocols_2022',
  'ASA_Acute_Pain_2018',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function pmra_intensity(req) {
  ensureNumber(req.movement_pain_nrs, 'movement_pain_nrs');
  ensureNumber(req.rest_pain_nrs, 'rest_pain_nrs');
  ensureNumber(req.paracetamol_dose_grams, 'paracetamol_dose_grams');
  ensureNumber(req.iv_oxycodone_mg, 'iv_oxycodone_mg');
  ensureBool(req.continuous_epidural_active, 'continuous_epidural_active');

  if (req.movement_pain_nrs < 0 || req.movement_pain_nrs > 10) throw new ValidationError('nrs 0..10', 'movement_pain_nrs');

  let pmra;
  if (req.continuous_epidural_active && req.movement_pain_nrs <= 2) pmra = 'good_continue_obs';
  else if (req.movement_pain_nrs <= 3 && req.paracetamol_dose_grams >= 3.5) pmra = 'good_partial_response';
  else if (req.movement_pain_nrs <= 4) pmra = 'mild_response_ok';
  else if (req.movement_pain_nrs <= 6) pmra = 'moderate_targeted_team_for_add_or_increase';
  else pmra = 'high_specialty_consult_recommend_nerve_block_iv_pca';

  if (req.iv_oxycodone_mg > 30) pmra += '_consider_pca_or_decreasing_opioid_use_with_paracetamol';

  return { pmra, iv_opioid_load_mg: req.iv_oxycodone_mg, movement_pain_nrs: req.movement_pain_nrs };
}

function enhanced_recovery(req) {
  ensureStr(req.surgery_type, 'surgery_type');
  ensureEnum(req.surgery_type, 'surgery_type', ['colorectal','ortho_hip','ortho_knee','cardiothoracic','general_abdominal','thoracic_vats','gynecologic','csection','cystectomy','laparoscopic_chole']);
  ensureBool(req.opioid_sparing_epidural, 'opioid_sparing_epidural');
  ensureBool(req.laparoscopic_or_minimally_invasive, 'laparoscopic_or_minimally_invasive');
  ensureNumber(req.length_of_stay_expected_days, 'length_of_stay_expected_days');

  let path = [];
  path.push('carbohydrate_load_2_preop_1_postop');
  path.push('no_long_perioperative_fasting_in_ADV');
  if (req.surgery_type === 'csection') path.push('transversus_abdominis_block_with_ropivacaine_q24h_to_q48h');
  if (req.surgery_type === 'ortho_hip' || req.surgery_type === 'ortho_knee') path.push('periarticular_infiltration_with_ropivacaine_ketorolac');
  if (req.opioid_sparing_epidural) path.push('epidural_or_peripheral_nerve_catheter_until_pod_2_to_4');
  if (req.laparoscopic_or_minimally_invasive) path.push('iatrogenic_nerve_block_single_shot_liposomal_ropivacaine');
  path.push('continuation_of_oral_paracetamol_and_nsaid_unless_caution');
  if (req.surgery_type === 'colorectal') path.push('laxative_program_pod_1');

  return {
    surgery_type: req.surgery_type,
    path,
    expected_los: req.length_of_stay_expected_days,
    citations: CITATIONS,
  };
}

function nerve_block_check(req) {
  ensureStr(req.block_name, 'block_name');
  ensureEnum(req.block_name, 'block_name', ['femoral_nerve','sciatic_nerve','popliteal_sciatic','interscalene','supraclavicular','axillary','transversus_abdominis_plane','paravertebral','lumbar_epidural','thoracic_epidural']);
  ensureNumber(req.local_anesthetic_total_volume_ml, 'local_anesthetic_total_volume_ml');
  ensureNumber(req.local_anesthetic_concentration_pct, 'local_anesthetic_concentration_pct');
  ensureNumber(req.catheter_present, 'catheter_present'); // 0/1
  ensureNumber(req.last_dose_hours_ago, 'last_dose_hours_ago');

  const max_volume = { femoral_nerve: 30, sciatic_nerve: 25, popliteal_sciatic: 30, interscalene: 20, supraclavicular: 20, axillary: 25, transversus_abdominis_plane: 40, paravertebral: 30, lumbar_epidural: 5, thoracic_epidural: 5 }[req.block_name];
  let verdict;
  if (req.local_anesthetic_total_volume_ml > max_volume * 1.5) verdict = 'block_volume_above_safe_limit_stop_or_reduce';
  else if (req.catheter_present && req.last_dose_hours_ago < 1) verdict = 'redosing_too_often_reduce_q1h_ax_lower';
  else if (req.block_name === 'thoracic_epidural' && req.local_anesthetic_concentration_pct >= 0.5) verdict = 'doses_within_bounds_continue';
  else verdict = 'block_within_safe_continuation';

  return { block_name: req.block_name, total_volume_ml: req.local_anesthetic_total_volume_ml, verdict };
}

function patient_controlled(req) {
  ensureNumber(req.mcg_baseline_use, 'mcg_baseline_use');
  ensureNumber(req.bolus_mg, 'bolus_mg');
  ensureNumber(req.lockout_min, 'lockout_min');
  ensureNumber(req.hourly_max_mg, 'hourly_max_mg');
  ensureNumber(req.total_demands_4h, 'total_demands_4h');
  ensureNumber(req.total_delivered_4h_mg, 'total_delivered_4h_mg');

  let signal;
  if (req.total_demands_4h > 0 && req.total_delivered_4h_mg / req.total_demands_4h >= req.bolus_mg * 0.8) signal = 'adequate_analgesia_continue';
  else if (req.total_delivered_4h_mg === 0 && req.total_demands_4h >= 4) signal = 'consider_re_titration_or_nsaid_addition';
  else if (req.total_delivered_4h_mg >= req.hourly_max_mg * 4 * 0.8) signal = 'max_doses_continue_with_concern_around_monitoring_respiratory_status';
  else signal = 'ineffective_analgesia_pursue_other_analgesia_refer_to_pain_team';

  return {
    signal,
    bolus_mg: req.bolus_mg,
    lockout_min: req.lockout_min,
    hourly_max_mg: req.hourly_max_mg,
    delivered_4h_mg: req.total_delivered_4h_mg,
    demands_4h: req.total_demands_4h,
  };
}

function ob_analgesia(req) {
  ensureStr(req.ob_phase, 'ob_phase');
  ensureEnum(req.ob_phase, 'ob_phase', ['labor','vacuum_forceps','csection_intraop','post_csection','post_partum']);
  ensureNumber(req.pain_intensity_nrs, 'pain_intensity_nrs');
  ensureBool(req.breastfeeding, 'breastfeeding');
  ensureNumber(req.epidural_running, 'epidural_running'); // 0 or 1

  let approach;
  if (req.ob_phase === 'labor' && req.epidural_running) approach = 'epidural_topup_with_ropivacaine_0_1_pct_8_to_12_ml_2pct_lido';
  else if (req.ob_phase === 'post_csection' && req.breastfeeding) approach = 'paracetamol_q6_plus_ibuprofen_q6_then_tramadol_or_morphine_orally_pca';
  else if (req.ob_phase === 'vacuum_forceps') approach = 'pudendal_block_or_local_infiltration_if_no_epidural';
  else if (req.ob_phase === 'csection_intraop') approach = 'spinal_anesthesia_or_neuraxial_then_postop_tap_block';
  else if (req.ob_phase === 'post_partum') approach = 'paracetamol_q6_plus_ibuprofen_q6_then_controlled_oxycodone_short_course';
  else approach = 'general_ob_principles_continue_baseline_plan';

  return { ob_phase: req.ob_phase, pain_intensity_nrs: req.pain_intensity_nrs, approach, citation: CITATIONS[2] };
}

function funcs() {
  return { pmra_intensity, enhanced_recovery, nerve_block_check, patient_controlled, ob_analgesia };
}

module.exports = { funcs, CITATIONS, ValidationError };
