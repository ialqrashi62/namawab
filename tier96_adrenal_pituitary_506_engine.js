// filepath: tier96_adrenal_pituitary_506_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function adrenal_incidentaloma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.lesion_size_cm, 'ls');
  ensureNum(req.hu_density, 'hud');
  ensureBool(req.cortisol_autonomous, 'ca');
  ensureNum(req.aldo_renin_ratio, 'arr');
  ensureNum(req.normetanephrine, 'nmn');
  ensureEnum(req.imaging, 'img', ['ct','mri','pet','other','unknown']);
  ensureEnum(req.recommendation, 'rec', ['followup_imaging','biopsy','surgery','medical','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pheochromocytoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.normetanephrine, 'nmn');
  ensureNum(req.metanephrine, 'mn');
  ensureNum(req.urine_catecholamines, 'uc');
  ensureNum(req.systolic_bp, 'sbp');
  ensureNum(req.diastolic_bp, 'dbp');
  ensureBool(req.alpha_blockade, 'ab');
  ensureBool(req.surgical_resection, 'sr');
  ensureNum(req.histology_confirmed, 'hc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cushings(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cortisol_24h_urine, 'c_24u');
  ensureNum(req.late_night_salivary, 'lns');
  ensureNum(req.low_dose_dex, 'ldd');
  ensureNum(req.acth, 'acth');
  ensureEnum(req.cause, 'cau', ['pituitary','ectopic','adrenal','iatrogenic','other','unknown','none']);
  ensureNum(req.imaging_findings, 'imf');
  ensureNum(req.comorbidities, 'com');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function pituitary_adenoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.adenoma_type, 'at', ['prolactinoma','acromegaly','cushing','non_functioning','tsh_secreting','gonadotropin','mixed','other','unknown']);
  ensureNum(req.size_mm, 'sm');
  ensureBool(req.macroadenoma, 'ma');
  ensureNum(req.chiasmal_compression, 'cc');
  ensureNum(req.hypopituitarism, 'hp');
  ensureNum(req.surgery_required, 'sr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function adrenal_insufficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cortisol_morning, 'cm');
  ensureNum(req.acth, 'acth');
  ensureNum(req.cosyntropin_stim, 'cs');
  ensureNum(req.sodium, 'na');
  ensureNum(req.potassium, 'k');
  ensureNum(req.metabolic_acidosis, 'ma');
  ensureBool(req.hydrocortisone_replacement, 'hr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { adrenal_incidentaloma, pheochromocytoma, cushings, pituitary_adenoma, adrenal_insufficiency }; }
module.exports = { funcs, ValidationError };
