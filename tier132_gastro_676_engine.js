// filepath: tier132_gastro_676_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ercp(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.scope_id, 'sid');
  ensureEnum(req.indication, 'ind', ['stone','stricture','tumor','leak','bleed','other','unknown']);
  ensureBool(req.sphincterotomy, 'sph');
  ensureBool(req.stent_placed, 'stp');
  ensureStr(req.provider, 'pr');
  return { sid: req.scope_id };
}
function liver_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.lb_id, 'lid');
  ensureEnum(req.approach, 'apr', ['percutaneous','transjugular','euguidance','other','unknown']);
  ensureNum(req.specimens, 'sp');
  ensureBool(req.complications, 'cmp');
  ensureStr(req.provider, 'pr');
  return { lid: req.lb_id };
}
function us_elastography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.us_id, 'uid');
  ensureNum(req.liver_stiffness_kpa, 'lsk');
  ensureEnum(req.fibrosis_stage, 'fs', ['f0','f1','f2','f3','f4','indeterminate','other','unknown']);
  ensureNum(req.iqr, 'iqr');
  ensureStr(req.provider, 'pr');
  return { uid: req.us_id };
}
function manometry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.md_id, 'mid');
  ensureEnum(req.type, 'ty', ['esophageal','antroduodenal','anorectal','colonic','other','unknown']);
  ensureEnum(req.findings, 'fnd', ['normal','aperistalsis','achalasia','dyssynergia','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.md_id };
}
function ct_enterography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ct_id, 'cid');
  ensureBool(req.contrast_used, 'cu');
  ensureEnum(req.findings, 'fnd', ['normal','inflammation','stricture','mass','other','unknown']);
  ensureNum(req.dose_dlp, 'dlp');
  ensureStr(req.provider, 'pr');
  return { cid: req.ct_id };
}

function funcs() { return { ercp, liver_biopsy, us_elastography, manometry, ct_enterography }; }
module.exports = { funcs, ValidationError };