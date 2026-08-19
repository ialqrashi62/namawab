// filepath: tier120_revenue_630_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function revenue_cycle_kpi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.kpi_id, 'kid');
  ensureNum(req.days_in_ar, 'dia');
  ensureNum(req.clean_claim_rate_pct, 'ccr');
  ensureNum(req.denial_rate_pct, 'dr');
  ensureNum(req.net_collection_rate_pct, 'ncr');
  ensureStr(req.provider, 'pr');
  return { kid: req.kpi_id };
}
function contract_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureStr(req.payer_id, 'pid');
  ensureStr(req.effective_date, 'ed');
  ensureNum(req.allowed_amount_dollars, 'aad');
  ensureStr(req.provider, 'pr');
  return { cid: req.contract_id };
}
function payer_mix(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.snapshot_id, 'sid');
  ensureNum(req.medicaid_pct, 'mp');
  ensureNum(req.medicare_pct, 'mrp');
  ensureNum(req.commercial_pct, 'cp');
  ensureNum(req.self_pay_pct, 'sp');
  ensureStr(req.provider, 'pr');
  return { sid: req.snapshot_id };
}
function underpayment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.underpay_id, 'uid');
  ensureStr(req.claim_id, 'cid');
  ensureNum(req.expected_pay, 'ep');
  ensureNum(req.actual_pay, 'ap');
  ensureStr(req.provider, 'pr');
  return { uid: req.underpay_id };
}
function writeoff(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.writeoff_id, 'wid');
  ensureNum(req.amount_dollars, 'ad');
  ensureEnum(req.reason, 'rsn', ['contractual','bad_debt','charity','administrative','other','unknown']);
  ensureBool(req.approved, 'app');
  ensureStr(req.provider, 'pr');
  return { wid: req.writeoff_id };
}

function funcs() { return { revenue_cycle_kpi, contract_management, payer_mix, underpayment, writeoff }; }
module.exports = { funcs, ValidationError };