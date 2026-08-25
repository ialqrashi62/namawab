// filepath: tier13_integ_ext_106_monitoring_engine.js
// TIER13_INTEG_EXT-106: Integration monitoring, SLA & circuit breaker
'use strict';

const CITATIONS = ['NIST_API_2024', 'OBSERVABILITY_2024', 'CIRCUIT_BREAKER_2024', 'ISO_27001_2022'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function integ_health_check(req) {
  ensureStr(req.endpoint_id, 'endpoint_id');
  ensureEnum(req.health_method, 'health_method', ['ping','deep_check','heartbeat','synthetic_transaction','read_test','none','other']);
  ensureBool(req.reachable, 'reachable');
  ensureNumber(req.response_time_ms, 'response_time_ms');
  ensureNumber(req.timeout_threshold_ms, 'timeout_threshold_ms');
  ensureBool(req.authenticated, 'authenticated');

  let health_status;
  if (!req.reachable) health_status = 'endpoint_unreachable_investigate';
  else if (req.response_time_ms > req.timeout_threshold_ms) health_status = 'response_above_threshold_degraded';
  else if (!req.authenticated) health_status = 'reachable_not_authenticated_check_creds';
  else if (req.health_method === 'none') health_status = 'no_health_method_configured';
  else health_status = 'healthy';
  return { health_status, response_time: req.response_time_ms };
}

function integ_sla_track(req) {
  ensureStr(req.endpoint_id, 'endpoint_id');
  ensureNumber(req.uptime_pct_30d, 'uptime_pct_30d');
  ensureNumber(req.uptime_sla_pct, 'uptime_sla_pct');
  ensureNumber(req.p95_latency_ms, 'p95_latency_ms');
  ensureNumber(req.latency_sla_ms, 'latency_sla_ms');
  ensureEnum(req.period, 'period', ['last_24h','last_7d','last_30d','last_90d','last_year']);

  let sla_status;
  if (req.uptime_pct_30d < req.uptime_sla_pct) sla_status = 'uptime_below_sla_remediation';
  else if (req.p95_latency_ms > req.latency_sla_ms) sla_status = 'p95_latency_above_sla';
  else if (req.uptime_pct_30d >= 99.9) sla_status = 'three_nines_plus_excellent';
  else if (req.uptime_pct_30d >= 99.5) sla_status = 'two_nines_meeting_sla';
  else sla_status = 'approaching_sla_threshold';
  return { sla_status, uptime: req.uptime_pct_30d };
}

function integ_circuit_breaker(req) {
  ensureStr(req.breaker_id, 'breaker_id');
  ensureEnum(req.state, 'state', ['closed','open','half_open','disabled','forced_open','forced_closed']);
  ensureNumber(req.failure_count, 'failure_count');
  ensureNumber(req.failure_threshold, 'failure_threshold');
  ensureNumber(req.recovery_timeout_seconds, 'recovery_timeout_seconds');
  ensureNumber(req.consecutive_failures, 'consecutive_failures');

  let breaker_status;
  if (req.state === 'forced_open') breaker_status = 'manual_forced_open_investigate';
  else if (req.state === 'open' && req.consecutive_failures >= req.failure_threshold) breaker_status = 'breaker_tripped_auto_open';
  else if (req.state === 'half_open') breaker_status = 'half_open_testing_recovery';
  else if (req.state === 'closed' && req.failure_count >= req.failure_threshold * 0.8) breaker_status = 'approaching_threshold_increase_monitoring';
  else if (req.state === 'closed') breaker_status = 'breaker_closed_healthy';
  else breaker_status = 'breaker_state_' + req.state;
  return { breaker_status, state: req.state };
}

function integ_alert(req) {
  ensureStr(req.alert_id, 'alert_id');
  ensureEnum(req.severity, 'severity', ['info','warning','error','critical','page','none','other']);
  ensureEnum(req.alert_type, 'alert_type', ['endpoint_down','high_error_rate','high_latency','sla_breach','auth_failure','rate_limit','queue_backlog','circuit_open','data_validation','timeout','none','other']);
  ensureEnum(req.notification_channel, 'notification_channel', ['email','sms','pagerduty','slack','webhook','sms_pager','ops_genie','none','other']);
  ensureNumber(req.minutes_to_resolve, 'minutes_to_resolve');
  ensureEnum(req.resolution_status, 'resolution_status', ['unresolved','investigating','mitigating','resolved','deferred','false_positive','other']);

  let alert_status;
  if (req.severity === 'page' && req.notification_channel === 'none') alert_status = 'page_severity_requires_notification_channel';
  else if (req.resolution_status === 'unresolved' && req.minutes_to_resolve > 60) alert_status = 'long_unresolved_escalate';
  else if (req.severity === 'info') alert_status = 'info_logged_no_action';
  else if (req.resolution_status === 'resolved') alert_status = 'resolved_archived';
  else alert_status = 'alert_active';
  return { alert_status, severity: req.severity };
}

function integ_dead_letter(req) {
  ensureStr(req.dlq_id, 'dlq_id');
  ensureNumber(req.messages_in_dlq, 'messages_in_dlq');
  ensureNumber(req.messages_resolved_24h, 'messages_resolved_24h');
  ensureNumber(req.days_oldest_message, 'days_oldest_message');
  ensureEnum(req.failure_reason, 'failure_reason', ['validation_error','transformation_error','destination_unreachable','auth_failure','timeout','rate_limit','payload_too_large','unknown','other']);
  ensureBool(req.replay_attempted, 'replay_attempted');

  let dlq_status;
  if (req.messages_in_dlq === 0) dlq_status = 'dlq_empty';
  else if (req.days_oldest_message > 30) dlq_status = 'stale_messages_over_30d_review';
  else if (req.replay_attempted && req.messages_resolved_24h === 0) dlq_status = 'replay_attempted_no_resolution_review_root_cause';
  else if (req.messages_in_dlq > 100) dlq_status = 'large_dlq_backlog_review';
  else dlq_status = 'dlq_active';
  return { dlq_status, count: req.messages_in_dlq };
}

function funcs() { return { integ_health_check, integ_sla_track, integ_circuit_breaker, integ_alert, integ_dead_letter }; }
module.exports = { funcs, CITATIONS, ValidationError };