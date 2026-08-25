// filepath: tier13_integ_ext_103_mirth_engine.js
// TIER13_INTEG_EXT-103: Mirth Connect channel & transformation engine
'use strict';

const CITATIONS = ['MIRTH_4_5_2024', 'IHE_ATNA_2024', 'HL7_CONNECTATHON_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function mirth_channel_config(req) {
  ensureStr(req.channel_id, 'channel_id');
  ensureStr(req.channel_name, 'channel_name');
  ensureEnum(req.source_type, 'source_type', ['MLLP','TCP','HTTP','FILE','FTP','SFTP','SMTP','JMS','DATABASE','WEBSERVICE','JDBC','NONE','other']);
  ensureEnum(req.destination_type, 'destination_type', ['MLLP','TCP','HTTP','FILE','FTP','SFTP','HL7_FTP','SMTP','JMS','DATABASE','WEBSERVICE','JDBC','NONE','other']);
  ensureBool(req.encrypted, 'encrypted');
  ensureBool(req.queue_enabled, 'queue_enabled');

  let channel_status;
  if (req.source_type === 'NONE' && req.destination_type === 'NONE') channel_status = 'channel_inactive_no_endpoints';
  else if (req.source_type === req.destination_type && req.source_type === 'MLLP' && !req.encrypted) channel_status = 'mllp_unencrypted_tls_required';
  else if (!req.queue_enabled && req.source_type === 'DATABASE') channel_status = 'database_source_requires_queue';
  else channel_status = 'channel_configured';
  return { channel_status, channel: req.channel_name };
}

function mirth_transform(req) {
  ensureStr(req.transform_id, 'transform_id');
  ensureEnum(req.transform_type, 'transform_type', ['javascript','java_jar','mapper','xsl','jsonata','groovy','python','mapping','none','other']);
  ensureStr(req.input_type, 'input_type');
  ensureStr(req.output_type, 'output_type');
  ensureNumber(req.fields_mapped, 'fields_mapped');
  ensureNumber(req.fields_total, 'fields_total');
  ensureBool(req.test_executed, 'test_executed');

  let transform_status;
  if (!req.test_executed) transform_status = 'transform_not_tested_run_test';
  else if (req.fields_mapped < req.fields_total) transform_status = 'partial_mapping_' + (req.fields_total - req.fields_mapped) + '_unmapped';
  else if (req.input_type === req.output_type && req.transform_type === 'none') transform_status = 'identity_no_transform_needed';
  else transform_status = 'transform_complete';
  return { transform_status, transform_type: req.transform_type };
}

function mirth_filter(req) {
  ensureStr(req.filter_id, 'filter_id');
  ensureEnum(req.filter_type, 'filter_type', ['javascript','java','xpath','jsonpath','sql','regex','none','other']);
  ensureStr(req.criteria, 'criteria');
  ensureNumber(req.messages_in, 'messages_in');
  ensureNumber(req.messages_passed, 'messages_passed');
  ensureNumber(req.messages_failed, 'messages_failed');

  let filter_status;
  const pass_rate = req.messages_in > 0 ? req.messages_passed / req.messages_in : 0;
  const fail_rate = req.messages_in > 0 ? req.messages_failed / req.messages_in : 0;
  if (fail_rate > 0.2) filter_status = 'high_failure_review_logic';
  else if (pass_rate >= 0.9) filter_status = 'filter_permissive';
  else if (pass_rate <= 0.1) filter_status = 'filter_too_strict';
  else filter_status = 'filter_balanced';
  return { filter_status, pass_rate: Math.round(pass_rate * 1000) / 10 };
}

function mirth_destinations(req) {
  ensureStr(req.channel_id, 'channel_id');
  ensureNumber(req.destinations_count, 'destinations_count');
  ensureEnum(req.delivery_mode, 'delivery_mode', ['DESTINATION_DISPATCH','SEND_ONCE','SEND_ON_PROCESSED_COMPLETED','SEND_ON_PROCESSED_RESPONSE','SOURCE_DESTINATION_FILTER_TRANSFORMER']);
  ensureBool(req.all_destinations_acknowledged, 'all_destinations_acknowledged');
  ensureNumber(req.failed_destinations, 'failed_destinations');

  let dest_status;
  if (req.destinations_count === 0) dest_status = 'no_destinations_configured';
  else if (req.failed_destinations >= req.destinations_count) dest_status = 'all_destinations_failed_blocking';
  else if (req.failed_destinations > 0) dest_status = 'partial_failure_retry';
  else if (!req.all_destinations_acknowledged) dest_status = 'awaiting_ack';
  else dest_status = 'all_destinations_succeeded';
  return { dest_status, mode: req.delivery_mode };
}

function mirth_deploy(req) {
  ensureStr(req.channel_id, 'channel_id');
  ensureEnum(req.status, 'status', ['UNDEPLOYED','STARTING','STARTED','PAUSED','STOPPING','STOPPED','ERROR','CONFIGURED','DEPLOYING','UNDEPLOYING','OTHER']);
  ensureBool(req.recently_deployed, 'recently_deployed');
  ensureBool(req.test_connection_pass, 'test_connection_pass');
  ensureNumber(req.error_count_24h, 'error_count_24h');

  let deploy_status;
  if (req.status === 'ERROR' && req.error_count_24h > 50) deploy_status = 'excessive_errors_investigate';
  else if (req.recently_deployed && !req.test_connection_pass) deploy_status = 'recently_deployed_failed_test';
  else if (req.status === 'STARTED') deploy_status = 'deployed_running';
  else if (req.status === 'UNDEPLOYED') deploy_status = 'undeployed_inactive';
  else deploy_status = 'deployment_status_' + req.status.toLowerCase();
  return { deploy_status, status: req.status };
}

function funcs() { return { mirth_channel_config, mirth_transform, mirth_filter, mirth_destinations, mirth_deploy }; }
module.exports = { funcs, CITATIONS, ValidationError };