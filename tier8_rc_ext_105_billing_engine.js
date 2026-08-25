// filepath: tier8_rc_ext_105_billing_engine.js
// TIER8_RC_EXT-105: Patient billing & statements (estimate generation, statements, payment plans, charity, collections)
'use strict';

const CITATIONS = ['HFMA_PATIENT_BILLING_2023','FDCPA_2024','IRS_501R_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function billing_estimate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.service_type, 'service_type', ['office_visit','procedure','imaging','surgery','emergency','maternity','inpatient','rehab','dental','cosmetic']);
  ensureNumber(req.gross_charge, 'gross_charge');
  ensureNumber(req.insurance_expected_pay, 'insurance_expected_pay');
  ensureNumber(req.deductible_remaining, 'deductible_remaining');
  ensureNumber(req.coinsurance_pct, 'coinsurance_pct');
  ensureBool(req.in_network, 'in_network');

  let estimate;
  const coinsurance = (req.gross_charge - req.insurance_expected_pay) * (req.coinsurance_pct / 100);
  const patient_responsibility = req.deductible_remaining + Math.max(0, coinsurance);
  if (!req.in_network) estimate = 'out_of_network_warning_patient_may_owe_full';
  else if (req.service_type === 'cosmetic') estimate = 'cosmetic_patient_responsible_full_charge';
  else estimate = 'in_network_estimate_provided';

  return { estimate, patient_responsibility: Math.round(patient_responsibility * 100) / 100, gross: req.gross_charge };
}

function billing_statement(req) {
  ensureStr(req.statement_id, 'statement_id');
  ensureNumber(req.balance, 'balance');
  ensureNumber(req.days_outstanding, 'days_outstanding');
  ensureEnum(req.previous_statement_count, 'previous_statement_count', ['zero','one','two','three','four_plus']);
  ensureBool(req.previous_payment_history, 'previous_payment_history');
  ensureEnum(req.delivery_method, 'delivery_method', ['paper','email','portal','sms','phone']);

  let cycle;
  if (req.days_outstanding >= 120 && req.previous_statement_count === 'four_plus') cycle = 'pre_collection_agency';
  else if (req.days_outstanding >= 90) cycle = 'final_notice_pre_agency';
  else if (req.days_outstanding >= 60 && req.previous_statement_count === 'two') cycle = 'second_statement';
  else if (req.days_outstanding >= 30) cycle = 'first_followup_statement';
  else cycle = 'initial_statement';

  return { cycle, balance: req.balance, days: req.days_outstanding };
}

function billing_payment_plan(req) {
  ensureStr(req.plan_id, 'plan_id');
  ensureNumber(req.total_balance, 'total_balance');
  ensureNumber(req.monthly_payment, 'monthly_payment');
  ensureNumber(req.months_requested, 'months_requested');
  ensureEnum(req.plan_type, 'plan_type', ['interest_free','reduced_interest','standard_interest','hardship_zero','settlement']);
  ensureBool(req.fdcpa_compliant_disclosure, 'fdcpa_compliant_disclosure');
  ensureBool(req.automated_payment_setup, 'automated_payment_setup');

  let feasibility;
  const total_with_interest = req.monthly_payment * req.months_requested;
  const variance = total_with_interest - req.total_balance;
  if (!req.fdcpa_compliant_disclosure) feasibility = 'fdcpa_disclosure_required_blocking';
  else if (variance < -100) feasibility = 'under_collection_extend_terms';
  else if (req.months_requested > 36 && req.plan_type !== 'hardship_zero') feasibility = 'extended_terms_review';
  else if (req.total_balance > 50000 && req.plan_type === 'hardship_zero') feasibility = 'hardship_high_amount_escalate';
  else if (req.automated_payment_setup) feasibility = 'auto_pay_plan_recommended';
  else feasibility = 'standard_plan_eligible';

  return { feasibility, monthly: req.monthly_payment, months: req.months_requested };
}

function billing_charity(req) {
  ensureStr(req.application_id, 'application_id');
  ensureNumber(req.family_size, 'family_size');
  ensureNumber(req.annual_income, 'annual_income');
  ensureNumber(req.federal_poverty_level_pct, 'federal_poverty_level_pct');
  ensureNumber(req.total_charges, 'total_charges');
  ensureBool(req.documentation_complete, 'documentation_complete');
  ensureBool(req.medicaid_screened, 'medicaid_screened');

  let eligibility;
  if (req.federal_poverty_level_pct <= 200 && req.documentation_complete) eligibility = 'full_charity_care_100_percent';
  else if (req.federal_poverty_level_pct <= 300 && req.documentation_complete) eligibility = 'partial_charity_sliding_scale';
  else if (req.federal_poverty_level_pct <= 400 && req.documentation_complete) eligibility = 'catastrophic_discount';
  else if (!req.medicaid_screened) eligibility = 'screen_for_medicaid_first';
  else eligibility = 'above_threshold_discount_unavailable';
  return { eligibility, fpl_pct: req.federal_poverty_level_pct };
}

function billing_collections(req) {
  ensureStr(req.account_id, 'account_id');
  ensureNumber(req.balance, 'balance');
  ensureNumber(req.days_in_collections, 'days_in_collections');
  ensureEnum(req.prior_action, 'prior_action', ['statements_only','phone_calls','settlement_offer','payment_plan_failed','agency_placement','legal_action','write_off_only']);
  ensureBool(req.disputed, 'disputed');
  ensureNumber(req.cost_to_collect, 'cost_to_collect');

  let action;
  if (req.disputed) action = 'hold_collection_resolve_dispute';
  else if (req.cost_to_collect > req.balance * 0.4) action = 'cost_too_high_consider_write_off';
  else if (req.balance < 50) action = 'small_balance_write_off';
  else if (req.days_in_collections >= 365 && req.prior_action === 'legal_action') action = 'final_legal_action_review';
  else if (req.days_in_collections >= 180) action = 'escalate_to_agency';
  else action = 'continue_internal_collections';

  return { action, balance: req.balance, days: req.days_in_collections };
}

function funcs() { return { billing_estimate, billing_statement, billing_payment_plan, billing_charity, billing_collections }; }
module.exports = { funcs, CITATIONS, ValidationError };