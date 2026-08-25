// filepath: tier13_integ_ext_105_dicom_engine.js
// TIER13_INTEG_EXT-105: DICOM imaging integration
'use strict';

const CITATIONS = ['DICOM_2024', 'IHE_RAD_2024', 'IHE_KIN_2024', 'DICOM_SR_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dicom_c_store(req) {
  ensureStr(req.sop_instance_uid, 'sop_instance_uid');
  ensureStr(req.sop_class_uid, 'sop_class_uid');
  ensureStr(req.transfer_syntax, 'transfer_syntax');
  ensureEnum(req.modality, 'modality', ['CT','MR','XR','DX','CR','US','NM','PT','MR_SPECT','XA','MG','DOC','SR','RTIMAGE','RTDOSE','RTPLAN','RTSTRUCT','ECG','EEG','OTHER']);
  ensureNumber(req.file_size_mb, 'file_size_mb');
  ensureBool(req.transfer_complete, 'transfer_complete');

  let cstore_status;
  if (!req.transfer_complete) cstore_status = 'transfer_incomplete';
  else if (req.sop_class_uid === '') cstore_status = 'sop_class_uid_required';
  else if (req.file_size_mb > 500) cstore_status = 'large_file_split_or_compress';
  else if (req.transfer_syntax !== '1.2.840.10008.1.2.1' && req.transfer_syntax !== '1.2.840.10008.1.2') cstore_status = 'unusual_transfer_syntax_review';
  else cstore_status = 'stored';
  return { cstore_status, sop: req.sop_instance_uid };
}

function dicom_c_find(req) {
  ensureStr(req.query_id, 'query_id');
  ensureEnum(req.query_level, 'query_level', ['PATIENT','STUDY','SERIES','IMAGE','FRAME','OTHER']);
  ensureEnum(req.modality_filter, 'modality_filter', ['all','CT','MR','XR','DX','US','NM','PT','MR_SPECT','XA','MG','DOC','SR','OTHER']);
  ensureNumber(req.results_count, 'results_count');
  ensureBool(req.exact_match_required, 'exact_match_required');
  ensureNumber(req.total_available, 'total_available');

  let find_status;
  if (req.query_level === 'FRAME' && req.results_count > 100) find_status = 'frame_level_too_many_review_pagination';
  else if (req.exact_match_required && req.results_count === 0) find_status = 'exact_match_no_results_review_criteria';
  else if (req.results_count === 0) find_status = 'no_results_no_match';
  else if (req.total_available > 10000) find_status = 'large_result_set_use_pagination';
  else find_status = 'find_complete';
  return { find_status, results: req.results_count };
}

function dicom_wado(req) {
  ensureStr(req.request_id, 'request_id');
  ensureStr(req.study_uid, 'study_uid');
  ensureStr(req.series_uid, 'series_uid');
  ensureStr(req.sop_uid, 'sop_uid');
  ensureEnum(req.transfer_syntax, 'transfer_syntax', ['1.2.840.10008.1.2.1','1.2.840.10008.1.2','1.2.840.10008.1.2.4.50','1.2.840.10008.1.2.4.90','1.2.840.10008.1.2.4.91','JPEG_LS','JPEG_2000','other']);
  ensureNumber(req.content_size_mb, 'content_size_mb');

  let wado_status;
  if (!req.study_uid || !req.series_uid || !req.sop_uid) wado_status = 'all_uids_required_study_series_sop';
  else if (req.content_size_mb > 100) wado_status = 'large_content_use_multipart_wado_rs';
  else wado_status = 'wado_retrieved';
  return { wado_status, study: req.study_uid };
}

function dicom_mwl(req) {
  ensureStr(req.mwl_id, 'mwl_id');
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.accession_number, 'accession_number');
  ensureStr(req.modality, 'modality');
  ensureNumber(req.scheduled_steps_count, 'scheduled_steps_count');
  ensureEnum(req.status, 'status', ['SCHEDULED','ARRIVED','READY','STARTED','DEPARTED','CANCELED','DISCONTINUED','COMPLETED','OTHER']);

  let mwl_status;
  if (req.status === 'CANCELED' || req.status === 'DISCONTINUED') mwl_status = 'procedure_canceled_remove_from_worklist';
  else if (req.status === 'COMPLETED') mwl_status = 'procedure_completed_archive';
  else if (req.status === 'SCHEDULED' && req.scheduled_steps_count === 0) mwl_status = 'scheduled_no_steps_review_order';
  else if (!req.accession_number) mwl_status = 'accession_number_required_for_mwl';
  else mwl_status = 'mwl_active';
  return { mwl_status, status: req.status };
}

function dicom_sr_evaluate(req) {
  ensureStr(req.sr_uid, 'sr_uid');
  ensureEnum(req.sr_template, 'sr_template', ['TID1500','TID2000','TID1501','TID1410','TID1411','TID1419','TID1420','TID1600','TID1700','TID9000','OTHER']);
  ensureNumber(req.measurements_count, 'measurements_count');
  ensureNumber(req.measurement_codes_count, 'measurement_codes_count');
  ensureNumber(req.measurement_values_count, 'measurement_values_count');
  ensureBool(req.concept_code_present, 'concept_code_present');

  let sr_status;
  if (req.measurements_count === 0) mwl_status = 'no_measurements_in_sr';
  else if (req.measurement_codes_count < req.measurements_count) sr_status = 'incomplete_coding_for_measurements';
  else if (req.measurement_values_count < req.measurements_count) sr_status = 'missing_values_for_measurements';
  else if (!req.concept_code_present) sr_status = 'concept_code_required_for_reporting';
  else sr_status = 'sr_complete';
  return { sr_status, measurements: req.measurements_count };
}

function funcs() { return { dicom_c_store, dicom_c_find, dicom_wado, dicom_mwl, dicom_sr_evaluate }; }
module.exports = { funcs, CITATIONS, ValidationError };