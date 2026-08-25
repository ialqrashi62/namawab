// filepath: tier13_integ_ext_101_hl7v2_engine.js
// TIER13_INTEG_EXT-101: HL7 v2 message processing
'use strict';

const CITATIONS = ['HL7_V2_5_2024', 'HL7_V2_8_2024', 'IHE_PIX_2024', 'NIST_HL7_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hl7_parse(req) {
  ensureStr(req.message_id, 'message_id');
  ensureStr(req.raw_message, 'raw_message');
  ensureEnum(req.message_type, 'message_type', ['ADT_A01','ADT_A04','ADT_A08','ADT_A03','ORM_O01','ORU_R01','SIU_S12','SIU_S14','MDM_T02','DFT_P03','BAR_P01','VXU_V04','PPR_PC1','OMG_O19','OML_O21','other']);
  ensureNumber(req.segment_count, 'segment_count');
  ensureEnum(req.version, 'version', ['2.3','2.4','2.5','2.5.1','2.6','2.7','2.8','unknown']);
  ensureNumber(req.msh_parsed_ok, 'msh_parsed_ok');

  let parse_status;
  if (!req.raw_message.includes('|')) parse_status = 'invalid_no_pipe_separators';
  else if (req.msh_parsed_ok === 0) parse_status = 'msh_segment_unparseable_blocking';
  else if (!req.message_type) parse_status = 'message_type_required_in_msh_9';
  else if (req.segment_count < 2) parse_status = 'too_few_segments_min_2_required';
  else parse_status = 'parsed_ok';
  return { parse_status, type: req.message_type, version: req.version };
}

function hl7_ack(req) {
  ensureStr(req.incoming_message_id, 'incoming_message_id');
  ensureEnum(req.ack_code, 'ack_code', ['AA_application_accept','AE_application_error','AR_application_reject']);
  ensureEnum(req.processing_mode, 'processing_mode', ['always','enhanced','original','enhanced_with_nofieldsep']);
  ensureStr(req.sending_facility, 'sending_facility');
  ensureNumber(req.error_count, 'error_count');
  ensureEnum(req.message_control_id, 'message_control_id', ['valid_original','duplicate','unknown','original']);
  ensureBool(req.commit_ack_required, 'commit_ack_required');

  let ack_status;
  if (req.ack_code === 'AR') ack_status = 'reject_ack_sent';
  else if (req.ack_code === 'AE' && req.error_count === 0) ack_status = 'ae_with_no_errors_inconsistent';
  else if (req.commit_ack_required && req.ack_code !== 'AA') ack_status = 'commit_ack_required_no_commit';
  else if (req.message_control_id === 'duplicate') ack_status = 'duplicate_detected_no_reprocessing';
  else ack_status = 'accept_ack_sent';
  return { ack_status, code: req.ack_code };
}

function hl7_route(req) {
  ensureStr(req.message_id, 'message_id');
  ensureEnum(req.message_type, 'message_type', ['ADT_A01','ADT_A04','ORM_O01','ORU_R01','SIU_S12','MDM_T02','DFT_P03','other']);
  ensureStr(req.destination_system, 'destination_system');
  ensureEnum(req.transport, 'transport', ['mllp','soap','rest','file_drop','sftp','ftp','async_mq','kafka','amazon_sqs','azure_service_bus','none','other']);
  ensureBool(req.encryption_required, 'encryption_required');
  ensureBool(req.receipt_acknowledged, 'receipt_acknowledged');

  let route_status;
  if (req.encryption_required && req.transport === 'mllp' && !req.receipt_acknowledged) route_status = 'mllp_unencrypted_rejected';
  else if (req.transport === 'none') route_status = 'no_transport_route_to_default_only';
  else if (!req.receipt_acknowledged) route_status = 'no_ack_received_route_pending';
  else route_status = 'routed';
  return { route_status, destination: req.destination_system, transport: req.transport };
}

function hl7_validate_segment(req) {
  ensureStr(req.segment_id, 'segment_id');
  ensureStr(req.segment_name, 'segment_name');
  ensureEnum(req.segment_name, 'segment_name', ['MSH','EVN','PID','PV1','OBX','OBR','ORC','RXA','RXE','NK1','AL1','DG1','PR1','IN1','GT1','PD1','PID.3','PID.5','PID.7','PID.8','other']);
  ensureNumber(req.fields_expected, 'fields_expected');
  ensureNumber(req.fields_present, 'fields_present');
  ensureBool(req.data_types_valid, 'data_types_valid');

  let seg_status;
  if (req.fields_present < req.fields_expected) seg_status = 'missing_fields_' + (req.fields_expected - req.fields_present);
  else if (!req.data_types_valid) seg_status = 'invalid_data_types';
  else if (req.segment_name === 'MSH' && req.segment_name !== 'MSH') seg_status = 'msh_validation_failed';
  else seg_status = 'segment_valid';
  return { seg_status, segment: req.segment_name };
}

function hl7_duplicate_check(req) {
  ensureStr(req.message_id, 'message_id');
  ensureStr(req.message_control_id, 'message_control_id');
  ensureStr(req.sending_application, 'sending_application');
  ensureNumber(req.days_lookback, 'days_lookback');
  ensureBool(req.already_processed, 'already_processed');

  let dup_status;
  if (req.already_processed) dup_status = 'duplicate_detected_skip_reprocessing';
  else if (req.days_lookback < 1) dup_status = 'lookback_too_short_min_1_day';
  else if (!req.sending_application || !req.message_control_id) dup_status = 'insufficient_info_to_check_duplicate';
  else dup_status = 'no_duplicate_detected';
  return { dup_status, message_control_id: req.message_control_id };
}

function funcs() { return { hl7_parse, hl7_ack, hl7_route, hl7_validate_segment, hl7_duplicate_check }; }
module.exports = { funcs, CITATIONS, ValidationError };