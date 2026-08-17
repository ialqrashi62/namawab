// filepath: tier61_ops_ext_342_ops_quality_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function quality_metrics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric, 'met');
  ensureStr(req.period, 'per');
  ensureNum(req.value, 'val');
  ensureStr(req.unit, 'unit');
  ensureNum(req.target, 'tg');
  ensureNum(req.benchmark, 'bm');
  ensureEnum(req.status, 'st', ['improving','on_target','needs_improvement','declining','critical']);
  return { metric: req.metric };
}
function quality_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.scope, 'scope');
  ensureNum(req.findings_count, 'fc');
  ensureNum(req.critical_findings, 'cf');
  ensureNum(req.compliance_pct, 'cp');
  ensureStr(req.auditor, 'aud');
  ensureStr(req.next_audit, 'na');
  return { audit: req.audit_id };
}
function quality_complaint(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.complaint_id, 'ci');
  ensureEnum(req.category, 'cat', ['wait_time','staff_conduct','communication','billing','clinical_care','food','environment','privacy','discharge','medication']);
  ensureEnum(req.severity, 'sev', ['low','moderate','high','critical']);
  ensureStr(req.department, 'dept');
  ensureStr(req.resolution, 'res');
  ensureBool(req.patient_satisfied, 'ps');
  ensureStr(req.closed_date, 'cd');
  return { complaint: req.complaint_id };
}
function quality_improvement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.project_id, 'pi');
  ensureStr(req.title, 'title');
  ensureEnum(req.methodology, 'meth', ['pdca','lean','six_sigma','fmea','rca','clinical_pathway','bundle']);
  ensureStr(req.start_date, 'sd');
  ensureStr(req.expected_end, 'ee');
  ensureStr(req.metrics_tracked, 'mt');
  ensureStr(req.stakeholders, 'sh');
  return { project: req.project_id };
}
function quality_benchmark(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric, 'met');
  ensureNum(req.our_value, 'ov');
  ensureNum(req.benchmark_value, 'bv');
  ensureNum(req.national_top_10, 'nt10');
  ensureStr(req.comparator, 'comp');
  ensureNum(req.improvement_target, 'it');
  return { metric: req.metric };
}

function funcs() { return { quality_metrics, quality_audit, quality_complaint, quality_improvement, quality_benchmark }; }
module.exports = { funcs, ValidationError };