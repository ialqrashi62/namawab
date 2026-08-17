// filepath: tier17_portal_ext_119_appointments_engine.js
// TIER17_PORTAL_EXT-119: Patient portal appointments, scheduling, telehealth
'use strict';

const CITATIONS = ['ONC_PATIENT_API_2024','AAFP_TELEHEALTH_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function portal_book_appt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.specialty, 'specialty', ['primary_care','cardiology','dermatology','endocrinology','gastro','neuro','ortho','ent','ophthalmology','psych','surgery','imaging','lab','telehealth','urgent_care','other']);
  ensureEnum(req.visit_mode, 'visit_mode', ['in_person','tele_video','tele_phone','in_home','other']);
  ensureEnum(req.urgency, 'urgency', ['routine','soon','urgent','emergent_dial_911','other']);
  ensureNumber(req.preferred_days_ahead, 'preferred_days_ahead');
  ensureEnum(req.patient_language, 'patient_language', ['english','arabic','french','urdu','spanish','other']);

  let status;
  if (req.urgency === 'emergent_dial_911') status = 'do_not_book_call_911';
  else if (req.urgency === 'urgent' && req.specialty === 'primary_care') status = 'urgent_book_within_24h';
  else if (req.preferred_days_ahead > 90) status = 'over_90d_limited_availability';
  else if (req.visit_mode === 'tele_video' && !['english','arabic','french','urdu','spanish'].includes(req.patient_language)) status = 'language_interpreter_needed_video';
  else status = 'booked';
  return { status, mode: req.visit_mode };
}

function portal_reschedule(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureEnum(req.reason, 'reason', ['patient_request','provider_unavailable','clinic_emergency','weather','equipment_failure','insurance_change','scheduling_conflict','other']);
  ensureBool(req.within_same_week, 'within_same_week');
  ensureNumber(req.original_lead_days, 'original_lead_days');
  ensureNumber(req.rescheduled_lead_days, 'rescheduled_lead_days');

  let status;
  if (req.reason === 'clinic_emergency') status = 'clinic_emergency_reschedule_required';
  else if (req.original_lead_days < 1 && req.rescheduled_lead_days > 14) status = 'too_much_delay_review';
  else if (!req.within_same_week && req.reason === 'weather') status = 'weather_extend_no_penalty';
  else status = 'rescheduled';
  return { status, apt: req.appointment_id };
}

function portal_cancel(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureNumber(req.hours_until_appt, 'hours_until_appt');
  ensureEnum(req.reason, 'reason', ['patient_no_longer','patient_sick','scheduling_conflict','financial','transportation','resolved','other']);
  ensureNumber(req.cancellation_count_30d, 'cancellation_count_30d');
  ensureBool(req.late_cancel, 'late_cancel');

  let status;
  if (req.late_cancel && req.hours_until_appt < 24) status = 'late_cancel_under_24h_no_show_risk';
  else if (req.cancellation_count_30d > 3) status = 'frequent_cancellation_review';
  else if (req.hours_until_appt < 24 && req.reason === 'patient_no_longer') status = 'late_but_low_value_review';
  else status = 'canceled';
  return { status, late: req.late_cancel };
}

function portal_checkin(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureBool(req.id_confirmed, 'id_confirmed');
  ensureBool(req.insurance_card_uploaded, 'insurance_uploaded');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.questionnaire_completed, 'questionnaire_completed');
  ensureBool(req.copay_paid, 'copay_paid');
  ensureEnum(req.checkin_mode, 'checkin_mode', ['mobile','kiosk','front_desk','phone','other']);

  let status;
  if (!req.id_confirmed) status = 'id_confirmation_required';
  else if (!req.insurance_uploaded) status = 'insurance_upload_required';
  else if (!req.consent_signed) status = 'consent_required';
  else if (!req.questionnaire_completed) status = 'questionnaire_required';
  else status = 'checkin_complete';
  return { status, mode: req.checkin_mode };
}

function portal_telehealth(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureEnum(req.platform, 'platform', ['zoom','teams','webex','whatsapp','proprietary','other']);
  ensureBool(req.device_test_passed, 'device_test');
  ensureBool(req.camera_works, 'camera');
  ensureBool(req.microphone_works, 'microphone');
  ensureEnum(req.bandwidth, 'bandwidth', ['excellent','good','fair','poor','unknown','other']);
  ensureNumber(req.provider_join_min, 'provider_join_min');

  let status;
  if (!req.camera && !req.microphone) status = 'audio_video_required_video_fallback_phone';
  else if (!req.device_test) status = 'device_test_required_precall';
  else if (req.bandwidth === 'poor') status = 'poor_bandwidth_phone_fallback';
  else if (req.provider_join_min > 10) status = 'provider_late_over_10min';
  else status = 'telehealth_ready';
  return { status, platform: req.platform };
}

function funcs() { return { portal_book_appt, portal_reschedule, portal_cancel, portal_checkin, portal_telehealth }; }
module.exports = { funcs, CITATIONS, ValidationError };