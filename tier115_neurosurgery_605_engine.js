// filepath: tier115_neurosurgery_605_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function craniotomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['hemorrhage','tumor','trauma','abscess','aneurysm','other','unknown']);
  ensureEnum(req.approach, 'app', ['pterional','frontal','parietal','temporal','suboccipital','retrosigmoid','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureEnum(req.outcome, 'out', ['successful','partial','failed','complicated','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function spine_fusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.levels, 'lvl');
  ensureEnum(req.approach, 'app', ['anterior','posterior','lateral','combined','other','unknown']);
  ensureEnum(req.graft, 'grf', ['autograft','allograft','synthetic','combination','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureEnum(req.outcome, 'out', ['successful','failed','complicated','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function tumor_resection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.tumor_type, 'tt', ['glioma','meningioma','metastasis','pituitary','acoustic','other','unknown']);
  ensureStr(req.location, 'loc');
  ensureEnum(req.approach, 'app', ['pterional','frontal','parietal','temporal','suboccipital','transsphenoidal','other','unknown']);
  ensureEnum(req.extent, 'ext', ['gross_total','subtotal','partial','biopsy','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function vp_shunt(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['hydrocephalus','nph','intracranial_hemorrhage','other','unknown']);
  ensureNum(req.valve_setting, 'vs');
  ensureNum(req.pressure_cm, 'pc');
  ensureEnum(req.outcome, 'out', ['successful','complications','failed','other','unknown']);
  ensureNum(req.revisions_count, 'rc');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function cervical_decompression(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.level, 'lvl');
  ensureEnum(req.approach, 'app', ['anterior','posterior','combined','other','unknown']);
  ensureBool(req.discectomy, 'dct');
  ensureBool(req.fusion, 'fsn');
  ensureEnum(req.outcome, 'out', ['successful','failed','complicated','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { craniotomy, spine_fusion, tumor_resection, vp_shunt, cervical_decompression }; }
module.exports = { funcs, ValidationError };