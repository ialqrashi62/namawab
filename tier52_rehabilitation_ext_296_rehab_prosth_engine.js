// filepath: tier52_rehabilitation_ext_296_rehab_prosth_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function upper_limb_prosthetic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.level, 'lvl', ['partial_hand','transcarpal','wrist_disarticulation','transradial','elbow_disarticulation','transhumeral','shoulder_disarticulation']);
  ensureStr(req.side, 'sd');
  ensureEnum(req.terminal_device, 'td', ['myoelectric_hand','body_powered_hook','cosmetic','partial_hand','bionic_multi_grip']);
  ensureStr(req.control, 'ctrl');
  ensureStr(req.socket_suspension, 'ss');
  ensureNum(req.training_hours_completed, 'th');
  return { level: req.level };
}
function lower_limb_prosthetic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.level, 'lvl', ['toe','transmetatarsal','syme','below_knee','knee_disarticulation','above_knee','hip_disarticulation']);
  ensureStr(req.side, 'sd');
  ensureStr(req.foot_type, 'ft');
  ensureStr(req.socket, 'sock');
  ensureStr(req.knee_unit, 'ku');
  ensureStr(req.gait_deviation, 'gd');
  return { level: req.level };
}
function orthotic_bracing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['ankle_foot_orthosis','knee_ankle_foot_orthosis','knee_orthosis','wrist_hand_orthosis','elbow_orthosis','hip_orthosis']);
  ensureStr(req.side, 'sd');
  ensureStr(req.condition, 'cond');
  ensureStr(req.material, 'mat');
  ensureEnum(req.custom_or_off_shelf, 'cos', ['custom','off_shelf','modular','hybrid']);
  ensureEnum(req.response, 'resp', ['good_stability','adequate','poor_fit','skin_irritation']);
  return { type: req.type };
}
function spinal_orthosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['tlsso','lso','tlso','cervical_collar','halo','miami_j','jewett','chairback']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.wear_schedule, 'ws');
  ensureNum(req.duration_weeks, 'dur');
  return { type: req.type };
}
function wheelchair_seating(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.chair_type, 'ct', ['manual_rear_wheel','manual_tilting','power_rear','power_front','power_mid','scooter','standing']);
  ensureStr(req.cushion, 'cush');
  ensureStr(req.back, 'bk');
  ensureEnum(req.fit_score, 'fs', ['good','adequate','poor','recheck_fit','new_seating_needed']);
  ensureNum(req.training_hours, 'th');
  return { chair_type: req.chair_type };
}

function funcs() { return { upper_limb_prosthetic, lower_limb_prosthetic, orthotic_bracing, spinal_orthosis, wheelchair_seating }; }
module.exports = { funcs, ValidationError };