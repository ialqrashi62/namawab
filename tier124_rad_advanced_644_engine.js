// filepath: tier124_rad_advanced_644_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mri_advanced(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.modality, 'mod', ['mri_brain','mri_spine','mri_msk','mri_cardiac','mri_abdomen','other','unknown']);
  ensureBool(req.contrast_used, 'cu');
  ensureStr(req.findings, 'fnd');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function ct_advanced(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.modality, 'mod', ['ct_chest_pe','ct_angio','ct_abdomen','ct_head','other','unknown']);
  ensureStr(req.findings, 'fnd');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function pet_imaging(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.tracer, 'trc');
  ensureNum(req.suv_max, 'suv');
  ensureStr(req.findings, 'fnd');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function mammography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.birads, 'brd');
  ensureEnum(req.findings, 'fnd', ['normal','benign','probably_benign','suspicious','highly_suspicious','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function bone_density(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.t_score, 'ts');
  ensureEnum(req.diagnosis, 'diag', ['normal','osteopenia','osteoporosis','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}

function funcs() { return { mri_advanced, ct_advanced, pet_imaging, mammography, bone_density }; }
module.exports = { funcs, ValidationError };