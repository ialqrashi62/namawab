// filepath: tier25_rehab_ext_160_prosthetic_engine.js
// TIER25_REHAB-160: Prosthetics, orthotics, wheelchair
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function prosthetic_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.amputation_level, 'amputation_level', ['toe','transmetatarsal','symes','below_knee_transtibial','knee_disarticulation','above_knee_transfemoral','hip_disarticulation','transhumeral','shoulder_disarticulation','forequarter','partial_foot','partial_hand','other']);
  ensureNumber(req.days_post_amputation, 'days');
  ensureEnum(req.residual_limb_shape, 'residual_limb_shape', ['cylindrical','bulbous','conical','irregular','other']);
  ensureBool(req.skin_intact, 'skin');
  ensureNumber(req.range_of_motion_deg, 'rom');
  let status;
  if (req.days_post_amputation < 14) status = 'acute_post_op_wound_care_first';
  else if (req.days_post_amputation < 90) status = 'pre_prosthetic_phase_shrinker';
  else if (!req.skin_intact) status = 'skin_breakdown_address_before_casting';
  else if (req.range_of_motion_deg < 90 && req.amputation_level === 'below_knee_transtibial') status = 'limited_knee_rom_review';
  else status = 'prosthetic_assessment_appropriate';
  return { status, level: req.amputation_level };
}

function prosthetic_socket(req) {
  ensureStr(req.socket_id, 'socket_id');
  ensureEnum(req.socket_type, 'socket_type', ['pts','tsb','icex','mas_socket','flexible_inner','suction_pin','lanyard','other']);
  ensureBool(req.proper_fit, 'fit');
  ensureBool(req.skin_irritation, 'skin');
  ensureNumber(req.pressure_pistoning_mm, 'pistoning');
  ensureBool(req.suspension_adequate, 'suspension');
  let status;
  if (!req.proper_fit) status = 'socket_refit_required';
  else if (req.skin_irritation) status = 'skin_irritation_reduce_load_add_liner';
  else if (req.pressure_pistoning_mm > 5) status = 'excessive_pistoning_resocket';
  else if (!req.suspension_adequate) status = 'suspension_review_pin_or_lanyard';
  else status = 'socket_fit_adequate';
  return { status, type: req.socket_type };
}

function orthotic_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.orthosis_type, 'orthosis_type', ['afo','knee_orthosis','hip_orthosis','thoracolumbar','lso','wrist_hand','upper_limb','spinal','cranial','foot_orthosis','ucb','smo','other']);
  ensureBool(req.proper_fit, 'fit');
  ensureBool(req.skin_breakdown, 'skin');
  ensureBool(req.function_improved, 'function');
  ensureNumber(req.wear_hours_per_day, 'wear');
  let status;
  if (req.skin_breakdown) status = 'skin_breakdown_reduce_wear_or_refit';
  else if (!req.proper_fit) status = 'orthosis_refit_required';
  else if (!req.function_improved && req.wear_hours_per_day > 4) status = 'no_functional_gain_review_indication';
  else if (req.wear_hours_per_day < 2) status = 'low_wear_compliance_counsel';
  else status = 'orthosis_appropriate';
  return { status, type: req.orthosis_type };
}

function wheelchair_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.wheelchair_type, 'wheelchair_type', ['manual_k1','manual_k2','manual_k3','manual_k4','manual_sport','manual_bariatric','power_k1','power_k2','power_k3','power_k4','scooter','tilt_in_space','standing','pediatric','other']);
  ensureBool(req.proper_seating, 'seating');
  ensureBool(req.skin_check_documented, 'skin');
  ensureBool(req.propulsion_adequate, 'propulsion');
  ensureNumber(req.years_since_received, 'years');
  let status;
  if (!req.proper_seating) status = 'seating_review_cushion_positioning';
  else if (!req.skin_check_documented) status = 'skin_check_required_for_chair_users';
  else if (req.years_since_received > 5) status = 'over_5y_review_replacement';
  else if (req.wheelchair_type === 'manual_k1' && !req.propulsion_adequate) status = 'k1_consider_power_for_function';
  else status = 'wheelchair_appropriate';
  return { status, type: req.wheelchair_type };
}

function gait_train(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.gait_phase, 'gait_phase', ['pre_gait','parallel_bars','lite_walking','community_walking','stairs','uneven_terrain','running','other']);
  ensureNumber(req.distance_m, 'distance');
  ensureBool(req.use_prosthesis, 'prosthesis');
  ensureBool(req.falls_during_session, 'falls');
  ensureBool(req.completed_goals, 'goals');
  let status;
  if (req.falls_during_session) status = 'falls_review_prosthesis_and_balance';
  else if (req.gait_phase === 'community_walking' && !req.use_prosthesis) status = 'community_no_prosthesis_review';
  else if (!req.completed_goals && req.distance_m < 50) status = 'short_distance_review_goals';
  else status = 'gait_training_appropriate';
  return { status, phase: req.gait_phase };
}

const CITATIONS = { ABCP_PROS_2024: 'ABCP Prosthetics 2024', ABC_ORTH_2024: 'ABC Orthotics 2024', RESNA_2024: 'RESNA Wheelchair 2024' };

function funcs() { return { prosthetic_assess, prosthetic_socket, orthotic_assess, wheelchair_assess, gait_train }; }
module.exports = { funcs, CITATIONS, ValidationError };