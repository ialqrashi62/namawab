// filepath: tier76_endo_ext_403_endo_diabetes_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function diabetes_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.diabetes_type, 'dt', ['type1','type2','gestational','secondary','prediabetes','LADA','MODY','unknown','other']);
  ensureNum(req.a1c, 'a1c');
  ensureNum(req.fasting_glucose, 'fg');
  ensureNum(req.bmi, 'bmi');
  ensureStr(req.bp, 'bp');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.ldl, 'ldl');
  ensureNum(req.duration_years, 'dy');
  ensureStr(req.medications, 'med');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { dt: req.diabetes_type };
}
function diabetes_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.a1c, 'a1c');
  ensureNum(req.a1c_change, 'a1cc');
  ensureNum(req.fasting_glucose, 'fg');
  ensureNum(req.weight_change_kg, 'wcg');
  ensureNum(req.medication_adherence, 'ma');
  ensureNum(req.hypoglycemia_count, 'hc');
  ensureBool(req.complications_screened, 'cs');
  ensureBool(req.eye_exam_done, 'eed');
  ensureBool(req.foot_exam_done, 'fed');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { a1c: req.a1c };
}
function diabetes_insulin_pump(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pump_id, 'pid');
  ensureStr(req.pump_model, 'pm');
  ensureStr(req.start_date, 'sd');
  ensureNum(req.basal_rate_units_hr, 'bruh');
  ensureNum(req.carb_ratio, 'cr');
  ensureNum(req.correction_factor, 'cf');
  ensureNum(req.time_in_range_pct, 'tir');
  ensureBool(req.cgm_data_reviewed, 'cdr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.pump_id };
}
function diabetes_cgm(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cgm_id, 'cid');
  ensureStr(req.cgm_model, 'cm');
  ensureStr(req.start_date, 'sd');
  ensureNum(req.time_in_range_pct, 'tir');
  ensureNum(req.time_above_180_pct, 'ta18');
  ensureNum(req.time_below_70_pct, 'tb70');
  ensureNum(req.glucose_variability_cv, 'gvc');
  ensureBool(req.alerts_set, 'as');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureNum(req.sensor_change_due, 'scd');
  return { cid: req.cgm_id };
}
function diabetes_complications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.retinopathy_present, 'rp');
  ensureBool(req.neuropathy_present, 'np');
  ensureEnum(req.nephropathy_stage, 'ns', ['normal','g1','g2','g3a','g3b','g4','g5','unknown','other','microalbuminuria','macroalbuminuria']);
  ensureBool(req.foot_exam_normal, 'fen');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.acr, 'acr');
  ensureStr(req.macrovascular, 'mv');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureStr(req.referral, 'ref');
  return { aid: req.assessment_id };
}

function funcs() { return { diabetes_initial, diabetes_followup, diabetes_insulin_pump, diabetes_cgm, diabetes_complications }; }
module.exports = { funcs, ValidationError };