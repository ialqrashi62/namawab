// filepath: tier131_quality_advanced_673_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function incident_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.inc_id, 'iid');
  ensureEnum(req.severity, 'sev', ['low','medium','high','critical','sentinel','other','unknown']);
  ensureStr(req.event_type, 'et');
  ensureBool(req.root_cause_done, 'rcd');
  ensureStr(req.provider, 'pr');
  return { iid: req.inc_id };
}
function complaint_mgmt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cmp_id, 'cid');
  ensureEnum(req.category, 'cat', ['clinical','staff','facility','billing','wait_time','other','unknown']);
  ensureNum(req.resolution_days, 'rd');
  ensureBool(req.letter_sent, 'ls');
  ensureStr(req.provider, 'pr');
  return { cid: req.cmp_id };
}
function feedback_survey(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sv_id, 'sid');
  ensureNum(req.score_overall, 'so');
  ensureNum(req.score_recommend, 'sr');
  ensureNum(req.score_staff, 'ss');
  ensureStr(req.provider, 'pr');
  return { sid: req.sv_id };
}
function qi_project(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.qi_id, 'qid');
  ensureStr(req.project_name, 'pn');
  ensureEnum(req.methodology, 'meth', ['pdca','lean','six_sigma','tqm','fmea','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { qid: req.qi_id };
}
function peer_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pr_id, 'pid');
  ensureStr(req.reviewer_id, 'rid');
  ensureNum(req.cases_reviewed, 'cr');
  ensureNum(req.discrepancies, 'dc');
  ensureEnum(req.outcome, 'oc', ['no_action','education','process_change','policy_change','privilege_action','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.pr_id };
}

function funcs() { return { incident_tracking, complaint_mgmt, feedback_survey, qi_project, peer_review }; }
module.exports = { funcs, ValidationError };