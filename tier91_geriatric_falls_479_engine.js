// filepath: tier91_geriatric_falls_479_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function fall_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.falls_last_year, 'fly');
  ensureNum(req.tug_seconds, 'tug');
  ensureNum(req.morse_score, 'ms');
  ensureNum(req.stratify_score, 'ss');
  ensureBool(req.balance_impairment, 'bi');
  ensureBool(req.gait_impairment, 'gi');
  ensureBool(req.muscle_weakness, 'mw');
  ensureNum(req.vision_score, 'vis');
  ensureNum(req.cognition_score, 'cog');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','very_high','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function home_safety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.bathroom_grab_bars, 'bgb');
  ensureBool(req.raised_toilet_seat, 'rts');
  ensureBool(req.bath_mat, 'bm');
  ensureBool(req.good_lighting, 'gl');
  ensureBool(req.no_loose_rugs, 'nlr');
  ensureBool(req.stair_handrails, 'shr');
  ensureBool(req.clutter_free, 'cf');
  ensureNum(req.home_modifications, 'hm');
  ensureNum(req.assistive_devices, 'ad');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function balance_training(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.program_type, 'pt', ['otago','tai_chi','vestibular','standard_pt','other','unknown']);
  ensureNum(req.sessions_per_week, 'spw');
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.balance_improvement, 'bi');
  ensureNum(req.strength_score, 'ss');
  ensureBool(req.home_exercise, 'he');
  ensureNum(req.compliance_pct, 'comp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function post_fall(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'iid');
  ensureNum(req.fall_time, 'ft');
  ensureStr(req.fall_location, 'fl');
  ensureBool(req.injury, 'inj');
  ensureEnum(req.injury_type, 'it', ['none','laceration','fracture','head_injury','sprain','other','unknown']);
  ensureNum(req.hospitalization_days, 'hd');
  ensureBool(req.fear_of_falling, 'fof');
  ensureNum(req.activity_reduction, 'ar');
  ensureStr(req.provider, 'pr');
  return { iid: req.incident_id };
}
function fall_prevention(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.medications_reviewed, 'mr');
  ensureNum(req.medications_discontinued, 'md');
  ensureNum(req.vision_correction, 'vc');
  ensureNum(req.footwear_assessment, 'fwa');
  ensureNum(req.bone_density_test, 'bdt');
  ensureNum(req.vitamin_d_level, 'vdl');
  ensureNum(req.calcium_intake, 'ca');
  ensureBool(req.exercise_program, 'ep');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}

function funcs() { return { fall_risk, home_safety, balance_training, post_fall, fall_prevention }; }
module.exports = { funcs, ValidationError };
