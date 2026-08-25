// filepath: tier128_neonatal_663_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nicu_admission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.adm_id, 'aid');
  ensureNum(req.birth_weight_g, 'bw');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureEnum(req.reason, 'rs', ['preterm','respiratory_distress','sepsis','hyperbilirubinemia','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.adm_id };
}
function apgar(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.apgar_id, 'aid');
  ensureNum(req.min_1_score, 'm1');
  ensureNum(req.min_5_score, 'm5');
  ensureNum(req.min_10_score, 'm10');
  ensureStr(req.provider, 'pr');
  return { aid: req.apgar_id };
}
function phototherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pt_id, 'pid');
  ensureNum(req.bilirubin_pre, 'bp');
  ensureNum(req.bilirubin_post, 'bpo');
  ensureNum(req.duration_hours, 'dh');
  ensureStr(req.provider, 'pr');
  return { pid: req.pt_id };
}
function kangaroo_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.kc_id, 'kid');
  ensureNum(req.sessions_per_day, 'spd');
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.parent_engagement, 'pe');
  ensureStr(req.provider, 'pr');
  return { kid: req.kc_id };
}
function nicu_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dc_id, 'did');
  ensureNum(req.length_of_stay_days, 'los');
  ensureNum(req.discharge_weight_g, 'dw');
  ensureEnum(req.feeding_status, 'fs', ['breast','formula','mixed','ng_tube','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.dc_id };
}

function funcs() { return { nicu_admission, apgar, phototherapy, kangaroo_care, nicu_discharge }; }
module.exports = { funcs, ValidationError };