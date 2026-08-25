// filepath: tier124_ultrasound_647_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function abdominal_us(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.us_id, 'uid');
  ensureStr(req.findings, 'fnd');
  ensureEnum(req.gallbladder, 'gb', ['normal','stones','thickening','polyps','cholecystitis','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { uid: req.us_id };
}
function vascular_us(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.us_id, 'uid');
  ensureEnum(req.vessel, 'ves', ['carotid','vertebral','renal','aorta','peripheral','other','unknown']);
  ensureNum(req.stenosis_pct, 'sp');
  ensureBool(req.plaque, 'plq');
  ensureStr(req.provider, 'pr');
  return { uid: req.us_id };
}
function obstetric_us(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.us_id, 'uid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.fetal_weight_g, 'fwg');
  ensureEnum(req.position, 'pos', ['cephalic','breech','transverse','oblique','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { uid: req.us_id };
}
function echo_us(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.us_id, 'uid');
  ensureNum(req.ef_pct, 'ef');
  ensureEnum(req.wall_motion, 'wm', ['normal','hypokinesis','akinesis','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { uid: req.us_id };
}
function msk_us(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.us_id, 'uid');
  ensureEnum(req.joint, 'jt', ['shoulder','elbow','wrist','hip','knee','ankle','other','unknown']);
  ensureStr(req.finding, 'fnd');
  ensureStr(req.provider, 'pr');
  return { uid: req.us_id };
}

function funcs() { return { abdominal_us, vascular_us, obstetric_us, echo_us, msk_us }; }
module.exports = { funcs, ValidationError };