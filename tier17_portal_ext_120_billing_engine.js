// filepath: tier17_portal_ext_120_billing_engine.js
// TIER17_PORTAL_EXT-120: Patient portal billing, payments, statements
'use strict';

const CITATIONS = ['HIPAA_EROF_2024','CARD_ACT_2009','CMS_NO_SUPRISE_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function portal_view_balance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.balance_total, 'balance_total');
  ensureNumber(req.balance_after_insurance, 'balance_after_insurance');
  ensureEnum(req.balance_status, 'balance_status', ['current_paid','small_balance_under_100','medium_balance_100_500','large_balance_500_2000','over_2000','collections','bankruptcy','hardship','other']);
  ensureBool(req.payment_plan_active, 'payment_plan_active');
  ensureNumber(req.days_overdue, 'days_overdue');

  let status;
  if (req.balance_status === 'collections') status = 'in_collections_review_payment_options';
  else if (req.days_overdue > 90) status = 'over_90d_delinquent_review';
  else if (req.payment_plan_active) status = 'payment_plan_active_continue';
  else if (req.balance_total < 50) status = 'minor_balance_pay_in_full';
  else status = 'balance_displayed';
  return { status, balance: req.balance_total };
}

function portal_payment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.amount, 'amount');
  ensureEnum(req.payment_method, 'payment_method', ['credit_card','debit_card','ach_bank','hsa_fsa','apple_pay','google_pay','paypal','check_phone','cash','other']);
  ensureBool(req.card_tokenized, 'card_tokenized');
  ensureBool(req.pci_compliant, 'pci_compliant');
  ensureNumber(req.transactions_24h, 'transactions_24h');

  let status;
  if (!req.pci_compliant) status = 'pci_compliance_required_blocking';
  else if (!req.card_tokenized) status = 'card_tokenization_required';
  else if (req.transactions_24h > 5) status = 'high_velocity_review_fraud';
  else if (req.amount > 10000) status = 'over_10k_large_transaction_review';
  else status = 'payment_processed';
  return { status, method: req.payment_method };
}

function portal_payment_plan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.balance_total, 'balance_total');
  ensureNumber(req.monthly_payment, 'monthly_payment');
  ensureNumber(req.number_of_months, 'number_of_months');
  ensureNumber(req.monthly_income, 'monthly_income');
  ensureBool(req.hardship_review, 'hardship_review');
  ensureEnum(req.plan_type, 'plan_type', ['standard','extended','hardship','settlement','bankruptcy_plan','other']);

  let status;
  if (req.monthly_payment > req.monthly_income * 0.2) status = 'payment_over_20pct_income_hardship';
  else if (req.hardship_review) status = 'hardship_review_needed_for_terms';
  else if (req.number_of_months > 60) status = 'over_60_months_re_evaluate';
  else if (req.monthly_payment * req.number_of_months < req.balance_total * 0.9) status = 'underpayment_review_total';
  else status = 'plan_approved';
  return { status, type: req.plan_type };
}

function portal_statement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.statement_type, 'statement_type', ['itemized','summary','eob_related','good_faith_estimate','dispute','other']);
  ensureBool(req.gfe_required, 'gfe_required');
  ensureBool(req.no_surprise_billing_compliant, 'nsb_compliant');
  ensureNumber(req.days_until_send, 'days_until_send');

  let status;
  if (req.statement_type === 'good_faith_estimate' && !req.gfe_required) status = 'gfe_only_for_uninsured_self_pay';
  else if (!req.nsb_compliant) status = 'no_surprise_billing_review';
  else if (req.days_until_send > 30) status = 'over_30d_review_cycle';
  else status = 'statement_generated';
  return { status, type: req.statement_type };
}

function portal_dispute(req) {
  ensureStr(req.dispute_id, 'dispute_id');
  ensureEnum(req.reason, 'reason', ['incorrect_charge','duplicate_charge','service_not_received','insurance_should_pay_more','out_of_network_unexpected','billing_error','other']);
  ensureNumber(req.amount_disputed, 'amount_disputed');
  ensureNumber(req.days_since_charge, 'days_since_charge');
  ensureEnum(req.dispute_status, 'dispute_status', ['open','under_review','resolved_refund','resolved_partial','denied','escalated','other']);

  let status;
  if (req.days_since_charge > 60 && req.dispute_status === 'open') status = 'over_60d_old_dispute_review';
  else if (req.reason === 'out_of_network_unexpected') status = 'oon_unexpected_no_surprise_billing_review';
  else if (req.amount_disputed > 5000 && req.dispute_status === 'denied') status = 'large_denied_dispute_appeal';
  else status = 'dispute_processed';
  return { status, dispute: req.dispute_id };
}

function funcs() { return { portal_view_balance, portal_payment, portal_payment_plan, portal_statement, portal_dispute }; }
module.exports = { funcs, CITATIONS, ValidationError };