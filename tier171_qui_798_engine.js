// filepath: tier171_qui_798_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function incident_report(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'ty', ['med_error','fall','delay','equipment','transfusion','other','NA']);
  ensureEnum(req.severity, 'sv', ['near_miss','mild','moderate','severe','death','NA']);
  ensureBool(req.harm, 'ha'); ensureNum(req.report_min, 'rm');
  ensureStr(req.reporter, 're'); ensureNum(req.investigation_days, 'id');
  ensureEnum(req.disposition, 'di', ['closed','open','reopened','NA']);
  ensureStr(req.provider, 'pr');
  return { ir_id: `ir_${Date.now()}`, patient_id: req.patient_id, type: req.type, sv: req.severity };
}

function root_cause(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.incident_id, 'ii'); ensureEnum(req.method, 'mt', ['5_whys','fishbone','fault_tree','NA']);
  ensureNum(req.causes_count, 'cc'); ensureNum(req.human_causes, 'hc');
  ensureNum(req.system_causes, 'sc'); ensureNum(req.process_causes, 'pc');
  ensureNum(req.actions_count, 'ac'); ensureNum(req.effectiveness_score, 'es');
  ensureEnum(req.disposition, 'di', ['effective','partial','ineffective','pending','NA']);
  ensureStr(req.provider, 'pr');
  return { rc_id: `rc_${Date.now()}`, patient_id: req.patient_id, ii: req.incident_id, m: req.method };
}

function fmea(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.process, 'pr'); ensureEnum(req.severity, 'sv', ['low','moderate','high','catastrophic','NA']);
  ensureNum(req.occurrence, 'oc'); ensureNum(req.detection, 'de');
  ensureNum(req.rpn, 'rp'); ensureEnum(req.action_priority, 'ap', ['low','medium','high','NA']);
  ensureNum(req.actions_taken, 'at'); ensureBool(req.mitigated, 'mt');
  ensureEnum(req.disposition, 'di', ['continue','monitor','escalate','NA']);
  ensureStr(req.provider, 'pr');
  return { fm_id: `fm_${Date.now()}`, patient_id: req.patient_id, process: req.process, rpn: req.rpn };
}

function internal_audit(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.area, 'ar'); ensureEnum(req.standard, 'st', ['JCI','CBAHI','ISO','HIPAA','NA']);
  ensureNum(req.findings_count, 'fc'); ensureNum(req.critical_findings, 'cf');
  ensureNum(req.compliance_pct, 'cp'); ensureEnum(req.outcome, 'ot', ['compliant','partial','noncompliant','NA']);
  ensureNum(req.followup_days, 'fd'); ensureEnum(req.disposition, 'di', ['closed','monitoring','reopen','NA']);
  ensureStr(req.provider, 'pr');
  return { ia_id: `ia_${Date.now()}`, patient_id: req.patient_id, area: req.area, ot: req.outcome };
}

function cqi_project(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.title, 'ti'); ensureEnum(req.method, 'mt', ['PDSA','lean','six_sigma','NA']);
  ensureNum(req.start_month, 'sm'); ensureNum(req.duration_months, 'du');
  ensureNum(req.baseline_value, 'bv'); ensureNum(req.target_value, 'tv');
  ensureNum(req.current_value, 'cv'); ensureEnum(req.status, 'st', ['planning','active','sustaining','closed','NA']);
  ensureStr(req.provider, 'pr');
  return { cp_id: `cp_${Date.now()}`, patient_id: req.patient_id, title: req.title, st: req.status };
}

function funcs() { return { incident_report, root_cause, fmea, internal_audit, cqi_project }; }
module.exports = { funcs, ValidationError };