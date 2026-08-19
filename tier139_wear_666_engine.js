// filepath: tier139_wear_666_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function device_register(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.device_id, 'did');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.device_type, 'dt', ['smartwatch','fitness_band','cgm','BP_monitor','ECG_patch','glucose_meter','pulse_ox','temperature','spirometer','sleep_tracker','smart_ring','insulin_pump','heart_device','neurostim','mobility_aid']);
  ensureStr(req.manufacturer, 'mn');
  ensureStr(req.model, 'md');
  ensureStr(req.firmware, 'fw');
  ensureBool(req.verified, 'vf');
  ensureStr(req.provider, 'pr');
  return { dv_id: `dv_${Date.now()}`, device_id: req.device_id, device_type: req.device_type, patient_id: req.patient_id };
}
function telemetry(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.device_id, 'did');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.metric_value, 'mv');
  ensureStr(req.metric_name, 'mn');
  ensureEnum(req.data_quality, 'dq', ['excellent','good','fair','poor','invalid']);
  ensureNum(req.battery_pct, 'bp');
  ensureNum(req.signal_strength, 'ss');
  ensureStr(req.captured_at, 'ca');
  return { tl_id: `tl_${Date.now()}`, device_id: req.device_id, metric: req.metric_name, value: req.metric_value, quality: req.data_quality };
}
function anomaly(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.device_id, 'did');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.anomaly_type, 'at', ['outlier','trend_break','stale_data','gap','duplicate','sensor_error','device_removed','battery_low','disconnected','calibration_drift']);
  ensureNum(req.confidence, 'cf');
  ensureEnum(req.severity, 'sv', ['info','warning','alert','critical']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  return { an_id: `an_${Date.now()}`, device_id: req.device_id, anomaly_type: req.anomaly_type, severity: req.severity };
}
function adherence(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.device_id, 'did');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.target_min, 'tm');
  ensureNum(req.actual_min, 'am');
  ensureNum(req.adherence_pct, 'ap');
  ensureEnum(req.activity, 'ac', ['exercise','diet_log','glucose_check','med_intake','sleep','drinking','breathing','steps','stress_mgmt','custom']);
  ensureStr(req.period, 'pp');
  ensureStr(req.provider, 'pr');
  return { ah_id: `ah_${Date.now()}`, device_id: req.device_id, adherence_pct: req.adherence_pct, activity: req.activity };
}
function iot_alert(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.device_id, 'did');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.alert_type, 'at', ['threshold_breach','device_offline','data_gap','low_battery','sensor_disconnect','irregular_heart','fall_detected','medication_missed','glucose_imminent','custom_threshold']);
  ensureNum(req.value, 'vl');
  ensureNum(req.threshold, 'th');
  ensureEnum(req.severity, 'sv', ['info','warning','urgent','critical']);
  ensureStr(req.delivery, 'dr');
  ensureStr(req.provider, 'pr');
  ensureBool(req.acknowledged, 'ac');
  return { ia_id: `ia_${Date.now()}`, device_id: req.device_id, alert_type: req.alert_type, severity: req.severity };
}

function funcs() { return { device_register, telemetry, anomaly, adherence, iot_alert }; }
module.exports = { funcs, ValidationError };
