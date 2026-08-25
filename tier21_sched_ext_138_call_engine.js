// filepath: tier21_sched_ext_138_call_engine.js
// TIER21_SCHED_EXT-138: On-call, cross-coverage, locums
'use strict';

const CITATIONS = ['MGMA_ONCALL_2024','NLRB_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function call_assign(req) {
  ensureStr(req.call_id, 'call_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.call_type, 'call_type', ['primary','backup','second_call','in_house','at_home','locums','other']);
  ensureEnum(req.call_duration, 'call_duration', ['weekday_evening','weekday_night','weekend_day','weekend_night','24h_holiday','24h_weekend','12h','other']);
  ensureBool(req.backup_documented, 'backup_doc');
  ensureNumber(req.avg_responses_30d, 'avg_responses');
  ensureNumber(req.avg_callback_min, 'avg_callback_min');

  let status;
  if (req.call_type === 'primary' && !req.backup_doc) status = 'primary_call_requires_backup';
  else if (req.call_duration === '24h_holiday' && req.avg_callback_min > 30) status = '24h_holiday_callback_over_30min';
  else if (req.avg_responses_30d > 10) status = 'over_10_responses_30d_high_volume_review';
  else status = 'call_assigned';
  return { status, type: req.call_type };
}

function call_coverage(req) {
  ensureStr(req.date, 'date');
  ensureNumber(req.call_slots_required, 'slots_required');
  ensureNumber(req.call_slots_filled, 'slots_filled');
  ensureBool(req.primary_filled, 'primary_filled');
  ensureBool(req.backup_filled, 'backup_filled');
  ensureEnum(req.coverage_period, 'coverage_period', ['weekday','weekend','holiday','24h','extended','other']);
  ensureNumber(req.avg_response_min, 'avg_response_min');

  let status;
  if (req.slots_filled < req.slots_required) status = 'call_gap_critical';
  else if (!req.primary_filled) status = 'primary_call_unfilled';
  else if (!req.backup_filled) status = 'backup_call_unfilled_high_risk';
  else if (req.avg_response_min > 30) status = 'over_30min_response_review';
  else status = 'call_coverage_complete';
  return { status, filled: req.slots_filled };
}

function call_swap(req) {
  ensureStr(req.swap_id, 'swap_id');
  ensureStr(req.from_provider, 'from_provider');
  ensureStr(req.to_provider, 'to_provider');
  ensureNumber(req.days_until_call, 'days_until_call');
  ensureBool(req.peer_approval, 'peer_approval');
  ensureBool(req.scheduler_approval, 'scheduler_approval');
  ensureBool(req.credential_verified, 'credential_verified');

  let status;
  if (!req.peer_approval) status = 'peer_approval_required';
  else if (!req.scheduler_approval) status = 'scheduler_approval_required';
  else if (!req.credential_verified) status = 'credential_verification_required_for_swap';
  else if (req.days_until_call < 1) status = 'under_24h_swap_review';
  else status = 'call_swap_documented';
  return { status, swap: req.swap_id };
}

function call_locums(req) {
  ensureStr(req.locums_id, 'locums_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureNumber(req.days_required, 'days_required');
  ensureBool(req.license_in_state, 'license_in_state');
  ensureBool(req.privileges_granted, 'privileges_granted');
  ensureBool(req.credentialed, 'credentialed');
  ensureNumber(req.hourly_rate, 'hourly_rate');

  let status;
  if (!req.license_in_state) status = 'in_state_license_required';
  else if (!req.privileges_granted) status = 'privileges_required_to_practice';
  else if (!req.credentialed) status = 'credentialing_required_before_practice';
  else if (req.hourly_rate > 350) status = 'over_350_per_hour_review';
  else status = 'locums_ready';
  return { status, rate: req.hourly_rate };
}

function call_pay(req) {
  ensureStr(req.call_id, 'call_id');
  ensureEnum(req.pay_basis, 'pay_basis', ['hourly','per_call','daily','stipend','none','other']);
  ensureNumber(req.pay_amount, 'pay_amount');
  ensureBool(req.holiday_pay, 'holiday_pay');
  ensureNumber(req.calls_taken_30d, 'calls_30d');
  ensureNumber(req.hours_on_call_30d, 'hours_30d');

  let status;
  if (req.pay_basis === 'none') status = 'no_pay_basis_defined';
  else if (req.pay_amount === 0 && req.pay_basis !== 'none') status = 'pay_amount_zero_review';
  else if (!req.holiday_pay && req.pay_basis === 'per_call') status = 'holiday_pay_not_configured';
  else status = 'call_pay_documented';
  return { status, basis: req.pay_basis };
}

function funcs() { return { call_assign, call_coverage, call_swap, call_locums, call_pay }; }
module.exports = { funcs, CITATIONS, ValidationError };