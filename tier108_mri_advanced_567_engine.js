// filepath: tier108_mri_advanced_567_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function mri_brain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['stroke','headache','seizure','trauma','tumor','dementia','multiple_sclerosis','other','unknown']);
  ensureNum(req.slices_count, 'sc');
  ensureNum(req.scan_time_min, 'stm');
  ensureEnum(req.contrast, 'ct', ['none','gadolinium','other','unknown']);
  ensureEnum(req.findings, 'fd', ['normal','stroke','tumor','bleed','atrophy','demyelination','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function mri_spine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.spine_region, 'sr', ['cervical','thoracic','lumbar','sacral','multilevel','other','unknown']);
  ensureEnum(req.indication, 'ind', ['pain','trauma','tumor','infection','stenosis','disc_herniation','other','unknown']);
  ensureNum(req.slices_count, 'sc');
  ensureNum(req.scan_time_min, 'stm');
  ensureEnum(req.findings, 'fd', ['normal','disc_herniation','stenosis','fracture','tumor','infection','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function functional_mri(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureStr(req.cognitive_task, 'ctk');
  ensureNum(req.activation_regions, 'ar');
  ensureNum(req.bold_signal_change, 'bsc');
  ensureBool(req.motion_correction, 'mc');
  ensureEnum(req.findings, 'fd', ['normal','activation_pattern','deficit','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function mr_angiography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.vascular_region, 'vr', ['head_neck','chest','abdomen','pelvis','extremities','aorta','other','unknown']);
  ensureNum(req.contrast_volume_ml, 'cvm');
  ensureNum(req.scan_time_min, 'stm');
  ensureBool(req.contrast_used, 'cu');
  ensureEnum(req.findings, 'fd', ['normal','stenosis','occlusion','aneurysm','dissection','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function mr_spectroscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.brain_region, 'br', ['frontal','temporal','parietal','occipital','cerebellum','basal_ganglia','other','unknown']);
  ensureNum(req.metabolites_analyzed, 'ma');
  ensureNum(req.cho_creatine_ratio, 'ccr');
  ensureNum(req.nmr_quality_score, 'qs');
  ensureEnum(req.findings, 'fd', ['normal','elevated_cho','decreased_nna','tumor','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}

function funcs() { return { mri_brain, mri_spine, functional_mri, mr_angiography, mr_spectroscopy }; }
module.exports = { funcs, ValidationError };