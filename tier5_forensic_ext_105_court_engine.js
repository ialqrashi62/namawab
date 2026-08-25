// filepath: tier5_forensic_ext_105_court_engine.js
// TIER5_FORENSIC_EXT-105: Court testimony, expert witness, records release, safeguarding
'use strict';

const CITATIONS = [
  'AAFS_Testimony_Standards_2020',
  'ABA_Courtroom_Testimony_2019',
  'JCAHO_Records_Subpoena_2018',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function court_prep(req) {
  ensureNumber(req.case_id, 'case_id');
  ensureNumber(req.trial_hours_until, 'trial_hours_until');
  ensureBool(req.expert_witness_called, 'expert_witness_called');
  ensureNumber(req.documents_prepared, 'documents_prepared');
  ensureNumber(req.trial_simulation_completed, 'trial_simulation_completed');

  let readiness;
  if (req.expert_witness_called && req.trial_simulation_completed >= 2 && req.documents_prepared >= 5) readiness = 'well_prepared_attorney_consult_for_facts_only';
  else if (req.expert_witness_called && req.documents_prepared >= 3) readiness = 'adequate_follow_attorney_consultation_simulation';
  else if (req.expert_witness_called) readiness = 'consult_attorney_immediately_for_review';
  else if (req.trial_hours_until < 72 && req.documents_prepared < 3) readiness = 'urgent_lawyer_consult_with_minimum_fact_exposition';
  else readiness = 'consider_defer_court_response_then_lawyer_consultation';

  return { readiness, documents_prepared: req.documents_prepared };
}

function expert_testimony(req) {
  ensureNumber(req.days_experience_in_providing_testimony, 'days_experience_in_providing_testimony');
  ensureNumber(req.training_hours, 'training_hours');
  ensureStr(req.role_in_court, 'role_in_court');
  ensureEnum(req.role_in_court, 'role_in_court', ['expert','material_witness','fact_witness','treating_provider']);
  ensureNumber(req.cv_publications_count, 'cv_publications_count');

  let advisory;
  if (req.role_in_court === 'expert' && req.days_experience_in_providing_testimony >= 100 && req.cv_publications_count >= 5) advisory = 'experienced_expert_witness_then_follow_role_standards';
  else if (req.role_in_court === 'expert' && req.cv_publications_count < 5) advisory = 'recognized_expert_consult_for_disclosure_of_testimony_results';
  else if (req.role_in_court === 'treating_provider') advisory = 'treating_physicians_dont_testify_about_others_or_outsource_to_legal_expert';
  else advisory = 'review_role_under_attorney_for_standards';

  return { advisory };
}

function evidence_handling(req) {
  ensureBool(req.specimen_maintained_in_storage, 'specimen_maintained_in_storage');
  ensureNumber(req.storage_location_index_score, 'storage_location_index_score');
  ensureBool(req.digital_evidence_audit_performed, 'digital_evidence_audit_performed');
  ensureNumber(req.signatures_collected, 'signatures_collected');

  let pass_band;
  if (req.specimen_maintained_in_storage && req.storage_location_index_score >= 9 && req.digital_evidence_audit_performed && req.signatures_collected >= 2) pass_band = 'chain_passes_strong_pass_age_then_judicial_action';
  else if (req.specimen_maintained_in_storage && req.signatures_collected >= 1) pass_band = 'chain_acceptable_basic_completed';
  else if (req.specimen_maintained_in_storage) pass_band = 'specimen_stored_then_chain_to_complete';
  else pass_band = 'specimen_not_in_storage_deterioration_start_maintenance';

  return { pass_band };
}

function records_release(req) {
  ensureStr(req.release_basis, 'release_basis');
  ensureEnum(req.release_basis, 'release_basis', ['subpoena','court_order','patient_consent','peer_quality_assurance','audit','none']);
  ensureBool(req.properly_redacted, 'properly_redacted');
  ensureBool(req.third_party_consent_obtained, 'third_party_consent_obtained');
  ensureNumber(req.review_officer_signature_present, 'review_officer_signature_present');

  let release_status;
  if (req.release_basis === 'none' || req.review_officer_signature_present === 0) release_status = 'decline_to_release_no_basis_documented';
  else if (req.properly_redacted && (req.release_basis === 'patient_consent' || req.third_party_consent_obtained)) release_status = 'release_with_required_pii_redaction_and_scope_limitation';
  else if (req.release_basis === 'subpoena' && req.properly_redacted) release_status = 'release_with_minimum_necessary_disclosure';
  else if (req.release_basis === 'subpoena') release_status = 'consult_legal_then_re_redact';

  return { release_status };
}

function safeguarding(req) {
  ensureBool(req.child_or_adult_protective_concern, 'child_or_adult_protective_concern');
  ensureBool(req.report_filed_with_mandated_authority, 'report_filed_with_mandated_authority');
  ensureBool(req.patient_aware_of_report_filing, 'patient_aware_of_report_filing');
  ensureNumber(req.time_to_authority_filing_hours, 'time_to_authority_filing_hours');

  let status;
  if (req.child_or_adult_protective_concern && !req.report_filed_with_mandated_authority) status = 'urgent_report_filing_immediately_with_review_window_then_followup';
  else if (req.child_or_adult_protective_concern && req.report_filed_with_mandated_authority && !req.patient_aware_of_report_filing) status = 'patient_disclosure_just_afterward_or_no_disclosure_required_per_state_law';
  else if (req.child_or_adult_protective_concern && req.report_filed_with_mandated_authority && req.patient_aware_of_report_filing) status = 'optimal_safeguarding_in_concert_with_patient';
  else status = 'no_safeguarding_concerns_then_continue_with_normal_care';

  if (req.time_to_authority_filing_hours > 48 && req.report_filed_with_mandated_authority) status += '_consider_record_review_to_ensure_timeliness';
  return { status };
}

function funcs() { return { court_prep, expert_testimony, evidence_handling, records_release, safeguarding }; }
module.exports = { funcs, CITATIONS, ValidationError };
