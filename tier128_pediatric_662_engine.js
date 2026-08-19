// filepath: tier128_pediatric_662_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function well_child(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wt');
  ensureNum(req.height_cm, 'ht');
  ensureEnum(req.development, 'dv', ['normal','at_risk','delayed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function immunization(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.vacc_id, 'vid');
  ensureStr(req.vaccine, 'vac');
  ensureNum(req.dose_number, 'dn');
  ensureNum(req.age_at_dose_months, 'adm');
  ensureStr(req.provider, 'pr');
  return { vid: req.vacc_id };
}
function newborn_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.nbs_id, 'nid');
  ensureEnum(req.results, 'rs', ['normal','abnormal_pending','abnormal_confirmed','incomplete','other','unknown']);
  ensureNum(req.specimens_collected, 'sc');
  ensureStr(req.provider, 'pr');
  return { nid: req.nbs_id };
}
function feeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.feed_id, 'fid');
  ensureEnum(req.type, 'ty', ['breast','formula','mixed','solid','tube','other','unknown']);
  ensureNum(req.frequency_per_day, 'fpd');
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.provider, 'pr');
  return { fid: req.feed_id };
}
function growth_chart(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.gc_id, 'gid');
  ensureNum(req.height_percentile, 'hp');
  ensureNum(req.weight_percentile, 'wp');
  ensureNum(req.bmi_percentile, 'bp');
  ensureStr(req.provider, 'pr');
  return { gid: req.gc_id };
}

function funcs() { return { well_child, immunization, newborn_screen, feeding, growth_chart }; }
module.exports = { funcs, ValidationError };