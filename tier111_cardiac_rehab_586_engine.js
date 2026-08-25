// filepath: tier111_cardiac_rehab_586_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function enrollment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.enrollment_id, 'eid');
  ensureEnum(req.phase, 'ph', ['phase_1','phase_2','phase_3','phase_4','maintenance','other','unknown']);
  ensureNum(req.sessions_prescribed, 'sp');
  ensureNum(req.sessions_attended, 'sa');
  ensureEnum(req.risk_category, 'rc', ['low','moderate','high','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.enrollment_id };
}
function exercise_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.exercise_id, 'eid');
  ensureEnum(req.phase, 'ph', ['phase_1','phase_2','phase_3','phase_4','maintenance','other','unknown']);
  ensureNum(req.mets, 'mets');
  ensureNum(req.duration_min, 'dur');
  ensureEnum(req.mode, 'md', ['treadmill','bike','rowing','elliptical','walking','other','unknown']);
  ensureEnum(req.intensity, 'int', ['light','moderate','vigorous','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { eid: req.exercise_id };
}
function education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.education_id, 'eid');
  ensureStr(req.topic, 'top');
  ensureEnum(req.format, 'fmt', ['individual','group','online','print','video','other','unknown']);
  ensureNum(req.attendees, 'att');
  ensureNum(req.understanding_score, 'us');
  ensureStr(req.provider, 'pr');
  return { eid: req.education_id };
}
function outcome_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.outcome_id, 'oid');
  ensureNum(req.weeks_in_program, 'wip');
  ensureNum(req.met_capacity, 'mc');
  ensureNum(req.improvement_pct, 'ip');
  ensureEnum(req.function, 'fn', ['improved','plateau','regressed','stable','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { oid: req.outcome_id };
}
function completion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.completion_id, 'cid');
  ensureNum(req.total_sessions, 'ts');
  ensureNum(req.met_capacity, 'mc');
  ensureEnum(req.discharge, 'dc', ['completed','discharged_early','transferred','lost_to_fu','withdrew','other','unknown']);
  ensureBool(req.follow_up, 'fu');
  ensureStr(req.provider, 'pr');
  return { cid: req.completion_id };
}

function funcs() { return { enrollment, exercise_session, education, outcome_assessment, completion }; }
module.exports = { funcs, ValidationError };