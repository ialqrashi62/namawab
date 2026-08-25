// filepath: tier12_emr_ext_101_signature_engine.js
// TIER12_EMR_EXT-101: Digital signature & attestation
'use strict';

const CITATIONS = ['ONC_CURES_2024','CMS_CPOE_2024','HL7_CDA_2_2024','ESIGN_ACT_2000'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sig_create(req) {
  ensureStr(req.document_id, 'document_id');
  ensureStr(req.signer_id, 'signer_id');
  ensureStr(req.signer_role, 'signer_role');
  ensureEnum(req.signature_type, 'signature_type', ['electronic_standard','electronic_qualified','digital_x509','biometric','pin','password','sso_assertion','two_factor','amendment_addendum','cosignature','witness_required']);
  ensureBool(req.identity_verified, 'identity_verified');
  ensureBool(req.intent_affirmed, 'intent_affirmed');
  ensureBool(req.timestamp_authoritative, 'timestamp_authoritative');

  let sig_status;
  if (!req.identity_verified) sig_status = 'identity_verification_required_blocking';
  else if (!req.intent_affirmed) sig_status = 'intent_to_sign_affirmation_required';
  else if (req.signature_type === 'biometric' && !req.timestamp_authoritative) sig_status = 'biometric_requires_audit_timestamp';
  else if (req.signature_type === 'witness_required') sig_status = 'witness_signature_required';
  else sig_status = 'signature_eligible';
  return { sig_status, signature_type: req.signature_type, signer_role: req.signer_role };
}

function sig_amend(req) {
  ensureStr(req.document_id, 'document_id');
  ensureStr(req.original_signature_id, 'original_signature_id');
  ensureStr(req.amendment_text, 'amendment_text');
  ensureEnum(req.amendment_reason, 'amendment_reason', ['correction_typo','additional_info','clarification','updated_data','patient_request','clinical_revision','system_error','other']);
  ensureBool(req.preserved_original, 'preserved_original');
  ensureStr(req.amender_id, 'amender_id');

  let amend_status;
  if (!req.preserved_original) amend_status = 'preserve_original_required_blocking';
  else if (req.amendment_reason === 'system_error') amend_status = 'system_error_review_root_cause';
  else if (req.amendment_text.length > 5000) amend_status = 'amendment_too_long_split_or_re_sign';
  else amend_status = 'amendment_eligible';
  return { amend_status, reason: req.amendment_reason };
}

function sig_lock(req) {
  ensureStr(req.document_id, 'document_id');
  ensureNumber(req.signatures_count, 'signatures_count');
  ensureEnum(req.lock_scope, 'lock_scope', ['single_user','department','facility','tenant','permanent','revisable_until_correction','revisable_until_review']);
  ensureNumber(req.days_locked, 'days_locked');
  ensureBool(req.has_audit_trail, 'has_audit_trail');

  let lock_status;
  if (req.signatures_count === 0) lock_status = 'cannot_lock_unsigned_document';
  else if (!req.has_audit_trail) lock_status = 'audit_trail_required_blocking_lock';
  else if (req.lock_scope === 'permanent' && req.signatures_count < 2) lock_status = 'permanent_lock_requires_two_signatures';
  else if (req.days_locked >= 2555) lock_status = 'retention_7_years_compliance_ok';
  else lock_status = 'lock_eligible';
  return { lock_status, lock_scope: req.lock_scope };
}

function sig_attestation(req) {
  ensureStr(req.attestation_id, 'attestation_id');
  ensureEnum(req.attestation_type, 'attestation_type', ['resident_attending','moonlighting_resident','np_pa_supervised','teaching_physician','medical_student','consultant','transfer_summary','discharge_summary','operative_note','procedure_note','progress_note','h_and_p','med_rec_reconciliation','none','other']);
  ensureNumber(req.days_since_encounter, 'days_since_encounter');
  ensureBool(req.attending_can_attest, 'attending_can_attest');
  ensureBool(req.medical_student_signature_required, 'medical_student_signature_required');

  let attestation_status;
  if (req.attestation_type === 'teaching_physician' && req.days_since_encounter > 30) attestation_status = 'over_30d_window_timely_rule_violation';
  else if (req.attestation_type === 'medical_student' && !req.medical_student_signature_required) attestation_status = 'medical_student_signature_required_attending_only';
  else if (!req.attending_can_attest && req.attestation_type.includes('teaching')) attestation_status = 'attending_authority_required';
  else attestation_status = 'attestation_eligible';
  return { attestation_status, type: req.attestation_type, days: req.days_since_encounter };
}

function sig_audit(req) {
  ensureStr(req.document_id, 'document_id');
  ensureNumber(req.events_count, 'events_count');
  ensureNumber(req.hash_chain_valid, 'hash_chain_valid');
  ensureNumber(req.days_since_last_modification, 'days_since_last_modification');
  ensureBool(req.signed_off, 'signed_off');

  let audit_status;
  if (req.hash_chain_valid === 0) audit_status = 'tamper_detected_investigate_immediately';
  else if (req.events_count === 0) audit_status = 'no_audit_events_investigate';
  else if (req.days_since_last_modification > 30 && !req.signed_off) audit_status = 'long_pending_signature_alert';
  else audit_status = 'audit_trail_complete';
  return { audit_status, events: req.events_count, hash_valid: req.hash_chain_valid };
}

function funcs() { return { sig_create, sig_amend, sig_lock, sig_attestation, sig_audit }; }
module.exports = { funcs, CITATIONS, ValidationError };