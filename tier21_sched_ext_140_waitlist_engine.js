// filepath: tier21_sched_ext_140_waitlist_engine.js
// TIER21_SCHED_EXT-140: Waitlist, no-show tracking, patient access
'use strict';

const CITATIONS = ['MGMA_WAITLIST_2024','AAFP_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function waitlist_add(req) {
  ensureStr(req.waitlist_id, 'waitlist_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.urgency, 'urgency', ['routine','soon','priority','urgent','emergency','other']);
  ensureNumber(req.days_waiting, 'days_waiting');
  ensureEnum(req.contact_preference, 'contact_preference', ['phone','email','sms','portal','any','other']);
  ensureBool(req.special_needs, 'special_needs');

  let status;
  if (req.urgency === 'emergency') status = 'emergency_dont_waitlist_send_ed';
  else if (req.days_waiting > 90 && req.urgency === 'routine') status = 'over_90d_review_priority';
  else if (req.special_needs) status = 'special_needs_review_accessibility';
  else status = 'waitlist_added';
  return { status, id: req.waitlist_id };
}

function waitlist_match(req) {
  ensureStr(req.waitlist_id, 'waitlist_id');
  ensureNumber(req.opening_slots, 'open_slots');
  ensureEnum(req.match_score, 'match_score', ['high_match','moderate_match','low_match','no_match','other']);
  ensureEnum(req.urgency_compatibility, 'urgency_compatibility', ['exact','higher_urgency_ok','lower_urgency_ok','mismatch','other']);
  ensureBool(req.special_needs_compatible, 'special_needs_compatible');
  ensureBool(req.contacted, 'contacted');

  let status;
  if (req.match_score === 'no_match') status = 'no_match_keep_waiting';
  else if (req.match_score === 'high_match' && !req.contacted) status = 'high_match_contact_immediately';
  else if (req.urgency_compatibility === 'mismatch') status = 'urgency_mismatch_review';
  else if (!req.special_needs_compatible && req.special_needs) status = 'special_needs_incompatible_alternative';
  else status = 'waitlist_match_offered';
  return { status, score: req.match_score };
}

function waitlist_purge(req) {
  ensureStr(req.purge_id, 'purge_id');
  ensureNumber(req.days_inactive, 'days_inactive');
  ensureNumber(req.contact_attempts, 'contact_attempts');
  ensureBool(req.contact_reached, 'reached');
  ensureEnum(req.purge_reason, 'purge_reason', ['patient_request','patient_unreachable','patient_no_longer','provider_transition','provider_panel_closed','inactivity','other']);
  ensureBool(req.removal_letter_sent, 'letter_sent');

  let status;
  if (req.days_inactive > 365 && req.contact_attempts >= 3) status = 'over_year_inactive_3_attempts_purge_eligible';
  else if (!req.contact_reached && req.contact_attempts < 3) status = 'continue_contact_attempts_before_purge';
  else if (!req.removal_letter_sent) status = 'removal_letter_required_before_purge';
  else if (req.purge_reason === 'patient_request') status = 'patient_requested_documented';
  else status = 'waitlist_purged';
  return { status, reason: req.purge_reason };
}

function noshow_track(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.no_show_count_12m, 'no_show_count_12m');
  ensureNumber(req.appointments_count_12m, 'appts_count_12m');
  ensureNumber(req.cancellations_24h_12m, 'late_cancel_12m');
  ensureBool(req.reminder_sent, 'reminder_sent');
  ensureBool(req.confirmation_24h, 'confirmation_24h');

  const noShowRate = req.appointments_count_12m > 0 ? (req.no_show_count_12m / req.appointments_count_12m) * 100 : 0;
  let status;
  if (noShowRate > 30) status = 'over_30pct_no_show_review_discharge_from_practice';
  else if (!req.reminder_sent) status = 'reminder_required';
  else if (!req.confirmation_24h) status = 'confirmation_24h_required';
  else status = 'noshow_tracked';
  return { status, rate: Math.round(noShowRate * 10) / 10 };
}

function patient_access(req) {
  ensureStr(req.unit_id, 'unit_id');
  ensureNumber(req.third_next_available_days, 'tna_days');
  ensureNumber(req.target_tna_days, 'target_tna');
  ensureNumber(req.new_patient_visits_30d, 'new_30d');
  ensureNumber(req.established_wait_days, 'established_wait');
  ensureEnum(req.access_band, 'access_band', ['good','fair','poor','critical','unknown','other']);
  ensureBool(req.extended_hours_offered, 'extended_hours');

  let status;
  if (req.third_next_available_days > 30) status = 'over_30d_third_next_access_critical';
  else if (req.access_band === 'critical') status = 'critical_access_review';
  else if (req.established_wait_days > req.target_tna) status = 'established_above_target';
  else if (!req.extended_hours_offered) status = 'extended_hours_recommended_for_access';
  else status = 'access_appropriate';
  return { status, tna: req.third_next_available_days };
}

function funcs() { return { waitlist_add, waitlist_match, waitlist_purge, noshow_track, patient_access }; }
module.exports = { funcs, CITATIONS, ValidationError };