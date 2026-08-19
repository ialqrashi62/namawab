// filepath: tier128_womens_660_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function prenatal_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.fundal_height_cm, 'fh');
  ensureBool(req.fetal_movement, 'fm');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function postpartum(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.days_postpartum, 'dpp');
  ensureEnum(req.lochia, 'lc', ['rubra','serosa','alba','scant','heavy','other','unknown']);
  ensureEnum(req.involution, 'inv', ['normal','suboptimal','delayed','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function contraception(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cc_id, 'cid');
  ensureEnum(req.method, 'meth', ['iud','implant','pill','patch','ring','depo','barrier','permanent','none','other','unknown']);
  ensureBool(req.consent_documented, 'cd');
  ensureStr(req.provider, 'pr');
  return { cid: req.cc_id };
}
function menopause(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.meno_id, 'mid');
  ensureNum(req.fsh, 'fsh');
  ensureNum(req.amh, 'amh');
  ensureBool(req.hormone_replacement, 'hr');
  ensureStr(req.provider, 'pr');
  return { mid: req.meno_id };
}
function infertility(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.if_id, 'iid');
  ensureNum(req.cycle_length_days, 'cld');
  ensureBool(req.ovulation_confirmed, 'oc');
  ensureEnum(req.treatment, 'tr', ['clomid','iui','ivf','icsi','natural','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { iid: req.if_id };
}

function funcs() { return { prenatal_visit, postpartum, contraception, menopause, infertility }; }
module.exports = { funcs, ValidationError };