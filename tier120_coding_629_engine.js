// filepath: tier120_coding_629_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function icd10_coding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.coding_id, 'cid');
  ensureStr(req.code, 'code');
  ensureStr(req.description, 'desc');
  ensureEnum(req.coding_system, 'cs', ['icd10_cm','icd10_pcs','icd9','snomed','other','unknown']);
  ensureBool(req.is_primary, 'ip');
  ensureStr(req.provider, 'pr');
  return { cid: req.coding_id };
}
function cpt_coding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cpt_id, 'cid');
  ensureStr(req.cpt_code, 'cc');
  ensureNum(req.units, 'units');
  ensureNum(req.modifier_count, 'mc');
  ensureStr(req.provider, 'pr');
  return { cid: req.cpt_id };
}
function hcpcs_coding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hcpcs_id, 'hid');
  ensureStr(req.code, 'code');
  ensureStr(req.category, 'cat');
  ensureBool(req.dme_indicator, 'dmei');
  ensureStr(req.provider, 'pr');
  return { hid: req.hcpcs_id };
}
function drg_assignment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drg_id, 'did');
  ensureStr(req.drg_code, 'dc');
  ensureNum(req.weight, 'wgt');
  ensureNum(req.expected_los_days, 'eld');
  ensureStr(req.provider, 'pr');
  return { did: req.drg_id };
}
function coding_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureStr(req.auditor_id, 'auid');
  ensureNum(req.codes_reviewed, 'cr');
  ensureNum(req.errors_found, 'ef');
  ensureEnum(req.outcome, 'oc', ['compliant','minor_issues','major_issues','rejected','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.audit_id };
}

function funcs() { return { icd10_coding, cpt_coding, hcpcs_coding, drg_assignment, coding_audit }; }
module.exports = { funcs, ValidationError };