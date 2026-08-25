// filepath: tier116_ot_extended_611_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function adl_training(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.adl_type, 'at', ['dressing','bathing','grooming','toileting','feeding','cooking','other','unknown']);
  ensureEnum(req.independence_level, 'il', ['dependent','max_assist','mod_assist','min_assist','supervised','modified_independent','independent','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.goal_progress_pct, 'gpp');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function splinting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fitting_id, 'fid');
  ensureEnum(req.splint_type, 'st', ['hand','wrist','ankle','knee','elbow','other','unknown']);
  ensureEnum(req.material, 'mat', ['thermoplastic','plaster','fabric','combination','other','unknown']);
  ensureEnum(req.wearing_schedule, 'ws', ['night','day','continuous','intermittent','other','unknown']);
  ensureNum(req.skin_integrity, 'si');
  ensureStr(req.provider, 'pr');
  return { fid: req.fitting_id };
}
function assistive_tech(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.device, 'dev');
  ensureStr(req.purpose, 'pur');
  ensureNum(req.training_hours, 'th');
  ensureBool(req.adoption, 'ad');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cognitive_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureEnum(req.area, 'ar', ['memory','attention','executive','language','visuospatial','other','unknown']);
  ensureNum(req.tasks, 'tsk');
  ensureNum(req.score_pre, 'sp');
  ensureNum(req.score_post, 'spo');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function work_rehab(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureNum(req.goals, 'gl');
  ensureNum(req.work_simulation_hours, 'wsh');
  ensureEnum(req.tolerance, 'tol', ['poor','fair','improving','good','excellent','other','unknown']);
  ensureEnum(req.placement, 'pl', ['trial','partial','full','unemployed','retired','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}

function funcs() { return { adl_training, splinting, assistive_tech, cognitive_rehab, work_rehab }; }
module.exports = { funcs, ValidationError };