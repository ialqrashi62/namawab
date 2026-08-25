// filepath: tier5_forensic_ext_104_documentation_engine.js
// TIER5_FORENSIC_EXT-104: Documentation & chain of custody (note quality, evidence, intake)
'use strict';

const CITATIONS = [
  'AAMC_Documentation_2018',
  'WHO_Documentation_2019',
  'AHO_Custody_2019',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function note_quality(req) {
  ensureNumber(req.case_id_mentioned, 'case_id_mentioned');
  ensureNumber(req.timestamp_utc_present, 'timestamp_utc_present');
  ensureNumber(req.signature_present, 'signature_present');
  ensureNumber(req.supervisor_review, 'supervisor_review');
  ensureNumber(req.typos, 'typos');
  ensureBool(req.ombuds_pii_removed, 'ombuds_pii_removed');
  ensureNumber(req.length_chars, 'length_chars');

  let quality;
  if (req.case_id_mentioned && req.timestamp_utc_present && req.signature_present && req.typos <= 1 && req.ombuds_pii_removed && req.length_chars > 50) quality = 'high_quality_documentation_passed_litigation_audit';
  else if (req.case_id_mentioned && req.signature_present && req.timestamp_utc_present) quality = 'standard_pass_then_corrections_for_supervisory_review';
  else if (req.signature_present || req.timestamp_utc_present) quality = 'note_present_signature_or_timestamp_then_follow_procedures';
  else quality = 're_documentation_required';

  return { quality };
}

function evidence_log(req) {
  ensureNumber(req.item_count, 'item_count');
  ensureNumber(req.photo_count, 'photo_count');
  ensureBool(req.storage_conditions, 'storage_conditions');
  ensureNumber(req.days_since_event, 'days_since_event');
  ensureNumber(req.chain_of_custody_documents, 'chain_of_custody_documents');

  let integrity;
  if (req.storage_conditions && req.chain_of_custody_documents >= 2 && req.item_count > 0) integrity = 'high_quality_chain_unbroken_then_witness_signature_needed_per_jurisdiction';
  else if (req.storage_conditions && req.chain_of_custody_documents >= 1) integrity = 'adequate_continue_chaining_with_photo_count_then_storage_audit';
  else if (req.days_since_event <= 7 && req.photo_count >= 2) integrity = 'newly_collected_then_complete_chain_audit_within_24h';
  else integrity = 'need_complete_chain_audit_or_re_collect_per_jurisdiction';
  return { integrity };
}

function intake(req) {
  ensureNumber(req.mrn_or_pii_present, 'mrn_or_pii_present'); // 0 false, 1 true
  ensureBool(req.consent_received_for_treatment, 'consent_received_for_treatment');
  ensureBool(req.specimen_paperwork_complete, 'specimen_paperwork_complete');
  ensureBool(req.chain_paperwork_ready, 'chain_paperwork_ready');
  ensureNumber(req.public_safety_liaison, 'public_safety_liaison');

  let readiness;
  if (req.consent_received_for_treatment && req.specimen_paperwork_complete && req.chain_paperwork_ready && req.mrn_or_pii_present) readiness = 'all_intake_ready_then_start_specimen_collection';
  else if (req.consent_received_for_treatment && req.specimen_paperwork_complete) readiness = 'consent_and_specimen_paperwork_complete_chain_to_follow';
  else if (req.consent_received_for_treatment) readiness = 'consent_received_chain_to_follow_with_minimum_specimen';
  else readiness = 'wait_for_consent_with_other_paperwork_then_admit';

  return { readiness };
}

function chain(req) {
  ensureBool(req.tracking_registered, 'tracking_registered');
  ensureBool(req.signature_per_step, 'signature_per_step');
  ensureNumber(req.transfer_count, 'transfer_count');
  ensureNumber(req.days_in_storage, 'days_in_storage');
  ensureBool(req.storage_location_correct, 'storage_location_correct');

  let decision;
  if (!req.tracking_registered) decision = 'register_tracking_immediately_then_re_chain_audit';
  else if (req.transfer_count > 4 && !req.signature_per_step) decision = 're_collect_signatures_at_each_step_to_comply_with_chain';
  else if (req.days_in_storage > 30 && req.storage_location_correct) decision = 'continue_with_storage_or_dispatch_to_forensic_lab_within_2_weeks';
  else if (req.storage_location_correct) decision = 'continue_chaining_then_release_to_forensic_lab_at_optimal_timepoint';
  else decision = 'move_specimens_to_correct_storage_then_complete_chaining';

  return { decision };
}

function release(req) {
  ensureStr(req.specimen_id, 'specimen_id');
  ensureNumber(req.signatures_present, 'signatures_present');
  ensureBool(req.patient_consent_renewable, 'patient_consent_renewable');
  ensureBool(req.receiving_lab_documented, 'receiving_lab_documented');
  ensureBool(req.transport_temperature_monitored, 'transport_temperature_monitored');

  let release_status;
  if (req.signatures_present >= 2 && req.receiving_lab_documented && req.transport_temperature_monitored) release_status = 'specimen_released_with_complete_chain_audit';
  else if (req.signatures_present >= 1 && req.receiving_lab_documented) release_status = 'specimen_released_basic_chain_completed';
  else if (req.patient_consent_renewable) release_status = 'renew_consent_then_resume_release';
  else release_status = 'specimen_held_quarantine_chain_audit_to_complete';

  return { release_status };
}

function funcs() { return { note_quality, evidence_log, intake, chain, release }; }
module.exports = { funcs, CITATIONS, ValidationError };
