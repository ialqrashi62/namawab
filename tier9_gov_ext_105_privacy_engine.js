// filepath: tier9_gov_ext_105_privacy_engine.js
// TIER9_GOV_EXT-105: Privacy & data protection (PDPL/HIPAA)
'use strict';

const CITATIONS = ['PDPL_SAUDI_2024','HIPAA_2024','GDPR_ART_30','NPHIES_PRIVY_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function privacy_consent(req) {
  ensureStr(req.subject_id, 'subject_id');
  ensureEnum(req.consent_type, 'consent_type', ['treatment','research','marketing','data_sharing','cross_border','phi_processing','specific_department','tele_visit','recording']);
  ensureBool(req.explicit, 'explicit');
  ensureBool(req.informed, 'informed');
  ensureBool(req.withdrawable, 'withdrawable');
  ensureStr(req.consent_date, 'consent_date');
  ensureNumber(req.expiry_days, 'expiry_days');

  let consent_validity;
  if (!req.explicit || !req.informed) consent_validity = 'consent_invalid_must_be_explicit_and_informed';
  else if (!req.withdrawable) consent_validity = 'consent_invalid_must_be_withdrawable';
  else if (req.expiry_days > 365) consent_validity = 'expiry_too_long_re_evaluate_per_jurisdiction';
  else if (req.expiry_days <= 0) consent_validity = 'no_expiry_set_unusual';
  else consent_validity = 'consent_valid_recorded';
  return { consent_validity, consent_type: req.consent_type };
}

function privacy_dsr(req) {
  ensureStr(req.request_id, 'request_id');
  ensureEnum(req.request_type, 'request_type', ['access','rectification','erasure','portability','restriction','object','opt_out','do_not_sell','do_not_share']);
  ensureStr(req.subject_id, 'subject_id');
  ensureNumber(req.days_since_request, 'days_since_request');
  ensureNumber(req.jurisdiction_deadline_days, 'jurisdiction_deadline_days');
  ensureBool(req.identity_verified, 'identity_verified');

  let dsr_status;
  if (!req.identity_verified) dsr_status = 'identity_verification_required_first';
  else if (req.days_since_request > req.jurisdiction_deadline_days) dsr_status = 'overdue_jurisdiction_breach_priority';
  else if (req.days_since_request > req.jurisdiction_deadline_days * 0.7) dsr_status = 'approaching_deadline_priority';
  else if (req.request_type === 'erasure') dsr_status = 'erasure_complex_review_exceptions';
  else dsr_status = 'in_progress';
  return { dsr_status, days: req.days_since_request, deadline: req.jurisdiction_deadline_days };
}

function privacy_breach(req) {
  ensureStr(req.breach_id, 'breach_id');
  ensureNumber(req.subjects_affected, 'subjects_affected');
  ensureEnum(req.data_categories, 'data_categories', ['phi','pii','financial','credentials','biometric','genetic','employee','children','none']);
  ensureBool(req.encryption_protected, 'encryption_protected');
  ensureNumber(req.days_since_discovery, 'days_since_discovery');
  ensureNumber(req.notification_deadline_days, 'notification_deadline_days');

  let breach_severity;
  if (!req.encryption_protected && req.data_categories === 'phi' && req.subjects_affected >= 500) breach_severity = 'catastrophic_immediate_full_disclosure';
  else if (req.data_categories === 'phi' && !req.encryption_protected) breach_severity = 'major_disclose_to_authorities_and_subjects';
  else if (req.data_categories === 'phi' && req.encryption_protected) breach_severity = 'moderate_log_and_monitor';
  else if (req.subjects_affected >= 100) breach_severity = 'significant_disclose';
  else if (req.encryption_protected) breach_severity = 'low_log_only';
  else breach_severity = 'moderate_assess';

  let notification_status;
  if (req.days_since_discovery > req.notification_deadline_days) notification_status = 'overdue_notification_high_liability';
  else if (breach_severity === 'low_log_only') notification_status = 'no_notification_required';
  else notification_status = 'within_deadline_proceed';

  return { breach_severity, notification_status, subjects: req.subjects_affected };
}

function privacy_dpia(req) {
  ensureStr(req.dpia_id, 'dpia_id');
  ensureEnum(req.processing_purpose, 'processing_purpose', ['patient_care','research','analytics','ai_training','quality_improvement','billing','insurance','public_health','employee_monitoring','marketing']);
  ensureNumber(req.subjects_volume, 'subjects_volume');
  ensureEnum(req.special_category_data, 'special_category_data', ['none','phi','genetic','biometric','mental_health','sexual_health','substance_abuse','child_data']);
  ensureBool(req.cross_border, 'cross_border');
  ensureBool(req.automated_decision_making, 'automated_decision_making');

  let dpia_risk;
  if (req.special_category_data === 'genetic' || req.special_category_data === 'mental_health') dpia_risk = 'high_dpia_required';
  else if (req.cross_border && req.special_category_data !== 'none') dpia_risk = 'high_cross_border_special_category';
  else if (req.automated_decision_making && req.subjects_volume >= 1000) dpia_risk = 'high_automated_decision_volume';
  else if (req.subjects_volume >= 10000) dpia_risk = 'medium_high_volume';
  else if (req.special_category_data === 'none' && !req.cross_border) dpia_risk = 'low_no_dpia_required';
  else dpia_risk = 'medium_dpia_recommended';

  return { dpia_risk, purpose: req.processing_purpose };
}

function privacy_training(req) {
  ensureStr(req.user_id, 'user_id');
  ensureEnum(req.role, 'role', ['physician','nurse','admin','receptionist','technician','researcher','executive','contractor','visitor','it_staff']);
  ensureNumber(req.training_completed_count, 'training_completed_count');
  ensureNumber(req.training_required_count, 'training_required_count');
  ensureNumber(req.days_since_last_training, 'days_since_last_training');
  ensureEnum(req.last_topic, 'last_topic', ['phi_basics','cyber_security','email_phishing','breach_response','patient_rights','data_sharing','cross_border','none']);

  let compliance_status;
  const completion_rate = req.training_required_count > 0 ? req.training_completed_count / req.training_required_count : 1;
  if (completion_rate >= 1 && req.days_since_last_training <= 365) compliance_status = 'fully_compliant';
  else if (completion_rate >= 0.8) compliance_status = 'mostly_compliant';
  else if (completion_rate >= 0.5) compliance_status = 'partially_compliant_reminder';
  else if (req.role === 'physician' || req.role === 'nurse') compliance_status = 'clinical_staff_priority_reminder';
  else compliance_status = 'non_compliant_action_required';
  return { compliance_status, completion_rate: Math.round(completion_rate * 1000) / 10, days: req.days_since_last_training };
}

function funcs() { return { privacy_consent, privacy_dsr, privacy_breach, privacy_dpia, privacy_training }; }
module.exports = { funcs, CITATIONS, ValidationError };