// filepath: tier70_img_diag_378_img_proc_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.ct_type, 'ct', ['head','chest','abdomen','pelvis','chest_abdomen','chest_abdo_pelvis','spine','extremity','coronary_angiogram','cta','cta_pulmonary','ct_perfusion','low_dose_lung','cardiac','full_body','other']);
  ensureBool(req.with_contrast, 'wc');
  ensureStr(req.protocol_id, 'pid');
  ensureStr(req.ordering_physician, 'op');
  ensureEnum(req.study_quality, 'sq', ['adequate','limited','non_diagnostic','excellent','suboptimal','requires_repeat','adequate_with_artifacts']);
  ensureNum(req.dose_length_product_mgycm, 'dlp');
  ensureBool(req.critical_results, 'cr');
  ensureStr(req.technologist, 'tech');
  ensureStr(req.worklist_done, 'wd');
  return { ct_type: req.ct_type };
}
function mri_scan(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.mri_type, 'mt', ['brain','spine','msk','abdominal','pelvic','cardiac','breast','mra','mrv','prostate','functional','spectroscopy','diffusion','perfusion','standard','dedicated','other']);
  ensureBool(req.with_contrast, 'wc');
  ensureNum(req.weight_kg, 'wkg');
  ensureStr(req.protocol_id, 'pid');
  ensureBool(req.sedation_used, 'su');
  ensureBool(req.claustrophobia_managed, 'cm');
  ensureEnum(req.study_quality, 'sq', ['adequate','limited','non_diagnostic','excellent','suboptimal','requires_repeat','adequate_with_artifacts']);
  ensureNum(req.duration_min, 'dur');
  ensureStr(req.technologist, 'tech');
  return { mri_type: req.mri_type };
}
function xray(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.exam_type, 'et', ['chest_2view','chest_1view','abdomen_series','spine_series','skull','upper_ext','lower_ext','foot','ankle','knee','hand','wrist','shoulder','pelvis','hip','portable','lateral_only','other']);
  ensureEnum(req.positioning, 'pos', ['pa_lateral','ap','lateral','oblique','axillary','decubitus','cross_table','skyline','frog_leg','sunrise','weight_bearing','other']);
  ensureNum(req.exposure_index, 'ei');
  ensureNum(req.radiation_dose_mgy, 'rd');
  ensureEnum(req.image_quality, 'iq', ['good','excellent','adequate','poor','limited','non_diagnostic','requires_repeat']);
  ensureBool(req.repeat_required, 'rr');
  ensureStr(req.technologist, 'tech');
  ensureStr(req.worklist_done, 'wd');
  return { exam: req.exam_type };
}
function ultrasound_extended(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.us_type, 'ut', ['abdominal','renal','pelvic','obstetric','first_trimester','second_trimester','third_trimester','vascular','carotid','venous','arterial','musculoskeletal','echo','transesophageal','small_parts','thyroid','breast','testicular','other']);
  ensureEnum(req.probe_used, 'pu', ['curvilinear','linear','phased_array','endorectal','endovaginal','transesophageal','other']);
  ensureEnum(req.study_quality, 'sq', ['adequate','limited','non_diagnostic','excellent','suboptimal','requires_repeat','adequate_with_artifacts']);
  ensureStr(req.findings, 'find');
  ensureStr(req.measurements, 'meas');
  ensureNum(req.duration_min, 'dur');
  ensureBool(req.patient_fasted, 'pf');
  ensureStr(req.technologist, 'tech');
  return { us_type: req.us_type };
}
function nuclear_med(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.exam_type, 'et', ['pet_ct','pet','spect','bone_scan','thyroid_scan','hida','vq_scan','cardiac_mibi','gastric_empty','renal_scan','brain_spect','other']);
  ensureStr(req.radiotracer, 'rt');
  ensureNum(req.injected_dose_mci, 'idm');
  ensureEnum(req.study_quality, 'sq', ['adequate','limited','non_diagnostic','excellent','suboptimal','requires_repeat','adequate_with_artifacts']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.waiting_period_min, 'wpm');
  ensureBool(req.patient_prep_proper, 'ppp');
  ensureStr(req.technologist, 'tech');
  ensureStr(req.reading_provider, 'rp');
  return { exam: req.exam_type };
}

function funcs() { return { ct_scan, mri_scan, xray, ultrasound_extended, nuclear_med }; }
module.exports = { funcs, ValidationError };