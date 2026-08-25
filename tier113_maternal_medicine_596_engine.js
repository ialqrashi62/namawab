// filepath: tier113_maternal_medicine_596_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preeclampsia_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age, 'ga');
  ensureNum(req.bp_systolic, 'bps');
  ensureNum(req.bp_diastolic, 'bpd');
  ensureEnum(req.proteinuria, 'pu', ['none','trace','1_plus','2_plus','3_plus','other','unknown']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other','unknown']);
  ensureBool(req.magnesium, 'mg');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function gestational_diabetes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.management_id, 'mid');
  ensureNum(req.gestational_age, 'ga');
  ensureEnum(req.ogtt, 'og', ['normal','abnormal','pending','other','unknown']);
  ensureNum(req.glucose_load_50g, 'gl5');
  ensureEnum(req.diet, 'dt', ['diabetic','low_carb','balanced','other','unknown']);
  ensureBool(req.insulin, 'ins');
  ensureEnum(req.fetal_growth, 'fg', ['lga','appropriate','sga','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.management_id };
}
function thyroid_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age, 'ga');
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.free_t4, 'ft4');
  ensureEnum(req.diagnosis, 'dx', ['hyperthyroid','hypothyroid','euthyroid','hashimoto','graves','other','unknown']);
  ensureEnum(req.treatment, 'tx', ['none','lt4','propylthiouracil','methimazole','observation','other','unknown']);
  ensureEnum(req.fetal_impact, 'fi', ['none','monitored','affected','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function cardiac_pregnancy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age, 'ga');
  ensureEnum(req.heart_disease, 'hd', ['ms','mr','as','ar','vhd','congenital','ischemic','other','unknown','none']);
  ensureEnum(req.functional_class, 'fc', ['I','II','III','IV','other','unknown']);
  ensureBool(req.anticoagulation, 'ac');
  ensureEnum(req.monitoring, 'mn', ['echo','ekg','symptom','none','other','unknown']);
  ensureEnum(req.delivery_plan, 'dp', ['vaginal','induction','c_section','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function antepartum_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age, 'ga');
  ensureEnum(req.presentation, 'pres', ['vertex','breech','transverse','oblique','cephalic','other','unknown']);
  ensureEnum(req.fetal_heart_tone, 'fht', ['reassuring','non_reassuring','absent','other','unknown']);
  ensureEnum(req.movements, 'mv', ['good','decreased','absent','other','unknown']);
  ensureEnum(req.edema, 'ed', ['none','1_plus','2_plus','3_plus','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { preeclampsia_management, gestational_diabetes, thyroid_pregnancy, cardiac_pregnancy, antepartum_assessment }; }
module.exports = { funcs, ValidationError };