// filepath: tier117_workflow_615_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function order_set(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.set_id, 'sid');
  ensureStr(req.name, 'name');
  ensureStr(req.indication, 'ind');
  ensureNum(req.orders_count, 'oc');
  ensureBool(req.provider_review, 'pr');
  ensureBool(req.activated, 'act');
  ensureStr(req.provider, 'pr');
  return { sid: req.set_id };
}
function care_pathway(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pathway_id, 'pid');
  ensureStr(req.condition, 'cond');
  ensureNum(req.steps_count, 'sc');
  ensureNum(req.steps_completed, 'stc');
  ensureNum(req.days_on_pathway, 'dop');
  ensureBool(req.deviations, 'dev');
  ensureStr(req.provider, 'pr');
  return { pid: req.pathway_id };
}
function referral_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureStr(req.specialty, 'sp');
  ensureStr(req.reason, 'rsn');
  ensureEnum(req.urgency, 'urg', ['routine','urgent','stat','emergent','other','unknown']);
  ensureNum(req.days_to_appointment, 'dta');
  ensureEnum(req.status, 'st', ['pending','scheduled','completed','cancelled','declined','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.referral_id };
}
function handoff(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.handoff_id, 'hid');
  ensureStr(req.from_provider, 'fp');
  ensureStr(req.to_provider, 'tp');
  ensureStr(req.sbar_format, 'sbar');
  ensureEnum(req.completeness, 'comp', ['complete','partial','minimal','incomplete','other','unknown']);
  ensureBool(req.question_addressed, 'qa');
  ensureStr(req.provider, 'pr');
  return { hid: req.handoff_id };
}
function shift_report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureNum(req.patients_count, 'pc');
  ensureNum(req.events_count, 'ec');
  ensureNum(req.tasks_pending, 'tp');
  ensureBool(req.critical_issues, 'ci');
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}

function funcs() { return { order_set, care_pathway, referral_management, handoff, shift_report }; }
module.exports = { funcs, ValidationError };