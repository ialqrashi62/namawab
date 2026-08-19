// filepath: tier109_spine_care_573_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function spine_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.region, 'reg', ['cervical','thoracic','lumbar','sacral','multilevel','other','unknown']);
  ensureNum(req.pain_score, 'ps');
  ensureBool(req.radiculopathy, 'rad');
  ensureBool(req.motor_deficit, 'md');
  ensureEnum(req.imaging, 'img', ['mri','ct','xray','none','other','unknown']);
  ensureEnum(req.indication, 'ind', ['surgery','conservative','pain','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function conservative_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.treatment_id, 'tid');
  ensureEnum(req.type, 'tp', ['physical_therapy','chiropractic','medications','injection','other','unknown']);
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.exercises, 'ex');
  ensureEnum(req.response, 'resp', ['complete','partial','none','worsening','other','unknown']);
  ensureNum(req.pain_reduction_pct, 'prp');
  ensureStr(req.provider, 'pr');
  return { tid: req.treatment_id };
}
function spine_injection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.injection_id, 'iid');
  ensureEnum(req.type, 'tp', ['epidural','facet_block','sacroiliac','nerve_root','trigger_point','other','unknown']);
  ensureStr(req.level, 'lvl');
  ensureEnum(req.approach, 'app', ['interlaminar','transforaminal','caudal','posterior','lateral','other','unknown']);
  ensureStr(req.steroid, 'st');
  ensureNum(req.relief_pct, 'rp');
  ensureStr(req.provider, 'pr');
  return { iid: req.injection_id };
}
function spine_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.procedure, 'proc', ['fusion','discectomy','laminectomy','kyphoplasty','decompression','other','unknown']);
  ensureStr(req.levels, 'lvl');
  ensureEnum(req.approach, 'app', ['anterior','posterior','lateral','combined','minimally_invasive','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.blood_loss_ml, 'blm');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { sid: req.surgery_id };
}
function post_op_spine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.postop_id, 'pid');
  ensureStr(req.surgery_id, 'sid');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.mobility, 'mob', ['ambulating','wheelchair','bedbound','other','unknown']);
  ensureNum(req.complications, 'comp');
  ensureEnum(req.discharge, 'dc', ['home','home_health','rehab','snf','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.postop_id };
}

function funcs() { return { spine_assessment, conservative_treatment, spine_injection, spine_surgery, post_op_spine }; }
module.exports = { funcs, ValidationError };