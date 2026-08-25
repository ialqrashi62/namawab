// filepath: tier105_insurance_552_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function eligibility_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.check_id, 'cid');
  ensureStr(req.payer_id, 'pid');
  ensureStr(req.policy_number, 'pn');
  ensureEnum(req.coverage_status, 'cs', ['active','inactive','pending','lapsed','terminated','other','unknown']);
  ensureNum(req.deductible_remaining, 'dr');
  ensureNum(req.copay_amount, 'ca');
  ensureEnum(req.coverage_type, 'ct', ['commercial','medicare','medicaid','self_pay','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.check_id };
}
function authorization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.auth_id, 'aid');
  ensureStr(req.service_code, 'sc');
  ensureNum(req.units_requested, 'ur');
  ensureNum(req.units_approved, 'ua');
  ensureEnum(req.status, 'st', ['pending','approved','partial','denied','expired','other','unknown']);
  ensureNum(req.days_to_decision, 'dtd');
  ensureStr(req.provider, 'pr');
  return { aid: req.auth_id };
}
function benefit_verification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.verification_id, 'vid');
  ensureStr(req.payer_id, 'pid');
  ensureNum(req.in_network_pct, 'inp');
  ensureNum(req.out_of_pocket_max, 'oom');
  ensureBool(req.prior_auth_required, 'par');
  ensureNum(req.coverage_limit, 'cl');
  ensureStr(req.provider, 'pr');
  return { vid: req.verification_id };
}
function referral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureStr(req.specialty, 'sp');
  ensureStr(req.reason, 'rs');
  ensureEnum(req.urgency, 'urg', ['routine','urgent','stat','other','unknown']);
  ensureBool(req.insurance_required, 'ir');
  ensureNum(req.days_to_complete, 'dtc');
  ensureStr(req.provider, 'pr');
  return { rid: req.referral_id };
}
function pre_certification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cert_id, 'cid');
  ensureStr(req.service, 'svc');
  ensureNum(req.days_to_complete, 'dtc');
  ensureBool(req.approved, 'app');
  ensureNum(req.cert_period_days, 'cpd');
  ensureNum(req.facility_units, 'fu');
  ensureStr(req.provider, 'pr');
  return { cid: req.cert_id };
}

function funcs() { return { eligibility_check, authorization, benefit_verification, referral, pre_certification }; }
module.exports = { funcs, ValidationError };