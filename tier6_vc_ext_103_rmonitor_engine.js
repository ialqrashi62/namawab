// filepath: tier6_vc_ext_103_rmonitor_engine.js
// TIER6_VC_EXT-103: Remote patient monitoring (RPM) — vitals ingestion, alerts, adherence, trends, escalation
'use strict';

const CITATIONS = [
  'CMS_RPM_2021',
  'AHA_RPM_2022',
  'CDC_REMOTE_MONITORING_2020',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}

function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function rpm_vitals_ingest(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device_serial, 'device_serial');
  ensureEnum(req.vital_type, 'vital_type', ['sbp','dbp','hr','spo2','glucose','weight','temp','resp_rate','peak_flow','inr']);
  ensureNumber(req.value, 'value');
  ensureStr(req.timestamp, 'timestamp');
  ensureBool(req.transmitted_via_bluetooth, 'transmitted_via_bluetooth');

  return { ingested: true, vital: req.vital_type, value: req.value, source: req.transmitted_via_bluetooth ? 'bluetooth' : 'manual_entry' };
}

function rpm_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.vital_type, 'vital_type', ['sbp','dbp','hr','spo2','glucose','weight','temp','resp_rate','peak_flow','inr']);
  ensureNumber(req.value, 'value');
  ensureNumber(req.threshold_low, 'threshold_low');
  ensureNumber(req.threshold_high, 'threshold_high');
  ensureBool(req.patient_aware, 'patient_aware');

  let severity;
  if (req.value < req.threshold_low * 0.7 || req.value > req.threshold_high * 1.3) severity = 'critical_call_911_or_care_team_now';
  else if (req.value < req.threshold_low || req.value > req.threshold_high) severity = 'out_of_range_review_within_24h';
  else severity = 'in_range_no_action';

  return { severity, vital: req.vital_type, value: req.value, patient_aware: req.patient_aware };
}

function rpm_adherence(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.measurements_expected_per_week, 'measurements_expected_per_week');
  ensureNumber(req.measurements_completed_per_week, 'measurements_completed_per_week');
  ensureNumber(req.days_since_last_sync, 'days_since_last_sync');

  const ratio = req.measurements_completed_per_week / req.measurements_expected_per_week;
  let band;
  if (req.days_since_last_sync >= 7) band = 'lost_to_followup_outreach';
  else if (ratio >= 0.85) band = 'excellent_adherence';
  else if (ratio >= 0.6) band = 'good_adherence';
  else if (ratio >= 0.3) band = 'poor_adherence_patient_education';
  else band = 'very_poor_adherence_reschedule_visit';

  return { adherence_band: band, ratio: Math.round(ratio * 100) / 100 };
}

function rpm_trend(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.vital_type, 'vital_type', ['sbp','dbp','hr','spo2','glucose','weight','temp','resp_rate','peak_flow','inr']);
  ensureNumber(req.readings_last_7_days, 'readings_last_7_days');
  ensureNumber(req.mean_value, 'mean_value');
  ensureNumber(req.std_dev, 'std_dev');
  ensureNumber(req.delta_from_baseline, 'delta_from_baseline');

  let trend;
  if (req.std_dev === 0) trend = 'flat_no_variability';
  else if (Math.abs(req.delta_from_baseline) > 2 * req.std_dev) trend = 'significant_change_review_within_24h';
  else if (req.std_dev > req.mean_value * 0.2) trend = 'high_variability_review_diet_med_adherence';
  else trend = 'stable_trend';

  return { trend_band: trend, mean: req.mean_value, std: req.std_dev };
}

function rpm_escalation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.alert_count_24h, 'alert_count_24h', ['zero','one','two_to_three','four_to_five','more_than_five']);
  ensureBool(req.symptom_reported, 'symptom_reported');
  ensureEnum(req.channel, 'channel', ['phone','video','in_person','ed','none']);

  let action;
  if (req.alert_count_24h === 'more_than_five' || (req.symptom_reported && req.alert_count_24h !== 'zero')) action = 'immediate_video_or_phone_within_2h';
  else if (req.alert_count_24h === 'four_to_five') action = 'video_visit_within_24h';
  else if (req.alert_count_24h === 'two_to_three') action = 'phone_check_within_24h';
  else if (req.alert_count_24h === 'one') action = 'continue_monitoring_no_action';
  else action = 'no_alerts_continue_routine';

  return { escalation_action: action, channel: req.channel };
}

function funcs() { return { rpm_vitals_ingest, rpm_alert, rpm_adherence, rpm_trend, rpm_escalation }; }

module.exports = { funcs, CITATIONS, ValidationError };