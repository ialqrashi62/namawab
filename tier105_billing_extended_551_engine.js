// filepath: tier105_billing_extended_551_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function charge_capture(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.charge_id, 'cid');
  ensureStr(req.cpt_code, 'cpt');
  ensureNum(req.amount, 'amt');
  ensureStr(req.diagnosis_code, 'dx');
  ensureNum(req.units, 'units');
  ensureEnum(req.modifier, 'mod', ['none','25','59','26','TC','GA','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.charge_id };
}
function claim_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.payer_id, 'pid');
  ensureNum(req.total_charge, 'tc');
  ensureNum(req.expected_reimbursement, 'er');
  ensureEnum(req.status, 'st', ['draft','submitted','accepted','denied','paid','appealed','other','unknown']);
  ensureNum(req.response_days, 'rd');
  ensureStr(req.provider, 'pr');
  return { cid: req.claim_id };
}
function denial_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.denial_id, 'did');
  ensureStr(req.claim_id, 'cid');
  ensureEnum(req.reason, 'rs', ['authorization','medical_necessity','bundling','timely_filing','coding','eligibility','other','unknown']);
  ensureBool(req.appeal_filed, 'af');
  ensureNum(req.days_to_resolve, 'dtr');
  ensureNum(req.recovered_amount, 'ra');
  ensureStr(req.provider, 'pr');
  return { did: req.denial_id };
}
function payment_posting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.payment_id, 'pid');
  ensureNum(req.amount, 'amt');
  ensureEnum(req.method, 'mtd', ['eft','check','credit_card','cash','adjustment','writeoff','other','unknown']);
  ensureStr(req.payer, 'pr');
  ensureNum(req.days_to_post, 'dtp');
  ensureStr(req.provider, 'pr');
  return { pid: req.payment_id };
}
function patient_statement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.statement_id, 'sid');
  ensureNum(req.balance, 'bal');
  ensureNum(req.aging_30, 'a30');
  ensureNum(req.aging_60, 'a60');
  ensureNum(req.aging_90, 'a90');
  ensureEnum(req.payment_plan, 'pp', ['none','active','defaulted','paid','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.statement_id };
}

function funcs() { return { charge_capture, claim_submission, denial_management, payment_posting, patient_statement }; }
module.exports = { funcs, ValidationError };