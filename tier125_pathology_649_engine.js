// filepath: tier125_pathology_649_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function histology_report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.path_id, 'pid');
  ensureEnum(req.specimen_type, 'st', ['biopsy','resection','excision','core','other','unknown']);
  ensureEnum(req.diagnosis, 'dg', ['benign','atypical','in_situ','malignant','indeterminate','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.path_id };
}
function cytology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cyt_id, 'cid');
  ensureStr(req.specimen, 'spec');
  ensureEnum(req.diagnosis, 'dg', ['negative','atypical','suspicious','positive','unsatisfactory','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cyt_id };
}
function frozen_section(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fs_id, 'fid');
  ensureBool(req.intraop_consult, 'ic');
  ensureEnum(req.margin, 'mg', ['clear','close','involved','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { fid: req.fs_id };
}
function immuno_stain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ihc_id, 'iid');
  ensureStr(req.stain, 'stn');
  ensureEnum(req.result, 'res', ['positive','negative','equivocal','other','unknown']);
  ensureNum(req.percent, 'pct');
  ensureStr(req.provider, 'pr');
  return { iid: req.ihc_id };
}
function molecular_path(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.mol_id, 'mid');
  ensureStr(req.test, 'tst');
  ensureStr(req.result, 'res');
  ensureNum(req.tps, 'tps');
  ensureStr(req.provider, 'pr');
  return { mid: req.mol_id };
}

function funcs() { return { histology_report, cytology, frozen_section, immuno_stain, molecular_path }; }
module.exports = { funcs, ValidationError };