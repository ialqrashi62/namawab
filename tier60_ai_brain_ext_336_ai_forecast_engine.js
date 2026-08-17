// filepath: tier60_ai_brain_ext_336_ai_forecast_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ed_volume_forecast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.window, 'win', ['next_24h','next_48h','next_week','next_month','next_quarter']);
  ensureNum(req.predicted_volume, 'pv');
  ensureStr(req.confidence_interval, 'ci');
  ensureNum(req.peak_hour, 'ph');
  ensureStr(req.staff_recommendation, 'sr');
  return { window: req.window };
}
function bed_demand_forecast(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.unit, 'unit');
  ensureNum(req.predicted_occupancy_pct, 'po');
  ensureNum(req.beds_needed, 'bn');
  ensureNum(req.expected_admissions, 'ea');
  ensureNum(req.expected_discharges, 'ed');
  ensureStr(req.recommendation, 'rec');
  return { unit: req.unit };
}
function staff_optimization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.department, 'dept');
  ensureEnum(req.shift, 'shift', ['day','evening','night','weekend_day','weekend_night']);
  ensureNum(req.recommended_staff, 'rs');
  ensureNum(req.current_staff, 'cs');
  ensureNum(req.overtime_hours, 'oh');
  ensureStr(req.recommendation, 'rec');
  return { shift: req.shift };
}
function readmission_risk(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.diagnosis, 'dx');
  ensureNum(req.lsi_score, 'lsi');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','very_high']);
  ensureStr(req.factors, 'facs');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req['follow_up'], 'fu');
  return { risk: req.risk_level };
}
function length_of_stay(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.predicted_los_days, 'plos');
  ensureStr(req.confidence_interval, 'ci');
  ensureStr(req.factors, 'facs');
  ensureStr(req.recommendation, 'rec');
  return { los: req.predicted_los_days };
}

function funcs() { return { ed_volume_forecast, bed_demand_forecast, staff_optimization, readmission_risk, length_of_stay }; }
module.exports = { funcs, ValidationError };