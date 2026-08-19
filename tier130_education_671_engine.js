// filepath: tier130_education_671_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chart_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.observation, 'obs');
  ensureBool(req.compliant, 'cmp');
  ensureStr(req.auditor_id, 'auid');
  ensureStr(req.provider, 'pr');
  return { aid: req.audit_id };
}
function staff_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.edu_id, 'eid');
  ensureStr(req.topic, 'top');
  ensureEnum(req.method, 'meth', ['in_person','online','video','simulation','other','unknown']);
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { eid: req.edu_id };
}
function policy_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pol_id, 'pid');
  ensureStr(req.policy_name, 'pn');
  ensureStr(req.review_date, 'rd');
  ensureNum(req.version, 'ver');
  ensureStr(req.provider, 'pr');
  return { pid: req.pol_id };
}
function staff_training(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.tra_id, 'tid');
  ensureStr(req.topic, 'top');
  ensureNum(req.attendees, 'att');
  ensureNum(req.duration_min, 'dm');
  ensureStr(req.provider, 'pr');
  return { tid: req.tra_id };
}
function cme_credit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cme_id, 'cid');
  ensureStr(req.course, 'crs');
  ensureNum(req.credits, 'crd');
  ensureStr(req.provider, 'pr');
  return { cid: req.cme_id };
}

function funcs() { return { chart_audit, staff_education, policy_review, staff_training, cme_credit }; }
module.exports = { funcs, ValidationError };
