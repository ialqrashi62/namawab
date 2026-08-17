// filepath: tier19_him_ext_131_release_engine.js
// TIER19_HIM_EXT-131: Document release, completeness, attestation
'use strict';

const CITATIONS = ['AHIMA_DOC_2024','ONC_DOC_REQ_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function doc_release(req) {
  ensureStr(req.doc_id, 'doc_id');
  ensureEnum(req.doc_type, 'doc_type', ['discharge_summary','operative_note','consultation','history_physical','progress_note','lab_result','imaging_report','pathology','medication_list','allergy_list','problem_list','other']);
  ensureEnum(req.release_status, 'release_status', ['draft','signed_pending_release','released_to_portal','released_to_external','locked','amended','corrected','pending_cosign','other']);
  ensureBool(req.signed, 'signed');
  ensureNumber(req.days_since_created, 'days_since_created');

  let status;
  if (req.doc_type === 'discharge_summary' && req.days_since_created > 30 && !req.signed) status = 'discharge_summary_over_30d_unsigned_jcaho';
  else if (!req.signed && req.release_status === 'released_to_portal') status = 'unsigned_document_release_blocking';
  else if (req.release_status === 'draft') status = 'draft_pending_completion';
  else status = 'document_released';
  return { status, doc: req.doc_id };
}

function doc_completeness(req) {
  ensureStr(req.chart_id, 'chart_id');
  ensureNumber(req.required_docs_count, 'required_docs_count');
  ensureNumber(req.completed_docs_count, 'completed_docs_count');
  ensureNumber(req.missing_docs_count, 'missing_docs_count');
  ensureBool(req.all_signed, 'all_signed');
  ensureBool(req.all_attested, 'all_attested');
  ensureEnum(req.discharge_disposition, 'discharge_disposition', ['home','snf','rehab','hospice','transfer','ama','expired','still_inpatient','other']);

  let status;
  if (req.missing_docs_count > 0) status = 'missing_documents_blocking_discharge';
  else if (!req.all_signed) status = 'unsigned_documents_review';
  else if (!req.all_attested) status = 'unattested_documents_review';
  else status = 'chart_complete';
  return { status, missing: req.missing_docs_count };
}

function doc_amendment(req) {
  ensureStr(req.amendment_id, 'amendment_id');
  ensureStr(req.original_doc_id, 'original_doc_id');
  ensureBool(req.addendum_attached, 'addendum_attached');
  ensureEnum(req.amendment_reason, 'amendment_reason', ['additional_info','correction','clarification','late_entry','patient_request','legal','other']);
  ensureBool(req.timed_correctly, 'timed_correctly');
  ensureBool(req.signed_correctly, 'signed_correctly');
  ensureBool(req.original_preserved, 'original_preserved');

  let status;
  if (!req.original_preserved) status = 'original_preservation_required_no_overwrite';
  else if (!req.timed_correctly) status = 'amendment_timing_required';
  else if (!req.addendum_attached) status = 'amendment_requires_addendum_or_late_entry';
  else if (!req.signed_correctly) status = 'amendment_signature_required';
  else status = 'amendment_documented';
  return { status, reason: req.amendment_reason };
}

function doc_cosign(req) {
  ensureStr(req.doc_id, 'doc_id');
  ensureEnum(req.cosign_required_by, 'cosign_required_by', ['attending','consultant','chief','department_chair','medical_director','none','other']);
  ensureBool(req.cosign_received, 'cosign_received');
  ensureNumber(req.days_since_drafted, 'days_since_drafted');
  ensureBool(req.attending_provider_active, 'attending_active');
  ensureBool(req.cosign_overdue, 'cosign_overdue');

  let status;
  if (req.cosign_required_by === 'none') status = 'no_cosign_required';
  else if (req.cosign_overdue && req.days_since_drafted > 30) status = 'cosign_over_30d_overdue_review';
  else if (!req.attending_provider_active && req.cosign_required_by === 'attending') status = 'attending_inactive_choose_alternative';
  else if (!req.cosign_received && req.days_since_drafted > 14) status = 'cosign_pending_over_14d_follow_up';
  else status = 'cosign_documented';
  return { status, by: req.cosign_required_by };
}

function doc_audit(req) {
  ensureStr(req.doc_id, 'doc_id');
  ensureBool(req.timed_correctly, 'timed');
  ensureBool(req.authenticated, 'authenticated');
  ensureBool(req.dictated_when_signed, 'dictated_when_signed');
  ensureBool(req.signed_within_required_window, 'signed_within_window');
  ensureEnum(req.window_hours, 'window_hours', ['24h','48h','72h','one_week','two_weeks','one_month','no_window','other']);
  ensureNumber(req.lag_hours, 'lag_hours');

  let status;
  if (!req.timed_correctly) status = 'timing_documentation_required';
  else if (!req.authenticated) status = 'authentication_required';
  else if (req.window_hours !== 'no_window' && !req.signed_within_required_window) status = 'signed_outside_window_review';
  else if (req.dictated_when_signed && req.lag_hours > 24) status = 'dictation_lag_over_24h_review';
  else status = 'doc_audit_compliant';
  return { status, lag: req.lag_hours };
}

function funcs() { return { doc_release, doc_completeness, doc_amendment, doc_cosign, doc_audit }; }
module.exports = { funcs, CITATIONS, ValidationError };