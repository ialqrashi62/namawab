// filepath: tier65_rev_cycle_357_rev_contract_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function payer_contract_load(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureStr(req.payer, 'payer');
  ensureStr(req.effective_date, 'ed');
  ensureNum(req.term_years, 'ty');
  ensureBool(req.auto_renew, 'ar');
  ensureEnum(req.model, 'model', ['fee_for_service','percent_of_charge','per_diem','capitation','bundled_payments','value_based','shared_savings','global_budget','case_rate','hybrid']);
  ensureNum(req.total_lines, 'tl');
  ensureStr(req.loaded_by, 'lb');
  return { contract: req.contract_id };
}
function contract_model(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureEnum(req.model_type, 'mt', ['percent_of_charge','per_diem','capitation','case_rate','discount_off_charge','fee_for_service','drg_based','value_based','hybrid','apc','apgc']);
  ensureNum(req.percent, 'pct');
  ensureNum(req.cap_max, 'cap');
  ensureNum(req.stop_loss, 'sl');
  ensureStr(req.methodology, 'meth');
  ensureStr(req.approved_by, 'ab');
  return { model: req.model_type };
}
function contract_variance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureStr(req.period, 'per');
  ensureNum(req.expected_revenue, 'er');
  ensureNum(req.actual_revenue, 'ar');
  ensureNum(req.variance_pct, 'vp');
  ensureNum(req.variance_amount, 'va');
  ensureStr(req.root_cause, 'rc');
  ensureEnum(req.recommendation, 'rec', ['none','renegotiate','tier_updated','billing_workflow','appeal_required','payor_call','underpayment_recovery','close']);
  return { contract: req.contract_id };
}
function fee_schedule(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureEnum(req.schedule_type, 'st', ['cms_2026','cms_2025','custom','medicare','medicaid','commercial','workers_comp','auto','capitation']);
  ensureStr(req.effective, 'eff');
  ensureNum(req.cpt_included, 'cpt');
  ensureNum(req.cpt_total, 'ct');
  ensureStr(req.last_updated, 'lu');
  ensureStr(req.source, 'src');
  return { contract: req.contract_id };
}
function allowed_amount(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.contract_id, 'cid');
  ensureStr(req.cpt_code, 'cpt');
  ensureNum(req.billed_amount, 'ba');
  ensureNum(req.expected_allowed, 'ea');
  ensureNum(req.actual_paid, 'ap');
  ensureEnum(req.network, 'net', ['in_network','out_of_network','tier_1','tier_2','tier_3','ppo','hmo','epo','pos']);
  ensureStr(req.payer, 'payer');
  ensureStr(req.date_of_service, 'dos');
  return { cpt: req.cpt_code };
}

function funcs() { return { payer_contract_load, contract_model, contract_variance, fee_schedule, allowed_amount }; }
module.exports = { funcs, ValidationError };