// filepath: tier13_integ_ext_104_webhook_engine.js
// TIER13_INTEG_EXT-104: REST webhooks (event publisher + receiver + idempotency)
'use strict';

const CITATIONS = ['REST_HOOK_2024', 'WEBHOOK_SECURITY_2024', 'NIST_API_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function webhook_publish(req) {
  ensureStr(req.event_id, 'event_id');
  ensureEnum(req.event_type, 'event_type', ['patient.created','patient.updated','patient.merged','encounter.started','encounter.finished','observation.created','medication.prescribed','lab.resulted','appointment.scheduled','appointment.cancelled','document.signed','message.sent','other']);
  ensureEnum(req.url, 'url', ['https','http','internal','none']);
  ensureStr(req.secret_hash, 'secret_hash');
  ensureNumber(req.payload_size_bytes, 'payload_size_bytes');
  ensureBool(req.idempotency_key_set, 'idempotency_key_set');

  let pub_status;
  if (req.url === 'http') pub_status = 'unencrypted_http_rejected';
  else if (req.url === 'none') pub_status = 'no_endpoint_publish_skipped';
  else if (req.payload_size_bytes > 1000000) pub_status = 'payload_too_large_split_or_chunk';
  else if (!req.idempotency_key_set) pub_status = 'idempotency_key_required';
  else if (!req.secret_hash) pub_status = 'secret_hash_required_for_signing';
  else pub_status = 'published_awaiting_ack';
  return { pub_status, event: req.event_type };
}

function webhook_receive(req) {
  ensureStr(req.request_id, 'request_id');
  ensureEnum(req.http_method, 'http_method', ['POST','PUT','PATCH','DELETE','GET','HEAD','OPTIONS','other']);
  ensureStr(req.signature_header, 'signature_header');
  ensureBool(req.signature_valid, 'signature_valid');
  ensureBool(req.idempotency_key_seen_before, 'idempotency_key_seen_before');
  ensureNumber(req.timestamp_age_seconds, 'timestamp_age_seconds');

  let recv_status;
  if (req.http_method !== 'POST' && req.http_method !== 'PUT') recv_status = 'method_not_allowed_use_post_or_put';
  else if (!req.signature_valid) recv_status = 'signature_invalid_blocking';
  else if (req.timestamp_age_seconds > 300) recv_status = 'timestamp_too_old_replay_attack_protect';
  else if (req.idempotency_key_seen_before) recv_status = 'duplicate_request_no_op';
  else recv_status = 'received_and_processed';
  return { recv_status, method: req.http_method };
}

function webhook_retry(req) {
  ensureStr(req.delivery_id, 'delivery_id');
  ensureNumber(req.attempt_number, 'attempt_number');
  ensureNumber(req.max_attempts, 'max_attempts');
  ensureEnum(req.failure_reason, 'failure_reason', ['timeout','connection_error','500_error','502_error','503_error','504_error','429_rate_limit','403_auth','404_not_found','410_gone','other']);
  ensureNumber(req.next_delay_seconds, 'next_delay_seconds');
  ensureEnum(req.retry_strategy, 'retry_strategy', ['exponential_backoff','linear_backoff','fixed_delay','no_retry','other']);

  let retry_status;
  if (req.attempt_number >= req.max_attempts) retry_status = 'max_attempts_reached_give_up';
  else if (req.failure_reason === '404_not_found') retry_status = '404_not_retryable';
  else if (req.failure_reason === '403_auth') retry_status = 'auth_failure_review_credentials_not_retry';
  else if (req.failure_reason === '429_rate_limit' && req.retry_strategy === 'fixed_delay') retry_status = 'rate_limit_use_exponential_backoff';
  else if (req.attempt_number === 0) retry_status = 'first_attempt_pending';
  else retry_status = 'retry_scheduled';
  return { retry_status, attempt: req.attempt_number };
}

function webhook_signature(req) {
  ensureStr(req.payload, 'payload');
  ensureEnum(req.algorithm, 'algorithm', ['HMAC_SHA256','HMAC_SHA512','RSA_SHA256','ECDSA_P256','RSA_SHA512','SHA256_only','none','other']);
  ensureStr(req.signature, 'signature');
  ensureStr(req.timestamp_header, 'timestamp_header');
  ensureNumber(req.tolerance_seconds, 'tolerance_seconds');
  ensureBool(req.replay_attack_protected, 'replay_attack_protected');

  let sig_status;
  if (req.algorithm === 'none') sig_status = 'no_signature_algorithm_insufficient';
  else if (req.algorithm === 'SHA256_only') sig_status = 'sha256_hash_is_not_a_signature_use_hmac';
  else if (req.tolerance_seconds > 600) sig_status = 'tolerance_too_high_replay_window';
  else if (!req.replay_attack_protected) sig_status = 'replay_protection_required';
  else sig_status = 'signature_valid';
  return { sig_status, algorithm: req.algorithm };
}

function webhook_subscription(req) {
  ensureStr(req.subscription_id, 'subscription_id');
  ensureEnum(req.event_filter, 'event_filter', ['wildcard','exact','prefix','regex','none','other']);
  ensureNumber(req.events_subscribed, 'events_subscribed');
  ensureBoolStr(req.has_secret, 'has_secret');
  ensureEnum(req.delivery_mode, 'delivery_mode', ['push','pull','queue','none','other']);
  ensureNumber(req.days_active, 'days_active');

  let sub_status;
  if (req.delivery_mode === 'none') sub_status = 'subscription_inactive';
  else if (!req.has_secret) sub_status = 'secret_required_for_signing';
  else if (req.event_filter === 'wildcard' && req.events_subscribed > 20) sub_status = 'wildcard_too_broad_review';
  else if (req.days_active > 365 && req.event_filter === 'wildcard') sub_status = 'long_lived_wildcard_renewal_review';
  else sub_status = 'subscription_active';
  return { sub_status, filter: req.event_filter };
}

function ensureBoolStr(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function funcs() { return { webhook_publish, webhook_receive, webhook_retry, webhook_signature, webhook_subscription }; }
module.exports = { funcs, CITATIONS, ValidationError };