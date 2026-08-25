// filepath: tier65_rev_cycle_356_rev_audit_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function coding_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.provider, 'prov');
  ensureNum(req.records_reviewed, 'rr');
  ensureNum(req.coding_errors, 'ce');
  ensureNum(req.ms_drg_changed, 'mdc');
  ensureNum(req.cci_edits_passed, 'cci');
  ensureStr(req.recommendation, 'rec');
  return { audit: req.audit_id };
}
function clinical_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureEnum(req.audit_type, 'at', ['documentation','medical_necessity','quality','safety','infection','handoff','medication_reconciliation']);
  ensureNum(req.documentation_complete_pct, 'dcp');
  ensureNum(req.vte_assessment_pct, 'vap');
  ensureNum(req.pressure_ulcer_assessment, 'pua');
  ensureNum(req.rehab_assessment, 'ra');
  ensureEnum(req.compliance, 'comp', ['fully_compliant','needs_minor_education','needs_major_education','non_compliant','critical_finding']);
  return { audit: req.audit_id };
}
function compliance_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.scope, 'scope');
  ensureStr(req.findings, 'find');
  ensureNum(req.minor_findings, 'minf');
  ensureNum(req.major_findings, 'majf');
  ensureStr(req.corrective_action, 'ca');
  ensureStr(req.auditor, 'aud');
  ensureStr(req.closing_date, 'cd');
  return { audit: req.audit_id };
}
function pre_bill_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.claim_id, 'cid');
  ensureEnum(req.pre_bill_review, 'pbr', ['codes_validated','codes_corrected','modifiers_validated','modifiers_corrected','documentation_complete','documentation_pending','rejected','released_to_billing','pending_review']);
  ensureBool(req.modifiers_validated, 'mv');
  ensureBool(req.documentation_reviewed, 'dr');
  ensureNum(req.revenue_impact, 'ri');
  ensureEnum(req.approval, 'app', ['released_to_billing','pending_review','rejected','held_for_coding','correction_required']);
  return { audit: req.audit_id };
}
function post_bill_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.claim_id, 'cid');
  ensureEnum(req.post_bill_review, 'pbr', ['paid_as_billed','underpayment','overpayment','denial','zero_pay','partial_pay','closed']);
  ensureNum(req.expected_reimbursement, 'er');
  ensureNum(req.actual_reimbursement, 'ar');
  ensureNum(req.variance, 'var');
  ensureEnum(req.recommendation, 'rec', ['none','follow_up_needed','escalate','appeal','recover','close','write_off']);
  return { audit: req.audit_id };
}

function funcs() { return { coding_audit, clinical_audit, compliance_audit, pre_bill_audit, post_bill_audit }; }
module.exports = { funcs, ValidationError };