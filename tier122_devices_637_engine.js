// filepath: tier122_devices_637_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function implant_log(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.implant_id, 'iid');
  ensureStr(req.device_type, 'dt');
  ensureStr(req.manufacturer, 'mf');
  ensureStr(req.implant_date, 'id');
  ensureStr(req.provider, 'pr');
  return { iid: req.implant_id };
}
function device_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.device_serial, 'ds');
  ensureEnum(req.alert_type, 'at', ['battery_low','lead_fracture','shock_delivered','malfunction','other','unknown']);
  ensureNum(req.battery_voltage, 'bv');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function wearable_sync(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sync_id, 'sid');
  ensureStr(req.device, 'dev');
  ensureNum(req.steps, 'steps');
  ensureNum(req.heart_rate_avg, 'hra');
  ensureStr(req.provider, 'pr');
  return { sid: req.sync_id };
}
function smart_pump(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pump_id, 'pid');
  ensureStr(req.medication, 'med');
  ensureNum(req.rate_ml_hr, 'rmh');
  ensureNum(req.dose_mg, 'dm');
  ensureStr(req.provider, 'pr');
  return { pid: req.pump_id };
}
function bedside_monitor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.monitor_id, 'mid');
  ensureNum(req.heart_rate, 'hr');
  ensureNum(req.systolic_bp, 'sbp');
  ensureNum(req.spo2, 'spo2');
  ensureStr(req.provider, 'pr');
  return { mid: req.monitor_id };
}

function funcs() { return { implant_log, device_alert, wearable_sync, smart_pump, bedside_monitor }; }
module.exports = { funcs, ValidationError };