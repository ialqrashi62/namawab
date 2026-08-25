// filepath: tier21_sched_ext_137_provider_engine.js
// TIER21_SCHED_EXT-137: Provider availability, preferences, time off
'use strict';

const CITATIONS = ['MGMA_PROVIDER_2024','AAFP_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function provider_availability(req) {
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.day_of_week, 'day_of_week', ['mon','tue','wed','thu','fri','sat','sun','unknown','other']);
  ensureEnum(req.session, 'session', ['morning','afternoon','evening','night','all_day','am_half','pm_half','not_available','other']);
  ensureNumber(req.sessions_per_week, 'sessions_per_week');
  ensureNumber(req.max_daily_visits, 'max_daily_visits');
  ensureNumber(req.max_weekly_visits, 'max_weekly_visits');
  ensureBool(req.telehealth_included, 'telehealth');
  ensureBool(req.active, 'active');

  let status;
  if (!req.active) status = 'provider_inactive';
  else if (req.sessions_per_week > 10) status = 'over_10_sessions_week_review_burnout';
  else if (req.max_daily_visits > 35) status = 'over_35_daily_visits_review';
  else status = 'availability_appropriate';
  return { status, active: req.active };
}

function provider_preference(req) {
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.preference_type, 'preference_type', ['no_new_block','new_patients_ok','specific_age','specific_gender','specific_insurance','language','no_procedures','procedures_only','continuity','other']);
  ensureStr(req.start_date, 'start_date');
  ensureNumber(req.days_applied, 'days_applied');
  ensureBool(req.approved, 'approved');
  ensureBool(req.manager_reviewed, 'manager_reviewed');

  let status;
  if (!req.manager_reviewed) status = 'manager_review_required';
  else if (!req.approved) status = 'preference_pending_review';
  else if (req.days_applied > 90 && req.preference_type === 'no_new_block') status = 'extended_no_new_block_review';
  else status = 'preference_documented';
  return { status, type: req.preference_type };
}

function provider_timeoff(req) {
  ensureStr(req.request_id, 'request_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureNumber(req.days_requested, 'days_requested');
  ensureEnum(req.pto_type, 'pto_type', ['vacation','sick','personal','bereavement','jury','military','unpaid','other']);
  ensureBool(req.coverage_planned, 'coverage_planned');
  ensureBool(req.patients_notified, 'patients_notified');
  ensureEnum(req.approval, 'approval', ['pending','approved','denied','cancelled','other']);
  ensureNumber(req.pto_balance_days, 'pto_balance');

  let status;
  if (req.days_requested > req.pto_balance_days) status = 'insufficient_balance_review';
  else if (!req.coverage_planned) status = 'coverage_plan_required';
  else if (!req.patients_notified && req.days_requested > 5) status = 'patient_notification_required_over_5d';
  else if (req.approval === 'denied') status = 'denied_documented';
  else status = 'timeoff_appropriate';
  return { status, days: req.days_requested };
}

function provider_panel(req) {
  ensureStr(req.provider_id, 'provider_id');
  ensureNumber(req.panel_size, 'panel_size');
  ensureNumber(req.target_panel, 'target_panel');
  ensureNumber(req.new_patients_accepted, 'new_patients');
  ensureEnum(req.panel_status, 'panel_status', ['open','closed','restricted','inherited','transferring','retiring','other']);
  ensureNumber(req.age_distribution_under_18_pct, 'under_18_pct');
  ensureNumber(req.age_distribution_over_65_pct, 'over_65_pct');

  let status;
  if (req.panel_size > req.target_panel * 1.1) status = 'over_panel_target_review';
  else if (req.panel_status === 'closed') status = 'panel_closed_review';
  else if (req.panel_status === 'retiring') status = 'panel_retiring_handoff';
  else if (req.over_65_pct > 40) status = 'over_40pct_elderly_acuity_review';
  else status = 'panel_appropriate';
  return { status, size: req.panel_size };
}

function provider_credential(req) {
  ensureStr(req.provider_id, 'provider_id');
  ensureBool(req.medical_license_current, 'license');
  ensureBool(req.dea_license_current, 'dea');
  ensureBool(req.board_certification_current, 'board');
  ensureBool(req.malpractice_current, 'malpractice');
  ensureBool(req.hospital_privileges_current, 'privileges');
  ensureNumber(req.days_until_license_renewal, 'days_until_renewal');

  let status;
  if (!req.medical_license_current) status = 'medical_license_expired_blocking';
  else if (!req.dea_license_current && req.dea_required) status = 'dea_expired_blocking';
  else if (req.days_until_license_renewal < 60) status = 'license_renewal_within_60d';
  else if (!req.board_certification_current) status = 'board_certification_expired';
  else if (!req.hospital_privileges_current) status = 'hospital_privileges_required';
  else status = 'credentials_current';
  return { status, provider: req.provider_id };
}

function funcs() { return { provider_availability, provider_preference, provider_timeoff, provider_panel, provider_credential }; }
module.exports = { funcs, CITATIONS, ValidationError };