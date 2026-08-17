// filepath: tier19_him_ext_128_roi_engine.js
// TIER19_HIM_EXT-128: Release of information (ROI), HIPAA authorization
'use strict';

const CITATIONS = ['HIPAA_ROI_2024','HITECH_2024','ONC_CCDS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function roi_authorization(req) {
  ensureStr(req.auth_id, 'auth_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.patient_signature, 'patient_signature');
  ensureStr(req.sign_date, 'sign_date');
  ensureBool(req.expiration_set, 'expiration_set');
  ensureNumber(req.days_until_expiration, 'days_until_expiration');
  ensureEnum(req.requestor_type, 'requestor_type', ['patient','legal_representative','physician','insurance','attorney','court_order','law_enforcement','research','other']);
  ensureEnum(req.purpose, 'purpose', ['continuing_care','insurance','legal','patient_request','research','quality','other']);

  let status;
  if (!req.patient_signature) status = 'patient_signature_required_blocking';
  else if (req.expiration_set && req.days_until_expiration < 0) status = 'authorization_expired';
  else if (req.requestor_type === 'court_order' && req.purpose !== 'legal') status = 'court_order_purpose_legal';
  else if (req.requestor_type === 'law_enforcement' && !['legal','quality'].includes(req.purpose)) status = 'law_enforcement_authorized_purposes_only';
  else status = 'authorization_valid';
  return { status, days: req.days_until_expiration };
}

function roi_verify_identity(req) {
  ensureStr(req.request_id, 'request_id');
  ensureEnum(req.verification_method, 'verification_method', ['drivers_license','passport','photo_id','signature_verification','knowledge_based','biometric','three_identifying','patient_portal_verified','other']);
  ensureBool(req.drivers_license_match, 'dl_match');
  ensureBool(req.dob_verified, 'dob_verified');
  ensureBool(req.ssn_last4_verified, 'ssn_verified');
  ensureBool(req.address_verified, 'address_verified');
  ensureBool(req.third_party_authorization_attached, 'third_party_auth');

  let status;
  if (req.verification_method === 'three_identifying' && (!req.dob_verified || !req.ssn_verified || !req.address_verified)) status = 'three_identifying_requires_all_three';
  else if (!req.dl_match && !req.dob_verified) status = 'minimum_two_identifiers_required';
  else if (req.third_party_authorization_attached && req.verification_method === 'knowledge_based') status = 'knowledge_based_acceptable_for_third_party';
  else status = 'identity_verified';
  return { status, method: req.verification_method };
}

function roi_request_log(req) {
  ensureStr(req.request_id, 'request_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.request_status, 'request_status', ['received','pending_authorization','identity_verification','in_process','ready','sent','rejected','cancelled','appeal','other']);
  ensureNumber(req.days_open, 'days_open');
  ensureBool(req.statutory_deadline_passing, 'statute_approaching');
  ensureEnum(req.delivery_method, 'delivery_method', ['email_secure','email_unsecure','portal_download','paper_pickup','paper_mail','fax','cd_dvd','usb','other']);
  ensureBool(req.fee_charged, 'fee_charged');

  let status;
  if (req.days_open > 30 && req.statutory_deadline_passing) status = 'over_30d_statutory_review';
  else if (req.request_status === 'rejected') status = 'rejected_documented_appeal_path';
  else if (req.delivery_method === 'email_unsecure') status = 'unsecure_email_blocking_phi_required';
  else if (req.fee_charged && req.request_status === 'ready') status = 'fee_state_law_compliance_required';
  else status = 'request_documented';
  return { status, days: req.days_open };
}

function roi_third_party(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.recipient_type, 'recipient_type', ['insurance','attorney','provider','family_member','research','court','law_enforcement','employer','school','other']);
  ensureBool(req.patient_authorization, 'patient_auth');
  ensureStr(req.auth_date, 'auth_date');
  ensureBool(req.minimum_necessary_review, 'min_necessary_review');
  ensureBool(req.sensitive_phi_present, 'sensitive_phi');
  ensureBool(req.sensitive_phi_reviewed, 'sensitive_reviewed');

  let status;
  if (!req.patient_authorization) status = 'authorization_required_for_third_party';
  else if (req.sensitive_phi_present && !req.sensitive_phi_reviewed) status = 'sensitive_phi_substance_abuse_etc_special_review';
  else if (!req.minimum_necessary_review) status = 'minimum_necessary_review_required';
  else if (req.recipient_type === 'employer' && req.sensitive_phi_present) status = 'employer_authorized_only_minimum_necessary';
  else status = 'third_party_release_appropriate';
  return { status, recipient: req.recipient_type };
}

function roi_audit(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureStr(req.user_id, 'user_id');
  ensureEnum(req.event_type, 'event_type', ['phi_view','phi_download','phi_print','phi_forward','phi_amend','phi_delete','authorization_signed','authorization_revoked','break_glass','other']);
  ensureNumber(req.records_accessed_count, 'records_accessed');
  ensureBool(req.unusual_access, 'unusual_access');
  ensureBool(req.self_access, 'self_access');
  ensureBool(req.investigated, 'investigated');

  let status;
  if (req.self_access && !req.investigated) status = 'self_access_must_be_investigated';
  else if (req.unusual_access && req.records_accessed_count > 50) status = 'bulk_access_review_minimum_necessary';
  else if (req.event_type === 'break_glass' && !req.investigated) status = 'break_glass_audit_required';
  else status = 'audit_logged';
  return { status, event: req.event_type };
}

function funcs() { return { roi_authorization, roi_verify_identity, roi_request_log, roi_third_party, roi_audit }; }
module.exports = { funcs, CITATIONS, ValidationError };