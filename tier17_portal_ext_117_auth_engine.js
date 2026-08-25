// filepath: tier17_portal_ext_117_auth_engine.js
// TIER17_PORTAL_EXT-117: Patient portal auth, MFA, session mgmt
'use strict';

const CITATIONS = ['NIST_800_63B_2020','HIPAA_2024','ONC_PATIENT_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function portal_register(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.invite_method, 'invite_method', ['email','sms','paper','in_person','phone','third_party_app','other']);
  ensureStr(req.email, 'email');
  ensureStr(req.phone, 'phone');
  ensureBool(req.identity_verified, 'identity_verified');
  ensureEnum(req.id_method, 'id_method', ['none','drivers_license','passport','state_id','biometric','knowledge_based','photo_match','other']);
  ensureBool(req.consent_signed, 'consent_signed');

  let status;
  if (!req.identity_verified) status = 'identity_verification_required';
  else if (req.id_method === 'none') status = 'id_verification_method_required';
  else if (!req.consent_signed) status = 'consent_required';
  else if (!req.email && !req.phone) status = 'contact_method_required';
  else status = 'registered';
  return { status, patient: req.patient_id };
}

function portal_login(req) {
  ensureStr(req.username, 'username');
  ensureEnum(req.mfa_method, 'mfa_method', ['none','totp','sms','email','push','fido2','backup_codes','other']);
  ensureNumber(req.attempts_30d, 'attempts_30d');
  ensureBool(req.account_locked, 'account_locked');
  ensureBool(req.password_expired, 'password_expired');
  ensureEnum(req.login_context, 'login_context', ['web','mobile','tablet','kiosk','other']);
  ensureBool(req.geo_anomaly, 'geo_anomaly');

  let status;
  if (req.account_locked) status = 'account_locked_unlock_required';
  else if (req.attempts_30d > 10) status = 'high_failed_attempts_review';
  else if (req.mfa_method === 'none') status = 'mfa_required_per_policy';
  else if (req.password_expired) status = 'password_change_required';
  else if (req.geo_anomaly) status = 'geo_anomaly_block_and_verify';
  else status = 'login_allowed';
  return { status, mfa: req.mfa_method };
}

function portal_session(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.idle_minutes, 'idle_minutes');
  ensureNumber(req.max_idle_minutes, 'max_idle_minutes');
  ensureNumber(req.total_minutes, 'total_minutes');
  ensureNumber(req.max_total_minutes, 'max_total_minutes');
  ensureBool(req.phi_accessed, 'phi_accessed');
  ensureBool(req.idle_logout_enforced, 'idle_logout_enforced');

  let status;
  if (req.phi_accessed && req.idle_minutes > 15) status = 'idle_over_15_phi_logout_required';
  else if (req.idle_minutes > req.max_idle_minutes) status = 'idle_timeout_terminate';
  else if (req.total_minutes > req.max_total_minutes) status = 'total_timeout_terminate';
  else if (!req.idle_logout_enforced && req.phi_accessed) status = 'idle_logout_policy_required';
  else status = 'session_active';
  return { status, session: req.session_id };
}

function portal_password_reset(req) {
  ensureStr(req.user_id, 'user_id');
  ensureEnum(req.reset_method, 'reset_method', ['email_link','sms_code','security_questions','admin_reset','self_service','other']);
  ensureBool(req.identity_verified, 'identity_verified');
  ensureNumber(req.resets_30d, 'resets_30d');
  ensureBool(req.password_strength_ok, 'password_strength_ok');

  let status;
  if (req.resets_30d > 5) status = 'too_many_resets_review_compromise';
  else if (!req.identity_verified) status = 'identity_verification_required_for_reset';
  else if (!req.password_strength_ok) status = 'password_too_weak_again';
  else if (req.reset_method === 'security_questions') status = 'deprecated_security_questions';
  else status = 'reset_successful';
  return { status, method: req.reset_method };
}

function portal_audit(req) {
  ensureStr(req.user_id, 'user_id');
  ensureEnum(req.event_type, 'event_type', ['login','logout','phi_view','phi_export','phi_download','phi_print','access_denied','password_change','mfa_change','other']);
  ensureBool(req.phi_involved, 'phi_involved');
  ensureStr(req.ip_address, 'ip_address');
  ensureBool(req.unusual_pattern, 'unusual_pattern');
  ensureEnum(req.severity, 'severity', ['info','low','medium','high','critical','other']);

  let status;
  if (req.event_type === 'phi_export' && req.unusual_pattern) status = 'phi_export_unusual_investigate';
  else if (req.severity === 'critical') status = 'critical_alert_security_review';
  else if (req.phi_involved && req.unusual_pattern) status = 'phi_unusual_pattern_investigate';
  else status = 'audit_logged';
  return { status, event: req.event_type };
}

function funcs() { return { portal_register, portal_login, portal_session, portal_password_reset, portal_audit }; }
module.exports = { funcs, CITATIONS, ValidationError };