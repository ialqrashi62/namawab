// filepath: tier8_rc_ext_104_payment_engine.js
// TIER8_RC_EXT-104: Payment posting & reconciliation (insurance, patient, EFT, lockbox)
'use strict';

const CITATIONS = ['NACHA_EFT_2024','HFMA_PAYMENT_2023','X12_835_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function payment_post_eft(req) {
  ensureStr(req.eft_id, 'eft_id');
  ensureStr(req.payer_id, 'payer_id');
  ensureNumber(req.amount, 'amount');
  ensureNumber(req.claim_count, 'claim_count');
  ensureNumber(req.expected_total, 'expected_total');
  ensureBool(req.trace_matched, 'trace_matched');
  ensureEnum(req.payment_type, 'payment_type', ['insurance_eft','patient_credit_card','patient_check','patient_cash','hsa_fsa','third_party','settlement','refund']);

  let posting_status;
  if (!req.trace_matched) posting_status = 'trace_mismatch_review_first';
  else if (req.amount !== req.expected_total) posting_status = 'partial_or_overpayment_research';
  else if (req.claim_count === 0) posting_status = 'no_claims_to_post_research';
  else posting_status = 'auto_posting_eligible';

  return { posting_status, amount: req.amount, payer: req.payer_id };
}

function payment_reconcile(req) {
  ensureStr(req.period_id, 'period_id');
  ensureNumber(req.eft_total, 'eft_total');
  ensureNumber(req.check_total, 'check_total');
  ensureNumber(req.credit_card_total, 'credit_card_total');
  ensureNumber(req.cash_total, 'cash_total');
  ensureNumber(req.system_total, 'system_total');
  ensureNumber(req.bank_total, 'bank_total');

  const deposit_total = req.eft_total + req.check_total + req.credit_card_total + req.cash_total;
  const bank_variance = req.bank_total - deposit_total;
  const system_variance = req.system_total - deposit_total;
  let reconciliation;
  if (Math.abs(bank_variance) > 1) reconciliation = 'bank_deposit_variance_review';
  else if (Math.abs(system_variance) > 1) reconciliation = 'system_variance_review';
  else reconciliation = 'reconciled_clean';

  return { reconciliation, bank_variance: Math.round(bank_variance * 100) / 100, system_variance: Math.round(system_variance * 100) / 100 };
}

function payment_apply(req) {
  ensureStr(req.payment_id, 'payment_id');
  ensureNumber(req.amount, 'amount');
  ensureNumber(req.claim_balance, 'claim_balance');
  ensureEnum(req.application_strategy, 'application_strategy', ['oldest_first','largest_first','smallest_first','manual','by_line_item','write_off_then_apply']);
  ensureNumber(req.days_to_apply, 'days_to_apply');
  ensureBool(req.auto_apply, 'auto_apply');

  let apply_status;
  if (req.amount > req.claim_balance) apply_status = 'overpayment_split_to_other_claims_or_refund';
  else if (req.amount === req.claim_balance) apply_status = 'exact_zero_balance';
  else if (req.application_strategy === 'oldest_first' && req.days_to_apply > 30) apply_status = 'oldest_first_with_aging_review';
  else if (req.auto_apply && req.amount < req.claim_balance * 0.1) apply_status = 'auto_apply_partial_review';
  else apply_status = 'apply_to_selected';

  return { apply_status, amount: req.amount };
}

function payment_refund(req) {
  ensureStr(req.refund_id, 'refund_id');
  ensureEnum(req.refund_reason, 'refund_reason', ['overpayment','patient_request','duplicate','payer_adjustment','goodwill','credit_balance','timely_filing','other']);
  ensureNumber(req.amount, 'amount');
  ensureEnum(req.refund_method, 'refund_method', ['credit_card','check','eft_to_payer','patient_credit_balance','apply_to_other_claim']);
  ensureNumber(req.days_since_credit, 'days_since_credit');
  ensureBool(req.compliance_review_complete, 'compliance_review_complete');

  let refund_status;
  if (!req.compliance_review_complete) refund_status = 'compliance_review_blocking';
  else if (req.days_since_credit > 60) refund_status = 'aged_refund_review_for_unclaimed_property';
  else if (req.refund_reason === 'goodwill' && req.amount > 500) refund_status = 'goodwill_high_amount_review';
  else if (req.refund_method === 'check' && req.amount > 10000) refund_status = 'high_amount_check_escalate';
  else refund_status = 'standard_refund';

  return { refund_status, amount: req.amount, reason: req.refund_reason };
}

function payment_batch(req) {
  ensureStr(req.batch_id, 'batch_id');
  ensureNumber(req.payments_in_batch, 'payments_in_batch');
  ensureNumber(req.batch_total, 'batch_total');
  ensureNumber(req.exceptions, 'exceptions');
  ensureNumber(req.auto_posted, 'auto_posted');
  ensureNumber(req.manual_review_required, 'manual_review_required');
  ensureNumber(req.days_to_complete, 'days_to_complete');

  const exception_rate = req.payments_in_batch > 0 ? req.exceptions / req.payments_in_batch : 0;
  let summary;
  if (exception_rate >= 0.2) summary = 'high_exception_investigate_root_cause';
  else if (exception_rate >= 0.1) summary = 'moderate_review_automation';
  else if (req.days_to_complete > 5) summary = 'slow_processing_review_workflow';
  else summary = 'efficient_batch';

  return { summary, exception_rate: Math.round(exception_rate * 1000) / 10, total: req.batch_total };
}

function funcs() { return { payment_post_eft, payment_reconcile, payment_apply, payment_refund, payment_batch }; }
module.exports = { funcs, CITATIONS, ValidationError };