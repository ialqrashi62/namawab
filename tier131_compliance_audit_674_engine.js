// filepath: tier131_compliance_audit_674_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function regulatory(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reg_id, 'rid');
  ensureEnum(req.regulation, 'reg', ['joint_commission','cms','fda','hipaa','osha','other','unknown']);
  ensureBool(req.compliant, 'cmp');
  ensureStr(req.provider, 'pr');
  return { rid: req.reg_id };
}
function audit_finding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.af_id, 'aid');
  ensureEnum(req.severity, 'sev', ['low','medium','high','critical','other','unknown']);
  ensureStr(req.finding, 'fnd');
  ensureBool(req.corrective_action, 'ca');
  ensureStr(req.provider, 'pr');
  return { aid: req.af_id };
}
function corrective_action(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ca_id, 'cid');
  ensureStr(req.finding_ref, 'fr');
  ensureNum(req.days_to_close, 'dtc');
  ensureBool(req.verified, 'ver');
  ensureStr(req.provider, 'pr');
  return { cid: req.ca_id };
}
function risk_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ra_id, 'rid');
  ensureEnum(req.risk_type, 'rt', ['patient_safety','clinical','operational','financial','reputational','other','unknown']);
  ensureNum(req.likelihood, 'lh');
  ensureNum(req.impact, 'imp');
  ensureStr(req.provider, 'pr');
  return { rid: req.ra_id };
}
function policy_attestation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.at_id, 'aid');
  ensureStr(req.policy_name, 'pn');
  ensureStr(req.attest_by, 'ab');
  ensureBool(req.understood, 'und');
  ensureStr(req.provider, 'pr');
  return { aid: req.at_id };
}

function funcs() { return { regulatory, audit_finding, corrective_action, risk_assessment, policy_attestation }; }
module.exports = { funcs, ValidationError };