// filepath: tier116_pt_extended_610_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function manual_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.technique, 'tech', ['mobilization','manipulation','massage','myofascial','trigger_point','other','unknown']);
  ensureStr(req.region, 'reg');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.pain_score_pre, 'psp');
  ensureNum(req.pain_score_post, 'pspt');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function therapeutic_exercise(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['strengthening','flexibility','balance','endurance','combination','other','unknown']);
  ensureNum(req.muscle_groups, 'mg');
  ensureNum(req.sets, 'sets');
  ensureNum(req.reps, 'reps');
  ensureEnum(req.resistance_level, 'rl', ['none','light','medium','heavy','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function gait_analysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.analysis_id, 'aid');
  ensureNum(req.speed_m_per_s, 'sp');
  ensureNum(req.cadence_steps_per_min, 'cspm');
  ensureNum(req.stride_length_m, 'sl');
  ensureNum(req.asymmetry_pct, 'asy');
  ensureEnum(req.assistive_device, 'ad', ['none','cane','crutch','walker','rollator','wheelchair','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.analysis_id };
}
function aquatic_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.type, 'tp', ['pool','deep_water','aquatic_bike','resistance','combination','other','unknown']);
  ensureNum(req.exercises, 'ex');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.temperature_c, 'temp');
  ensureEnum(req.depth, 'dp', ['waist','chest','shoulder','deep','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function work_hardening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNum(req.tasks, 'tsk');
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.heart_rate_max_pct, 'hrm');
  ensureEnum(req.tolerance, 'tol', ['poor','fair','good','excellent','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}

function funcs() { return { manual_therapy, therapeutic_exercise, gait_analysis, aquatic_therapy, work_hardening }; }
module.exports = { funcs, ValidationError };