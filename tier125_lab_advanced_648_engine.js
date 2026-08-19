// filepath: tier125_lab_advanced_648_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cbc_differential(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cbc_id, 'cid');
  ensureNum(req.wbc, 'wbc');
  ensureNum(req.rbc, 'rbc');
  ensureNum(req.hgb, 'hgb');
  ensureNum(req.hct, 'hct');
  ensureNum(req.plt, 'plt');
  ensureStr(req.provider, 'pr');
  return { cid: req.cbc_id };
}
function metabolic_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.bmp_id, 'bid');
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req.chloride, 'cl');
  ensureNum(req.bicarb, 'bic');
  ensureNum(req.bun, 'bun');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.glucose, 'gl');
  ensureStr(req.provider, 'pr');
  return { bid: req.bmp_id };
}
function coag_study(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.coag_id, 'cid');
  ensureNum(req.pt, 'pt');
  ensureNum(req.ptt, 'ptt');
  ensureNum(req.inr, 'inr');
  ensureNum(req.fibrinogen, 'fib');
  ensureStr(req.provider, 'pr');
  return { cid: req.coag_id };
}
function urinalysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ua_id, 'uid');
  ensureNum(req.ph, 'ph');
  ensureEnum(req.protein, 'prt', ['neg','trace','1+','2+','3+','4+','other','unknown']);
  ensureEnum(req.glucose, 'glc', ['neg','trace','1+','2+','3+','4+','other','unknown']);
  ensureEnum(req.ketones, 'ket', ['neg','trace','small','moderate','large','other','unknown']);
  ensureEnum(req.blood, 'bld', ['neg','trace','small','moderate','large','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { uid: req.ua_id };
}
function microalbumin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.malb_id, 'mid');
  ensureNum(req.acr, 'acr');
  ensureNum(req.ratio, 'ratio');
  ensureEnum(req.severity, 'sev', ['normal','moderately_increased','severely_increased','nephrotic','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.malb_id };
}

function funcs() { return { cbc_differential, metabolic_panel, coag_study, urinalysis, microalbumin }; }
module.exports = { funcs, ValidationError };