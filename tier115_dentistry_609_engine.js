// filepath: tier115_dentistry_609_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function extraction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.tooth, 'tooth');
  ensureEnum(req.type, 'tp', ['simple','surgical','impacted','wisdom','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.healing_days, 'hd');
  ensureStr(req.analgesics, 'anal');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function root_canal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.tooth, 'tooth');
  ensureStr(req.canal, 'canal');
  ensureEnum(req.files, 'fls', ['hand','rotary','reciprocating','hybrid','other','unknown']);
  ensureEnum(req.filling, 'flng', ['gutta_percha','bioceramic','composite','amalgam','other','unknown']);
  ensureEnum(req.outcome, 'out', ['successful','failed','complications','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function implant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.tooth, 'tooth');
  ensureEnum(req.implant_type, 'it', ['titanium','zirconia','other','unknown']);
  ensureNum(req.healing_months, 'hm');
  ensureBool(req.osseointegration, 'os');
  ensureEnum(req.prosthesis, 'prs', ['crown','bridge','denture','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function orthodontic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 'tp', ['fixed','removable','clear_aligners','lingual','other','unknown']);
  ensureNum(req.duration_months, 'dm');
  ensureEnum(req.appliance, 'app', ['brackets','bands','aligners','expanders','other','unknown']);
  ensureNum(req.extractions_needed, 'en');
  ensureEnum(req.outcome, 'out', ['in_progress','completed','discontinued','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function periodontal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['gingivitis','mild_periodontitis','moderate_periodontitis','severe_periodontitis','other','unknown']);
  ensureNum(req.pocket_depth_mm, 'pdm');
  ensureBool(req.bleeding_on_probing, 'bop');
  ensureEnum(req.treatment, 'tx', ['scaling_root_planing','surgery','antibiotics','maintenance','combination','other','unknown']);
  ensureNum(req.reassessment_weeks, 'rw');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { extraction, root_canal, implant, orthodontic, periodontal }; }
module.exports = { funcs, ValidationError };