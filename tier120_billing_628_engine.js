// filepath: tier120_billing_628_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function claim_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.payer_id, 'pid');
  ensureNum(req.amount_dollars, 'ad');
  ensureEnum(req.claim_type, 'ct', ['professional','institutional','pharmacy','dental','other','unknown']);
  ensureBool(req.prior_auth_required, 'par');
  ensureStr(req.provider, 'pr');
  return { cid: req.claim_id };
}
function claim_status(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.claim_id, 'cid');
  ensureEnum(req.status, 'st', ['submitted','pending','paid','denied','appealed','other','unknown']);
  ensureNum(req.paid_amount_dollars, 'pad');
  ensureNum(req.patient_responsibility_dollars, 'prd');
  ensureStr(req.provider, 'pr');
  return { cid: req.claim_id };
}
function payment_posting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.payment_id, 'pid');
  ensureNum(req.amount_dollars, 'ad');
  ensureEnum(req.payment_source, 'ps', ['insurance','patient','charity','medicaid','medicare','other','unknown']);
  ensureStr(req.posted_date, 'pd');
  ensureStr(req.provider, 'pr');
  return { pid: req.payment_id };
}
function denial_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.denial_id, 'did');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.denial_reason, 'dr');
  ensureNum(req.appeal_count, 'ac');
  ensureBool(req.overturned, 'ov');
  ensureStr(req.provider, 'pr');
  return { did: req.denial_id };
}
function statement_generation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.statement_id, 'sid');
  ensureNum(req.balance_dollars, 'bd');
  ensureStr(req.statement_date, 'sd');
  ensureStr(req.due_date, 'dd');
  ensureStr(req.provider, 'pr');
  return { sid: req.statement_id };
}

function funcs() { return { claim_submission, claim_status, payment_posting, denial_management, statement_generation }; }
module.exports = { funcs, ValidationError };