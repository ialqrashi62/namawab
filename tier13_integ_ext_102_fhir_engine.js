// filepath: tier13_integ_ext_102_fhir_engine.js
// TIER13_INTEG_EXT-102: FHIR client operations (CRUD + SMART auth)
'use strict';

const CITATIONS = ['HL7_FHIR_R4_2024', 'SMART_LAUNCH_2024', 'OAuth2_FHIR_2024', 'Bulk_Data_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function fhir_search(req) {
  ensureStr(req.base_url, 'base_url');
  ensureEnum(req.resource_type, 'resource_type', ['Patient','Encounter','Observation','MedicationRequest','Condition','Procedure','AllergyIntolerance','DiagnosticReport','CarePlan','Practitioner','Organization','Coverage','Claim','ExplanationOfBenefit','other']);
  ensureNumber(req.search_params_count, 'search_params_count');
  ensureNumber(req.results_count, 'results_count');
  ensureEnum(req.search_mode, 'search_mode', ['normal','include','revinclude','summary_data','summary_count','summary_text','whole_system']);
  ensureEnum(req.http_status, 'http_status', ['200','201','204','301','302','400','401','403','404','409','410','422','500','503','timeout','connection_error']);

  let search_status;
  if (req.http_status === '401' || req.http_status === '403') search_status = 'auth_failure_refresh_token_retry';
  else if (req.http_status === '422') search_status = 'validation_failure_review_params';
  else if (req.http_status === '404') search_status = 'resource_not_found_review_base_url';
  else if (req.http_status === '503' || req.http_status === 'timeout') search_status = 'server_unavailable_retry';
  else if (req.search_mode === 'whole_system' && req.search_params_count === 0) search_status = 'whole_system_search_no_params_slow';
  else search_status = 'search_complete';
  return { search_status, results: req.results_count };
}

function fhir_read(req) {
  ensureStr(req.resource_id, 'resource_id');
  ensureEnum(req.resource_type, 'resource_type', ['Patient','Encounter','Observation','MedicationRequest','Condition','Procedure','AllergyIntolerance','DiagnosticReport','CarePlan','Practitioner','Organization','Coverage','Claim','ExplanationOfBenefit','other']);
  ensureEnum(req.if_match_version, 'if_match_version', ['no_version','exact_match','wildcard','stale','none','unknown','other']);
  ensureBool(req.found, 'found');
  ensureBool(req.content_type_correct, 'content_type_correct');
  ensureNumber(req.body_size_bytes, 'body_size_bytes');

  let read_status;
  if (!req.found) read_status = 'resource_not_found';
  else if (!req.content_type_correct) read_status = 'wrong_content_type_for_fhir';
  else if (req.if_match_version === 'exact_match' && req.body_size_bytes > 1000000) read_status = 'oversized_response_use_summary_or_summary_data';
  else read_status = 'read_complete';
  return { read_status, resource_id: req.resource_id };
}

function fhir_create(req) {
  ensureStr(req.resource_body, 'resource_body');
  ensureEnum(req.resource_type, 'resource_type', ['Patient','Encounter','Observation','MedicationRequest','Condition','Procedure','AllergyIntolerance','DiagnosticReport','CarePlan','Practitioner','Organization','other']);
  ensureBool(req.full_url_provided, 'full_url_provided');
  ensureEnum(req.if_none_exist, 'if_none_exist', ['not_provided','identifier_match','provided_check','none','other']);
  ensureNumber(req.validation_errors_count, 'validation_errors_count');
  ensureBool(req.server_processed, 'server_processed');

  let create_status;
  if (req.validation_errors_count > 0) create_status = 'validation_errors_' + req.validation_errors_count + '_review';
  else if (!req.full_url_provided) create_status = 'full_url_required_for_create';
  else if (!req.server_processed) create_status = 'server_not_processed_retry';
  else create_status = 'created';
  return { create_status, resource_type: req.resource_type };
}

function fhir_oauth(req) {
  ensureStr(req.auth_request_id, 'auth_request_id');
  ensureEnum(req.grant_type, 'grant_type', ['authorization_code','client_credentials','refresh_token','password','urn:ietf:params:oauth:grant-type:jwt-bearer','smart_backend_services','token_exchange','other']);
  ensureStr(req.client_id, 'client_id');
  ensureBool(req.pkce_used, 'pkce_used');
  ensureEnum(req.context_type, 'context_type', ['patient','encounter','user','system','device','none','other']);
  ensureNumber(req.scopes_requested, 'scope_requested');

  let oauth_status;
  if (req.grant_type === 'password') oauth_status = 'password_grant_deprecated_use_pkce';
  else if (req.context_type === 'patient' && req.scopes_requested > 5) oauth_status = 'patient_scope_too_broad_review';
  else if (!req.pkce_used && req.grant_type === 'authorization_code') oauth_status = 'pkce_required_for_authorization_code';
  else oauth_status = 'oauth_eligible';
  return { oauth_status, grant: req.grant_type };
}

function fhir_subscription(req) {
  ensureStr(req.subscription_id, 'subscription_id');
  ensureEnum(req.criteria_resource, 'criteria_resource', ['Patient','Encounter','Observation','MedicationRequest','Condition','Procedure','AllergyIntolerance','DiagnosticReport','AuditEvent','other']);
  ensureEnum(req.channel_type, 'channel_type', ['rest_hook','websocket','email','sms','message','none','other']);
  ensureStr(req.endpoint, 'endpoint');
  ensureBool(req.handshake_confirmed, 'handshake_confirmed');
  ensureNumber(req.events_per_day, 'events_per_day');

  let sub_status;
  if (!req.handshake_confirmed && req.channel_type === 'rest_hook') sub_status = 'rest_hook_handshake_required';
  else if (req.events_per_day > 10000) sub_status = 'high_volume_consider_batch_export';
  else if (req.channel_type === 'none') sub_status = 'no_channel_subscription_inactive';
  else sub_status = 'subscription_active';
  return { sub_status, channel: req.channel_type, events: req.events_per_day };
}

function funcs() { return { fhir_search, fhir_read, fhir_create, fhir_oauth, fhir_subscription }; }
module.exports = { funcs, CITATIONS, ValidationError };