// filepath: tier59_telemedicine_329_tele_monitor_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function remote_patient_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.device, 'dev', ['blood_pressure_cuff','pulse_oximeter','weight_scale','glucometer','thermometer','ecg_patch','cgm']);
  ensureNum(req.readings_per_day, 'rpd');
  ensureStr(req.threshold_high, 'th');
  ensureStr(req.threshold_low, 'tl');
  ensureBool(req.alert_sent, 'as');
  ensureNum(req.patient_adherence_pct, 'pa');
  ensureEnum(req.physician_review, 'pr', ['real_time','daily','weekly','monthly','as_needed']);
  return { device: req.device };
}
function tele_vitals_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.device, 'dev');
  ensureStr(req.vitals_tracked, 'vt');
  ensureNum(req.abnormal_readings, 'ar');
  ensureStr(req.response_action, 'ra');
  ensureEnum(req.trend, 'tr', ['improving','stable','deteriorating','variable','inconclusive']);
  return { device: req.device };
}
function wearable_data_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.wearable_type, 'wt', ['cgm','smartwatch','fitness_tracker','heart_monitor','sleep_tracker','ecg_patch']);
  ensureNum(req.data_window_days, 'dw');
  ensureNum(req.time_in_range_pct, 'tir');
  ensureNum(req.events_hypoglycemia, 'eh');
  ensureNum(req.events_hyperglycemia, 'eh2');
  ensureStr(req.recommendation, 'rec');
  return { wearable: req.wearable_type };
}
function chronic_disease_tele(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.condition, 'cond', ['heart_failure','copd','diabetes','hypertension','ckd','asthma','chronic_pain']);
  ensureStr(req.monitoring_params, 'mp');
  ensureNum(req.alerts_triggered, 'at');
  ensureNum(req.ed_visits_prevented, 'ep');
  ensureBool(req.patient_education_provided, 'pep');
  ensureStr(req.plan, 'plan');
  return { condition: req.condition };
}
function tele_alert_response(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.alert_type, 'at', ['critical_hypoxia','critical_hypotension','critical_hyperglycemia','critical_hypothermia','critical_fall_detected','critical_arrhythmia']);
  ensureStr(req.device, 'dev');
  ensureNum(req.spo2_reading, 'spo2');
  ensureNum(req.response_time_min, 'rt');
  ensureStr(req.action_taken, 'at2');
  ensureStr(req.outcome, 'out');
  return { alert: req.alert_type };
}

function funcs() { return { remote_patient_monitoring, tele_vitals_tracking, wearable_data_review, chronic_disease_tele, tele_alert_response }; }
module.exports = { funcs, ValidationError };