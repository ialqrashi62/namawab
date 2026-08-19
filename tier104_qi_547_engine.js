// filepath: tier104_qi_547_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function qi_project(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.project_id, 'pid');
  ensureStr(req.title, 'title');
  ensureEnum(req.methodology, 'meth', ['pdsa','lean','six_sigma','root_cause','fmea','other','unknown']);
  ensureNum(req.baseline_measure, 'bm');
  ensureNum(req.target_measure, 'tm');
  ensureNum(req.current_measure, 'cm');
  ensureNum(req.months_active, 'ma');
  ensureEnum(req.status, 'st', ['initiated','active','completed','sustained','abandoned','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.project_id };
}
function clinical_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.topic, 'topic');
  ensureNum(req.sample_size, 'ss');
  ensureNum(req.compliance_pct, 'cp');
  ensureNum(req.deviations, 'dev');
  ensureEnum(req.action, 'act', ['none','education','process_change','escalation','other','unknown']);
  ensureNum(req.follow_up_months, 'fum');
  ensureStr(req.provider, 'pr');
  return { aid: req.audit_id };
}
function patient_safety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.incident_id, 'iid');
  ensureEnum(req.incident_type, 'it', ['medication_error','fall','hapi','surgical_error','retained_object','wrong_site','delay_diagnosis','other','unknown']);
  ensureEnum(req.severity, 'sev', ['near_miss','no_harm','mild','moderate','severe','death','other','unknown']);
  ensureNum(req.safety_score, 'ss');
  ensureBool(req.root_cause_done, 'rcd');
  ensureNum(req.corrective_actions, 'ca');
  ensureStr(req.provider, 'pr');
  return { iid: req.incident_id };
}
function sentinel_event(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.event_id, 'eid');
  ensureEnum(req.event_type, 'et', ['unanticipated_death','severe_permanent','severe_temporary','wrong_site_surgery','retained_object','other','unknown']);
  ensureBool(req.rca_completed, 'rca');
  ensureNum(req.analysis_weeks, 'aw');
  ensureEnum(req.action_plan, 'ap', ['developed','in_progress','implemented','not_required','other','unknown']);
  ensureNum(req.cases_year, 'cy');
  ensureStr(req.provider, 'pr');
  return { eid: req.event_id };
}
function quality_metrics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric_id, 'mid');
  ensureStr(req.metric_name, 'mn');
  ensureNum(req.numerator, 'num');
  ensureNum(req.denominator, 'den');
  ensureNum(req.performance, 'perf');
  ensureEnum(req.benchmark, 'bm', ['above','at','below','unknown','other']);
  ensureNum(req.time_period_months, 'tpm');
  ensureStr(req.provider, 'pr');
  return { mid: req.metric_id };
}

function funcs() { return { qi_project, clinical_audit, patient_safety, sentinel_event, quality_metrics }; }
module.exports = { funcs, ValidationError };
