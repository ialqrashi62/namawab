// filepath: tier65_rev_cycle_355_rev_payment_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function payment_posting(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.payment_id, 'pid');
  ensureStr(req.era_id, 'era');
  ensureStr(req.payer, 'payer');
  ensureNum(req.total_amount, 'ta');
  ensureNum(req.patient_responsibility, 'pr');
  ensureStr(req.posted_date, 'pd');
  ensureBool(req.auto_posted, 'ap');
  ensureBool(req.reconciliation_match, 'rm');
  return { payment: req.payment_id };
}
function denial_mgmt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.denial_id, 'did');
  ensureStr(req.claim_id, 'cid');
  ensureStr(req.reason_code, 'rc');
  ensureStr(req.denial_reason, 'dr');
  ensureStr(req.appeal_deadline, 'ad');
  ensureEnum(req.worklist_priority, 'wp', ['low','medium','high','urgent','critical']);
  ensureEnum(req.recommended_action, 'ra', ['write_off','appeal','resubmit','correct_and_resubmit','patient_bill','transfer_to_payer','closed','escalate']);
  ensureStr(req.root_cause, 'rc2');
  return { denial: req.denial_id };
}
function patient_pay(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureStr(req.invoice_id, 'iid');
  ensureNum(req.amount_due, 'ad');
  ensureNum(req.amount_paid, 'ap');
  ensureEnum(req.payment_method, 'pm', ['cash','check','card','hsa','fsa','ach','wire','online','mobile_app','payment_plan','apple_pay','google_pay']);
  ensureBool(req.payment_plan, 'pp');
  ensureNum(req.plan_months, 'pm2');
  ensureNum(req.balance_remaining, 'br');
  return { invoice: req.invoice_id };
}
function refund_processing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.refund_id, 'rid');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.amount, 'amt');
  ensureEnum(req.reason, 'rsn', ['credit_balance','duplicate_payment','overpayment','disputed_charge','patient_request','billing_error','contractual_adjustment','prompt_pay_discount']);
  ensureEnum(req.method, 'method', ['check','ach','wire','card_credit','paypal','adjustment_to_ledger','apply_to_future']);
  ensureStr(req.check_number, 'cn');
  ensureStr(req.processed_date, 'pd');
  ensureEnum(req.approval, 'app', ['pending','manager_approved','compliance_approved','auto_approved','rejected','completed']);
  return { refund: req.refund_id };
}
function underpayment_recovery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.recovery_id, 'rid');
  ensureStr(req.claim_id, 'cid');
  ensureNum(req.contracted_rate, 'cr');
  ensureNum(req.paid_rate, 'pr');
  ensureNum(req.underpayment, 'up');
  ensureEnum(req.recovery_status, 'rs', ['identified','appealed','escalated','recovered','written_off','partial_recovery','in_review','closed']);
  ensureNum(req.expected_recovery, 'er');
  ensureStr(req.payer, 'payer');
  return { recovery: req.recovery_id };
}

function funcs() { return { payment_posting, denial_mgmt, patient_pay, refund_processing, underpayment_recovery }; }
module.exports = { funcs, ValidationError };