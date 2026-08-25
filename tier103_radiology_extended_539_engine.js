// filepath: tier103_radiology_extended_539_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.modality, 'mod', ['ct_chest','ct_abdomen','ct_head','ct_angio','ct_perfusion','other','unknown']);
  ensureEnum(req.contrast, 'ct', ['with','without','with_without','none','other','unknown']);
  ensureNum(req.slice_thickness, 'st');
  ensureBool(req.dose_reduction, 'dr');
  ensureStr(req.findings, 'fd');
  ensureNum(req.radiation_dose, 'rd');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function mri_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.sequence, 'seq');
  ensureEnum(req.contrast, 'ct', ['gadolinium','without','other','none','unknown']);
  ensureNum(req.slice_thickness, 'st');
  ensureStr(req.findings, 'fd');
  ensureNum(req.field_strength, 'fs');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function interventional_radiology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.procedure_type, 'pt', ['angiography','embolization','ablation','thrombectomy','catheter_directed','other','unknown']);
  ensureEnum(req.vascular_access, 'va', ['femoral','radial','brachial','jugular','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureNum(req.catheter_size_fr, 'cath');
  ensureNum(req.contrast_volume_ml, 'cv');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function contrast_reaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureEnum(req.contrast_type, 'ct', ['iodinated','gadolinium','barium','other','unknown']);
  ensureEnum(req.reaction_severity, 'rs', ['mild','moderate','severe','life_threatening','fatal','unknown','none']);
  ensureEnum(req.treatment, 'tx', ['observation','diphenhydramine','steroid','epinephrine','cpr','other','unknown','none']);
  ensureBool(req.hospitalization, 'hosp');
  ensureNum(req.premedication, 'pm');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function image_guided_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.modality, 'mod', ['ct','ultrasound','mri','fluoro','pet','other','unknown']);
  ensureStr(req.target, 'tgt');
  ensureNum(req.needle_gauge, 'ng');
  ensureNum(req.core_samples, 'cs');
  ensureEnum(req.pathology, 'path', ['benign','malignant','atypical','inadequate','pending','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}

function funcs() { return { ct_protocol, mri_protocol, interventional_radiology, contrast_reaction, image_guided_biopsy }; }
module.exports = { funcs, ValidationError };
