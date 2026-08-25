// filepath: tier5_rehab_ext_104_amputee_prosthetic_engine.js
// TIER5_REHAB_EXT-104: Amputee rehab / prosthetics (amputation level, gait, residual, phantom)
'use strict';

const CITATIONS = [
  'APTA_Amputee_Guidelines',
  'AAOP_Prosthetic_Standards_2019',
  'Borg_Holmquist_Functional_Outcome_2018',
  'Moseley_Phantom_Limb_2017',
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

function amputation_level(req) {
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['transmetatarsal','symes','below_knee_transtibial','knee_disartic','above_knee_transfemoral','hip_disartic','transradial','transhumeral','wrist_disartic','shoulder_disartic']);

  const ambulation = {
    transmetatarsal: 'community_ambulator_with_FOS',
    symes: 'community_ambulator_with_FOS',
    below_knee_transtibial: 'community_ambulator_through_K1_K3',
    knee_disartic: 'limited_community',
    above_knee_transfemoral: 'limited_community_with_K1_K2_advanced_knee',
    hip_disartic: 'household_with_K1_advanced',
    transradial: 'functional_body_powered_hook_myob',
    transhumeral: 'limited_with_myob_advanced_sockets',
    wrist_disartic: 'functional',
    shoulder_disartic: 'limited_with_body_powered_passive',
  }[req.level];

  return { level: req.level, ambulation_potential: ambulation, citations: CITATIONS };
}

function pros_fit(req) {
  ensureStr(req.socket_fit, 'socket_fit');
  ensureEnum(req.socket_fit, 'socket_fit', ['intimate','good','acceptable','poor']);
  ensureNumber(req.suspension_type_score, 'suspension_type_score'); // 0..10
  ensureNumber(req.liner_type_score, 'liner_type_score'); // 0..10
  ensureNumber(req.align_offset_cm, 'align_offset_cm'); // abduction/adduction deviation
  ensureNumber(req.shrinker_stumps_worn_hours_per_day, 'shrinker_stumps_worn_hours_per_day');

  const socket_score = { intimate: 100, good: 85, acceptable: 60, poor: 30 }[req.socket_fit];
  const composite = (0.4 * socket_score) + (0.2 * req.suspension_type_score * 10) + (0.2 * req.liner_type_score * 10) + (0.2 * Math.max(0, 100 - Math.abs(req.align_offset_cm) * 10));
  const wear_factor = req.shrinker_stumps_worn_hours_per_day >= 12 && req.shrinker_stumps_worn_hours_per_day <= 23;

  let signal;
  if (composite >= 80 && wear_factor) signal = 'fit_optimal';
  else if (composite >= 60) signal = 'acceptable_schedule_review';
  else signal = 'poor_fit_refer_to_prosthetist';
  return { composite_score: Math.round(composite * 10) / 10, socket_score, signal, citations: CITATIONS };
}

function gait_training(req) {
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['below_knee_transtibial','above_knee_transfemoral','symes']);
  ensureNumber(req.sessions_attended, 'sessions_attended');
  ensureNumber(req.weight_bearing_pct, 'weight_bearing_pct');
  ensureNumber(req.pwb_steps_per_minute, 'pwb_steps_per_minute');
  ensureBool(req.single_post_assist, 'single_post_assist');

  const composite = (0.5 * req.weight_bearing_pct) + (0.3 * Math.min(60, req.pwb_steps_per_minute) / 60 * 100) + (0.2 * (req.sessions_attended >= 12 ? 100 : Math.min(100, req.sessions_attended * 6)));
  let goal;
  if (req.level === 'below_knee_transtibial') goal = 'community_ambulator_K3_3m_to_5m_per_sec_3min';
  else if (req.level === 'above_knee_transfemoral') goal = 'limited_community_K2_stairs_with_handrail';
  else goal = 'household_ambulator_K1_with_walking_aid';

  return {
    level: req.level,
    composite: Math.round(composite * 10) / 10,
    assistive_device: req.single_post_assist ? 'single_point_cane' : 'standard_walker',
    goal,
    citations: CITATIONS,
  };
}

function residual_limb_eval(req) {
  ensureStr(req.shape, 'shape');
  ensureEnum(req.shape, 'shape', ['cylindrical','bulbous','conical','ideal']);
  ensureNumber(req.length_cm, 'length_cm');
  ensureBool(req.fluid_volatility, 'fluid_volatility');
  ensureBool(req.wound_present, 'wound_present');
  ensureBool(req.skin_breakdown, 'skin_breakdown');
  ensureBool(req.nerve_pain_referral, 'nerve_pain_referral');

  const flags = [req.fluid_volatility, req.wound_present, req.skin_breakdown, req.nerve_pain_referral].filter(Boolean).length;
  let socket_status;
  if (req.shape === 'ideal' && flags === 0) socket_status = 'casting_now_or_already_received';
  else if (flags >= 2) socket_status = 'defer_socket_pending_resolution';
  else socket_status = 'modify_socket_evaluate_in_2_weeks';
  return {
    shape: req.shape,
    length_cm: req.length_cm,
    complication_flags: flags,
    socket_status,
    citations: CITATIONS,
  };
}

function phantom_pain(req) {
  ensureNumber(req.pain_intensity_numeric, 'pain_intensity_numeric'); // 0..10
  ensureNumber(req.episodes_per_day, 'episodes_per_day');
  ensureNumber(req.duration_minutes, 'duration_minutes');
  ensureNumber(req.uso_function_pct, 'uso_function_pct');
  if (req.pain_intensity_numeric < 0 || req.pain_intensity_numeric > 10) throw new ValidationError('pain 0..10', 'pain_intensity_numeric');

  const score = req.pain_intensity_numeric * 10;
  let ladder;
  if (score < 30 && req.episodes_per_day < 3) ladder = 'mirror_therapy_graded_motor_imagery';
  else if (score < 60) ladder = 'memantine_or_gabapentin_TENS_desensitization';
  else if (score < 80) ladder = 'gabapentinoid_plus_TENS_psychology';
  else ladder = 'multimodal_with_neuropathic_interventional_clinic';
  return {
    pain_intensity: req.pain_intensity_numeric,
    episodes_per_day: req.episodes_per_day,
    use_function_pct: req.uso_function_pct,
    recommended_ladder: ladder,
    citations: CITATIONS,
  };
}

function funcs() {
  return { amputation_level, pros_fit, gait_training, residual_limb_eval, phantom_pain };
}

module.exports = { funcs, CITATIONS, ValidationError };
