// filepath: tier65_rev_cycle_353_rev_charge_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function charge_capture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cpt_code, 'cpt');
  ensureStr(req.icd10, 'icd');
  ensureStr(req.provider, 'prov');
  ensureStr(req.encounter_id, 'eid');
  ensureNum(req.charge_amount, 'ca');
  ensureStr(req.modifier, 'mod');
  ensureNum(req.work_rvu, 'rvu');
  ensureBool(req.documentation_complete, 'dc');
  return { cpt: req.cpt_code };
}
function charge_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.audit_id, 'aid');
  ensureNum(req.charges_reviewed, 'cr');
  ensureNum(req.errors_found, 'ef');
  ensureNum(req.error_rate, 'er');
  ensureStr(req.reviewer, 'rev');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.follow_up, 'fu');
  return { audit: req.audit_id };
}
function charge_dashboard(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.period, 'per');
  ensureNum(req.total_charges, 'tc');
  ensureNum(req.pending_charges, 'pc');
  ensureNum(req.missing_charges, 'mc');
  ensureNum(req.charge_lag_days, 'cld');
  ensureStr(req.recommendation, 'rec');
  return { period: req.period };
}
function charge_appeal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.appeal_id, 'app');
  ensureStr(req.charge_id, 'cid');
  ensureStr(req.payer, 'payer');
  ensureEnum(req.reason, 'rsn', ['coding_correction','underpayment','medical_necessity','bundling','timely_filing','authorization']);
  ensureStr(req.supporting_docs, 'sd');
  ensureNum(req.expected_recovery, 'er');
  ensureEnum(req.status, 'st', ['draft','submitted','under_review','approved','denied','partially_approved','resubmit']);
  return { appeal: req.appeal_id };
}
function charge_reconciliation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reconcile_id, 'rid');
  ensureStr(req.period, 'per');
  ensureNum(req.total_charges, 'tc');
  ensureNum(req.total_collections, 'tcol');
  ensureNum(req.variance, 'var');
  ensureNum(req.adjustments, 'adj');
  ensureNum(req.net_resolved, 'nr');
  return { reconcile: req.reconcile_id };
}

function funcs() { return { charge_capture, charge_audit, charge_dashboard, charge_appeal, charge_reconciliation }; }
module.exports = { funcs, ValidationError };