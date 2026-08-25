// filepath: tier129_mental_664_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function phq9(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.phq_id, 'pid');
  ensureNum(req.score, 'sc');
  ensureEnum(req.severity, 'sev', ['none','mild','moderate','moderately_severe','severe','other','unknown']);
  ensureNum(req.item9_score, 'i9');
  ensureStr(req.provider, 'pr');
  return { pid: req.phq_id };
}
function gad7(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.gad_id, 'gid');
  ensureNum(req.score, 'sc');
  ensureEnum(req.severity, 'sev', ['none','mild','moderate','severe','other','unknown']);
  ensureNum(req.item7_score, 'i7');
  ensureStr(req.provider, 'pr');
  return { gid: req.gad_id };
}
function pcl5(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pcl_id, 'pid');
  ensureNum(req.score, 'sc');
  ensureBool(req.pta_positive, 'ptap');
  ensureStr(req.provider, 'pr');
  return { pid: req.pcl_id };
}
function crisis_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.crisis_id, 'cid');
  ensureNum(req.suicidal_ideation, 'si');
  ensureBool(req.plan_present, 'pp');
  ensureEnum(req.disposition, 'disp', ['home','psych_admit','ed','referral','voluntary_commit','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.crisis_id };
}
function psychotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pt_id, 'pid');
  ensureEnum(req.modality, 'mod', ['cbt','dbt','act','emdr','psychodynamic','supportive','other','unknown']);
  ensureNum(req.sessions_completed, 'sc');
  ensureNum(req.minutes_per_session, 'mps');
  ensureStr(req.provider, 'pr');
  return { pid: req.pt_id };
}

function funcs() { return { phq9, gad7, pcl5, crisis_eval, psychotherapy }; }
module.exports = { funcs, ValidationError };