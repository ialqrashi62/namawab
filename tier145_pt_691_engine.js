// filepath: tier145_pt_691_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function assessment(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.body_part, 'bp');
  ensureEnum(req.condition, 'cd', ['acute','subacute','chronic','post_surgical','post_injury','neurological','sports','workplace','ergonomic','other']);
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.range_motion, 'rm');
  ensureNum(req.strength, 'st');
  ensureNum(req.endurance, 'en');
  ensureStr(req.goals, 'go');
  ensureStr(req.provider, 'pr');
  return { ax_id: `asx_${Date.now()}`, patient_id: req.patient_id, body_part: req.body_part, condition: req.condition };
}
function exercise(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.session_id, 'si');
  ensureStr(req.exercise_name, 'en');
  ensureEnum(req.category, 'ct', ['strength','endurance','flexibility','balance','proprioception','ROM','cardio','breathing','relaxation','neuromotor','task_specific','manual','modalities','other']);
  ensureNum(req.sets, 'st');
  ensureNum(req.reps, 'rp');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.borg_rpe, 'br');
  ensureStr(req.provider, 'pr');
  return { ex_id: `ext_${Date.now()}`, session_id: req.session_id, exercise: req.exercise_name, sets: req.sets };
}
function manual(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.session_id, 'si');
  ensureEnum(req.technique, 'tc', ['mobilization','manipulation','myofascial_release','trigger_point','strain_counterstrain','muscle_energy','PNF','Maitland','Kaltenborn','craniosacral','lymphatic','visceral','strain_counterstrain','craniosacral','other']);
  ensureNum(req.duration_min, 'du');
  ensureStr(req.body_part, 'bp');
  ensureNum(req.outcome_score, 'os');
  ensureStr(req.provider, 'pr');
  return { mn_id: `mnl_${Date.now()}`, session_id: req.session_id, technique: req.technique };
}
function modality(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.session_id, 'si');
  ensureEnum(req.type, 'tp', ['ultrasound','TENS','NMES','IFC','heat','cryotherapy','hot_cold','photobiomodulation','laser','shockwave','diathermy','traction','massage','other']);
  ensureNum(req.intensity_pct, 'ip');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.frequency_hz, 'fz');
  ensureStr(req.params, 'pa');
  ensureStr(req.provider, 'pr');
  return { md_id: `mod_${Date.now()}`, session_id: req.session_id, type: req.type, duration: req.duration_min };
}
function discharge(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.sessions_attended, 'sa');
  ensureNum(req.sessions_planned, 'sp');
  ensureNum(req.adherence_pct, 'ap');
  ensureNum(req.dyspnea_score, 'ds');
  ensureNum(req.tug_sec, 'tu');
  ensureNum(req.outcome_score, 'os');
  ensureEnum(req.reason, 'rs', ['planned_discharge','goal_met','patient_request','nonadherence','comorbid','insurance','relocation','plateau','other']);
  ensureStr(req.provider, 'pr');
  return { dc_id: `ptd_${Date.now()}`, patient_id: req.patient_id, sessions: req.sessions_attended, reason: req.reason };
}

function funcs() { return { assessment, exercise, manual, modality, discharge }; }
module.exports = { funcs, ValidationError };
