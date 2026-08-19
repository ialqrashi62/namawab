// filepath: tier104_compliance_544_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function regulatory_compliance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureEnum(req.regulator, 'reg', ['cms','joint_commission','state','cdc','osha','hipaa','other','unknown']);
  ensureEnum(req.finding_type, 'ft', ['deficiency','standard','condition','immediate_jeopardy','other','unknown','none']);
  ensureEnum(req.severity, 'sev', ['standard','substantial','critical','immediate_jeopardy','other','unknown','none']);
  ensureStr(req.response_due, 'rd');
  ensureBool(req.plan_of_correction, 'poc');
  ensureBool(req.follow_up_required, 'fur');
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}
function audit_response(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureEnum(req.audit_type, 'at', ['billing','coding','compliance','quality','safety','other','unknown']);
  ensureNum(req.findings, 'fn');
  ensureBool(req.corrective_action_required, 'car');
  ensureBool(req.remediation_complete, 'rc');
  ensureStr(req.follow_up_audit, 'fua');
  ensureStr(req.provider, 'pr');
  return { aid: req.audit_id };
}
function policy_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.policy_id, 'pid');
  ensureStr(req.policy_name, 'pn');
  ensureStr(req.version, 'ver');
  ensureStr(req.last_reviewed, 'lr');
  ensureStr(req.next_review, 'nr');
  ensureNum(req.acknowledgment_rate, 'ar');
  ensureStr(req.provider, 'pr');
  return { pid: req.policy_id };
}
function training_compliance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureEnum(req.training_type, 'tt', ['hipaa','bloodborne_pathogen','fire_safety','infection_control','annual_competency','other','unknown']);
  ensureNum(req.assigned, 'asg');
  ensureNum(req.completed, 'cmp');
  ensureNum(req.compliance_rate, 'cr');
  ensureStr(req.deadline, 'dl');
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}
function incident_reporting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'iid');
  ensureEnum(req.incident_type, 'it', ['medication_error','fall','hapi','surgical_error','retained_object','wrong_site','delay_diagnosis','other','unknown']);
  ensureEnum(req.severity, 'sev', ['near_miss','no_harm','mild','moderate','severe','death','other','unknown']);
  ensureBool(req.reported_to_safety, 'rts');
  ensureEnum(req.investigation_status, 'is', ['pending','open','closed','rejected','other','unknown']);
  ensureEnum(req.corrective_action, 'ca', ['pending','in_progress','completed','not_required','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { iid: req.incident_id };
}

function funcs() { return { regulatory_compliance, audit_response, policy_management, training_compliance, incident_reporting }; }
module.exports = { funcs, ValidationError };
