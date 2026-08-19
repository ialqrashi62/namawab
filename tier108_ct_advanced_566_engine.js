// filepath: tier108_ct_advanced_566_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ct_cardiac(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['chest_pain','coronary_screen','preop_cardiac','arrhythmia','congenital','other','unknown']);
  ensureNum(req.heart_rate_bpm, 'hr');
  ensureBool(req.beta_blocker_given, 'bbg');
  ensureEnum(req.ct_dose, 'ctd', ['low','standard','high','other','unknown']);
  ensureNum(req.calcium_score, 'cs');
  ensureEnum(req.findings, 'fd', ['normal','mild_coronary_disease','moderate_disease','severe_disease','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function ct_pulmonary_angiogram(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['pe_rule_out','pulmonary_htn','aneurysm','other','unknown']);
  ensureEnum(req.contrast, 'ct', ['iodinated','none','other','unknown']);
  ensureNum(req.scan_time_min, 'stm');
  ensureEnum(req.bolus_timing, 'bt', ['pulmonary','aortic','other','unknown']);
  ensureEnum(req.findings, 'fd', ['negative','positive','subsegmental','massive','chronic','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function ct_perfusion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['stroke','tumor','vascular','other','unknown']);
  ensureNum(req.scan_time_min, 'stm');
  ensureNum(req.brain_volume_ml, 'bvm');
  ensureNum(req.cbf_abnormal_regions, 'car');
  ensureNum(req.time_to_perfusion, 'ttp');
  ensureEnum(req.findings, 'fd', ['normal','ischemia','infarct','hyperemia','tumor','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function ct_enterography(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['crohns','obstruction','mass','bleeding','other','unknown']);
  ensureEnum(req.contrast, 'ct', ['oral_iv','oral_only','iv_only','none','other','unknown']);
  ensureNum(req.slice_thickness, 'sth');
  ensureNum(req.bowel_segments_imaged, 'bsi');
  ensureEnum(req.findings, 'fd', ['normal','terminal_ileitis','stricture','fistula','mass','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}
function ct_virtual_colonoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.indication, 'ind', ['screening','surveillance','incomplete_colonoscopy','symptomatic','other','unknown']);
  ensureEnum(req.preparation, 'prp', ['adequate','inadequate','fair','poor','other','unknown']);
  ensureNum(req.polyp_count, 'pc');
  ensureNum(req.polyp_size_mm, 'psm');
  ensureNum(req.colonic_segments_imaged, 'csi');
  ensureStr(req.provider, 'pr');
  return { sid: req.study_id };
}

function funcs() { return { ct_cardiac, ct_pulmonary_angiogram, ct_perfusion, ct_enterography, ct_virtual_colonoscopy }; }
module.exports = { funcs, ValidationError };