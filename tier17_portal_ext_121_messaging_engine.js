// filepath: tier17_portal_ext_121_messaging_engine.js
// TIER17_PORTAL_EXT-121: Patient portal secure messaging, refill, referrals
'use strict';

const CITATIONS = ['HIPAA_SECURE_MSG_2024','ONC_INTEROP_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function portal_message(req) {
  ensureStr(req.thread_id, 'thread_id');
  ensureEnum(req.message_type, 'message_type', ['clinical_question','medication_question','lab_question','appointment_request','administrative','symptom_report','other']);
  ensureEnum(req.urgency, 'urgency', ['routine_3day','priority_24h','urgent_4h','emergency_911','other']);
  ensureNumber(req.attachments_count, 'attachments_count');
  ensureBool(req.urgent_symptoms_flag, 'urgent_symptoms');
  ensureStr(req.patient_id, 'patient_id');

  let status;
  if (req.urgency === 'emergency_911' || req.urgent_symptoms_flag) status = 'urgent_symptoms_redirect_to_911_or_ed';
  else if (req.message_type === 'symptom_report') status = 'symptom_report_triage_required';
  else if (req.attachments_count > 5) status = 'too_many_attachments_compress';
  else if (req.urgency === 'urgent_4h') status = 'urgent_routing_to_nurse';
  else status = 'message_queued';
  return { status, urgency: req.urgency };
}

function portal_refill_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'medication_id');
  ensureBool(req.has_active_prescription, 'has_active_rx');
  ensureBool(req.refills_remaining, 'refills_remaining');
  ensureEnum(req.request_source, 'request_source', ['patient','caregiver','pharmacy','provider','other']);
  ensureBool(req.last_fill_within_90d, 'last_fill_within_90d');
  ensureNumber(req.days_since_last_fill, 'days_since_last_fill');

  let status;
  if (!req.has_active_prescription) status = 'no_active_prescription_provider_review';
  else if (!req.refills_remaining) status = 'no_refills_remaining_new_visit_required';
  else if (!req.last_fill_within_90d) status = 'over_90d_no_fill_review';
  else if (req.request_source === 'pharmacy') status = 'pharmacy_refill_request_forwarded';
  else status = 'refill_requested';
  return { status, med: req.medication_id };
}

function portal_referral_request(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.referral_specialty, 'referral_specialty', ['cardiology','derm','endo','gastro','neuro','ortho','psych','surgery','uro','other']);
  ensureEnum(req.urgency, 'urgency', ['routine','soon_2_weeks','urgent_72h','emergent','other']);
  ensureBool(req.insurance_auth_required, 'auth_required');
  ensureBool(req.in_network, 'in_network');
  ensureNumber(req.attempts_30d, 'attempts_30d');

  let status;
  if (!req.in_network) status = 'oon_review_no_surprise_billing';
  else if (req.insurance_auth_required && req.urgency === 'emergent') status = 'emergent_no_prior_auth_required';
  else if (req.attempts_30d > 3) status = 'multiple_attempts_review_pcp_referral';
  else if (req.urgency === 'urgent_72h') status = 'urgent_route_to_specialist';
  else status = 'referral_requested';
  return { status, specialty: req.referral_specialty };
}

function portal_proxy_access(req) {
  ensureStr(req.proxy_id, 'proxy_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.proxy_type, 'proxy_type', ['parent_minor','guardian_adult','spouse','caregiver','power_of_attorney','health_care_proxy','other']);
  ensureBool(req.legal_doc_uploaded, 'legal_doc');
  ensureBool(req.identity_verified, 'id_verified');
  ensureBool(req.patient_consent_signed, 'patient_consent');
  ensureNumber(req.expiration_date_days, 'expiration_days');

  let status;
  if (req.proxy_type === 'parent_minor' && !req.legal_doc) status = 'parent_minor_birth_cert_optional';
  else if (!req.identity_verified) status = 'proxy_identity_verification_required';
  else if (!req.patient_consent_signed) status = 'patient_consent_required_for_proxy';
  else if (req.expiration_date_days < 7) status = 'expiration_within_7_days_renew';
  else status = 'proxy_access_active';
  return { status, proxy: req.proxy_id };
}

function portal_consent(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.consent_type, 'consent_type', ['telehealth','data_sharing_hie','research_opt_in','marketing_opt_in','sms_opt_in','email_opt_in','third_party_app','other']);
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.revoked, 'revoked');
  ensureBool(req.withdrawn_documented, 'withdrawn_documented');
  ensureStr(req.consent_date, 'consent_date');

  let status;
  if (req.revoked && !req.withdrawn_documented) status = 'revoked_but_not_documented_complete';
  else if (!req.consent_signed) status = 'consent_not_signed_pending';
  else if (req.consent_type === 'data_sharing_hie' && req.revoked) status = 'hie_revoked_stop_sharing';
  else if (req.consent_type === 'research_opt_in' && !req.revoked) status = 'research_opt_in_active';
  else status = 'consent_recorded';
  return { status, type: req.consent_type };
}

function funcs() { return { portal_message, portal_refill_request, portal_referral_request, portal_proxy_access, portal_consent }; }
module.exports = { funcs, CITATIONS, ValidationError };