// filepath: tier120_patient_finance_631_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function eligibility_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.eligibility_id, 'eid');
  ensureStr(req.payer_id, 'pid');
  ensureStr(req.policy_number, 'pn');
  ensureBool(req.coverage_active, 'ca');
  ensureNum(req.deductible_dollars, 'dd');
  ensureStr(req.provider, 'pr');
  return { eid: req.eligibility_id };
}
function prior_authorization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.auth_id, 'aid');
  ensureStr(req.payer_id, 'pid');
  ensureStr(req.service_code, 'sc');
  ensureEnum(req.status, 'st', ['pending','approved','denied','expired','other','unknown']);
  ensureStr(req.expiration_date, 'ed');
  ensureStr(req.provider, 'pr');
  return { aid: req.auth_id };
}
function charity_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.application_id, 'aid');
  ensureNum(req.income_dollars, 'inc');
  ensureNum(req.household_size, 'hs');
  ensureEnum(req.fpl_pct, 'fpl', ['<100','100-200','200-300','>300','other','unknown']);
  ensureBool(req.approved, 'app');
  ensureStr(req.provider, 'pr');
  return { aid: req.application_id };
}
function payment_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'plid');
  ensureNum(req.balance_dollars, 'bd');
  ensureNum(req.monthly_payment_dollars, 'mpd');
  ensureNum(req.months_remaining, 'mr');
  ensureBool(req.active, 'act');
  ensureStr(req.provider, 'pr');
  return { plid: req.plan_id };
}
function patient_statement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.statement_id, 'sid');
  ensureNum(req.amount_dollars, 'ad');
  ensureStr(req.statement_date, 'sd');
  ensureNum(req.days_delinquent, 'dd');
  ensureEnum(req.delivery_method, 'dm', ['mail','email','portal','phone','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.statement_id };
}

function funcs() { return { eligibility_check, prior_authorization, charity_care, payment_plan, patient_statement }; }
module.exports = { funcs, ValidationError };