// filepath: tier44_pediatrics_ext_253_ped_resp_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function asthma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureEnum(req.severity, 'sev', ['mild_intermittent','mild_persistent','moderate_persistent','severe_persistent']);
  ensureNum(req.oxygen_sat, 'spo2');
  ensureEnum(req.trigger, 'trig', ['viral_uri','allergen','exercise','cold_air','smoke','unknown']);
  ensureStr(req.treatment, 'tx');
  const status = req.oxygen_sat >= 95 ? 'stable' : req.oxygen_sat >= 92 ? 'monitor' : 'severe';
  return { severity: req.severity, status, treatment: req.treatment };
}
function bronchiolitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_months, 'age_m');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureBool(req.wheezing, 'wheeze');
  ensureStr(req.treatment, 'tx');
  const sev = req.oxygen_sat >= 95 && req.respiratory_rate < 50 ? 'mild' : req.oxygen_sat >= 92 ? 'moderate' : 'severe';
  return { severity: sev, treatment: req.treatment };
}
function pneumonia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureStr(req.infiltrate, 'inf');
  ensureStr(req.pathogen, 'path');
  ensureStr(req.treatment, 'tx');
  return { oxygen_sat: req.oxygen_sat, treatment: req.treatment };
}
function croup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe']);
  ensureEnum(req.stridor, 'str', ['none','with_cry','at_rest','continuous']);
  ensureBool(req.barking_cough, 'cough');
  ensureStr(req.treatment, 'tx');
  return { severity: req.severity, treatment: req.treatment };
}
function foreign_body_aspiration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_years, 'age');
  ensureStr(req.location, 'loc');
  ensureStr(req.symptoms, 'sx');
  ensureStr(req.management, 'mgmt');
  return { location: req.location, management: req.management };
}

function funcs() { return { asthma, bronchiolitis, pneumonia, croup, foreign_body_aspiration }; }
module.exports = { funcs, ValidationError };