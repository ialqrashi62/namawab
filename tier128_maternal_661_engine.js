// filepath: tier128_maternal_661_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function high_risk_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.hr_id, 'hid');
  ensureEnum(req.risk_factor, 'rf', ['gdm','preeclampsia','preterm_labor','placenta_previa','other','unknown']);
  ensureNum(req.review_frequency_weeks, 'rfw');
  ensureStr(req.provider, 'pr');
  return { hid: req.hr_id };
}
function gestational_diabetes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.gdm_id, 'gid');
  ensureNum(req.glucose_challenge, 'gc');
  ensureNum(req.hba1c, 'hba');
  ensureBool(req.diet_controlled, 'dc');
  ensureStr(req.provider, 'pr');
  return { gid: req.gdm_id };
}
function preeclampsia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pe_id, 'pid');
  ensureNum(req.systolic_bp, 'sbp');
  ensureNum(req.proteinuria, 'pu');
  ensureNum(req.edema_score, 'es');
  ensureStr(req.provider, 'pr');
  return { pid: req.pe_id };
}
function nst(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.nst_id, 'nid');
  ensureNum(req.baseline_fhr, 'bf');
  ensureNum(req.accelerations, 'acc');
  ensureBool(req.reactive, 'rx');
  ensureStr(req.provider, 'pr');
  return { nid: req.nst_id };
}
function biophysical_profile(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bpp_id, 'bid');
  ensureNum(req.score, 'sc');
  ensureNum(req.afv_cm, 'afv');
  ensureNum(req.fetal_breathing, 'fb');
  ensureStr(req.provider, 'pr');
  return { bid: req.bpp_id };
}

function funcs() { return { high_risk_pregnancy, gestational_diabetes, preeclampsia, nst, biophysical_profile }; }
module.exports = { funcs, ValidationError };