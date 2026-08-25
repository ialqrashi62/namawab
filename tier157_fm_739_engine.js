// filepath: tier157_fm_739_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function visit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.sex, 'sx', ['M','F','other','unknown']);
  ensureEnum(req.visit_type, 'vt', ['acute','chronic','preventive','wellness','urgent','telehealth','group','other']);
  ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.hr, 'hr');
  ensureNum(req.temperature_c, 'tc');
  ensureNum(req.bmi, 'bm');
  ensureEnum(req.smoker, 'sm', ['never','former','current','unknown']);
  ensureNum(req.audit_score, 'au');
  ensureStr(req.complaint, 'co');
  ensureStr(req.diagnosis, 'dx');
  ensureStr(req.plan, 'pl');
  ensureStr(req.provider, 'pr');
  return { vs_id: `fvt_${Date.now()}`, patient_id: req.patient_id, type: req.visit_type };
}
function screening(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.cancer_screening, 'cs', ['none','mammogram','pap','hpv','colonoscopy','fit','cologuard','psa','lung_ldct','skin','other']);
  ensureEnum(req.due, 'du', ['due','overdue','up_to_date','declined','NA','unknown']);
  ensureEnum(req.diabetes_screen, 'ds', ['none','a1c','fasting_glucose','ogtt','random_glucose','completed','NA']);
  ensureEnum(req.lipid_screen, 'ls', ['none','fasting_lipid','non_fasting','completed','NA']);
  ensureEnum(req.immunizations_due, 'id', ['none','flu','covid','tdap','pneumococcal','shingles','hpv','hepb','mmr','varicella','other','combination']);
  ensureBool(req.depression_screen, 'dp');
  ensureEnum(req.depression_score, 'ds2', ['PHQ2_done','PHQ2_negative','PHQ9_done','PHQ9_negative','PHQ9_positive','NA']);
  ensureStr(req.provider, 'pr');
  return { sc_id: `scr_${Date.now()}`, patient_id: req.patient_id, cancer: req.cancer_screening };
}
function chronic_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.bp_systolic, 'bs');
  ensureNum(req.bp_diastolic, 'bd');
  ensureNum(req.hba1c, 'h1');
  ensureNum(req.ldl, 'ld');
  ensureNum(req.bmi, 'bm');
  ensureBool(req.smoker, 'sm');
  ensureBool(req.aspirin, 'as');
  ensureNum(req.egfr, 'eg');
  ensureNum(req.uacr, 'ua');
  ensureEnum(req.control, 'co', ['controlled','partially','uncontrolled','NA','unknown']);
  ensureNum(req.medication_count, 'mc');
  ensureNum(req.medication_adherence_pct, 'ma');
  ensureStr(req.provider, 'pr');
  return { cc_id: `ccr_${Date.now()}`, patient_id: req.patient_id, control: req.control };
}
function health_promotion(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.physical_activity_min_week, 'pa');
  ensureNum(req.fruit_veg_servings_day, 'fv');
  ensureNum(req.water_intake_l_day, 'wt');
  ensureNum(req.sleep_hours, 'sl');
  ensureNum(req.stress_score, 'ss');
  ensureNum(req.bmi, 'bm');
  ensureNum(req.waist_cm, 'wc');
  ensureBool(req.smoking_cessation, 'sc');
  ensureBool(req.alcohol_screening, 'as');
  ensureBool(req.safe_sex_counseling, 'sx');
  ensureEnum(req.readiness, 'rd', ['pre_contemplation','contemplation','preparation','action','maintenance','NA']);
  ensureStr(req.provider, 'pr');
  return { hp_id: `hpr_${Date.now()}`, patient_id: req.patient_id, bmi: req.bmi };
}
function family_history(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.relative, 'rl', ['mother','father','sister','brother','grandmother','grandfather','aunt','uncle','cousin','daughter','son','multiple','other','NA']);
  ensureEnum(req.condition, 'cn', ['breast_cancer','ovarian_cancer','colon_cancer','prostate_cancer','lung_cancer','melanoma','pancreatic_cancer','endometrial','diabetes','HTN','CAD','stroke','dementia','parkinsons','alzheimer','depression','suicide','substance','other','NA']);
  ensureNum(req.age_onset, 'ao');
  ensureEnum(req.lineage, 'ln', ['maternal','paternal','both','unknown','NA']);
  ensureBool(req.brca_relevant, 'br');
  ensureEnum(req.genetic_test, 'gt', ['none','recommended','completed_positive','completed_negative','declined','pending','NA']);
  ensureNum(req.relative_count, 'rc');
  ensureStr(req.provider, 'pr');
  return { fh_id: `fhi_${Date.now()}`, patient_id: req.patient_id, condition: req.condition };
}

function funcs() { return { visit, screening, chronic_care, health_promotion, family_history }; }
module.exports = { funcs, ValidationError };