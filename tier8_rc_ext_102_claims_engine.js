// filepath: tier8_rc_ext_102_claims_engine.js
// TIER8_RC_EXT-102: Claims lifecycle (creation, validation, submission, status, ERA)
'use strict';

const CITATIONS = ['CMS_CLAIMS_2024','X12_5010_2024','NPHIES_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function claim_create(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureStr(req.payer_id, 'payer_id');
  ensureEnum(req.claim_type, 'claim_type', ['professional','institutional','dental','vision','pharmacy','mental_health','rehab']);
  ensureNumber(req.service_date_unix, 'service_date_unix');
  ensureNumber(req.total_charge, 'total_charge');
  ensureNumber(req.line_item_count, 'line_item_count');
  ensureStr(req.prior_auth_number, 'prior_auth_number');
  ensureBool(req.emergency, 'emergency');

  let feasibility;
  if (req.emergency && !req.prior_auth_number) feasibility = 'emergency_no_auth_required';
  else if (!req.prior_auth_number && req.claim_type === 'institutional') feasibility = 'inpatient_typically_requires_auth_verify';
  else if (req.line_item_count === 0) feasibility = 'no_line_items_re_attach';
  else feasibility = 'claim_eligible_to_submit';

  return { feasibility, claim_type: req.claim_type, total: req.total_charge };
}

function claim_validate(req) {
  ensureStr(req.claim_id, 'claim_id');
  ensureNumber(req.cpt_codes_count, 'cpt_codes_count');
  ensureNumber(req.icd_codes_count, 'icd_codes_count');
  ensureNumber(req.modifier_count, 'modifier_count');
  ensureNumber(req.diagnosis_pointer_correct, 'diagnosis_pointer_correct');
  ensureNumber(req.diagnosis_pointer_total, 'diagnosis_pointer_total');
  ensureBool(req.place_of_service_valid, 'place_of_service_valid');
  ensureBool(req.npi_valid, 'npi_valid');
  ensureBool(req.taxonomy_match, 'taxonomy_match');

  const pointer_rate = req.diagnosis_pointer_total > 0 ? req.diagnosis_pointer_correct / req.diagnosis_pointer_total : 1;
  let validation;
  if (!req.npi_valid || !req.place_of_service_valid) validation = 'blocking_errors_fix_first';
  else if (!req.taxonomy_match) validation = 'taxonomy_mismatch_warning';
  else if (pointer_rate < 0.7) validation = 'pointer_errors_warning_review';
  else if (req.cpt_codes_count === 0 || req.icd_codes_count === 0) validation = 'missing_codes_blocking';
  else validation = 'passes_validation_ready';

  return { validation, pointer_rate: Math.round(pointer_rate * 100) / 100 };
}

function claim_submit(req) {
  ensureStr(req.claim_id, 'claim_id');
  ensureEnum(req.channel, 'channel', ['nphies','cms_1500','ubd','portal','edi_270','edi_837','clearinghouse','direct']);
  ensureNumber(req.attachment_count, 'attachment_count');
  ensureEnum(req.submission_window, 'submission_window', ['immediate','24h','48h','7d','30d','90d','120d']);
  ensureBool(req.real_time_eligibility, 'real_time_eligibility');
  ensureBool(req.acknowledgment_received, 'acknowledgment_received');

  let submission_status;
  if (!req.acknowledgment_received) submission_status = 'pending_999_ack';
  else if (req.submission_window === '90d' || req.submission_window === '120d') submission_status = 'late_submit_penalty_risk';
  else if (req.channel === 'nphies' && !req.real_time_eligibility) submission_status = 'missing_eligibility_check_add_first';
  else submission_status = 'submitted';

  return { submission_status, channel: req.channel };
}

function claim_status(req) {
  ensureStr(req.claim_id, 'claim_id');
  ensureEnum(req.status, 'status', ['received','accepted','rejected','pending','paid','partial_paid','denied','appealed','written_off','voided']);
  ensureNumber(req.days_in_state, 'days_in_state');
  ensureEnum(req.next_action, 'next_action', ['none','resubmit','appeal','correct_and_resubmit','write_off','collect','follow_up','escalate']);

  let priority;
  if (req.status === 'rejected' || req.status === 'denied') priority = 'high_priority_appeal_now';
  else if (req.status === 'pending' && req.days_in_state > 30) priority = 'high_follow_up';
  else if (req.status === 'partial_paid') priority = 'moderate_review_balance';
  else if (req.days_in_state > 45) priority = 'moderate_follow_up';
  else priority = 'low_routine';

  return { priority, status: req.status, days: req.days_in_state };
}

function claim_era_post(req) {
  ensureStr(req.claim_id, 'claim_id');
  ensureNumber(req.billed, 'billed');
  ensureNumber(req.allowed, 'allowed');
  ensureNumber(req.paid, 'paid');
  ensureNumber(req.patient_responsibility, 'patient_responsibility');
  ensureNumber(req.adjustment, 'adjustment');
  ensureNumber(req.contractual_writeoff, 'contractual_writeoff');

  const variance = req.billed - req.paid - req.contractual_writeoff - req.patient_responsibility;
  let reconciliation;
  if (Math.abs(variance) > 1) reconciliation = 'variance_review_required';
  else if (req.contractual_writeoff > req.billed * 0.6) reconciliation = 'high_contractual_adjustment_verify';
  else if (req.patient_responsibility > req.paid && req.paid > 0) reconciliation = 'patient_balance_higher_than_insurance';
  else reconciliation = 'reconciled_clean';

  return { reconciliation, variance, paid: req.paid };
}

function funcs() { return { claim_create, claim_validate, claim_submit, claim_status, claim_era_post }; }
module.exports = { funcs, CITATIONS, ValidationError };