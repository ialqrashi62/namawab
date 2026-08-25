// filepath: tier96_diabetes_t2dm_504_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function t2dm_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.hba1c, 'hba1c');
  ensureNum(req.fasting_glucose, 'fg');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.blood_pressure, 'bp');
  ensureNum(req.ldl, 'ldl');
  ensureEnum(req.drug_classes, 'dc', ['metformin','sulfonylurea','dpp4','sglt2','glp1','thiazolidinedione','insulin','other','unknown','none']);
  ensureNum(req.number_of_meds, 'nom');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function oral_agents(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.metformin, 'met', ['on','off','contraindicated','pending','other','unknown']);
  ensureEnum(req.sulfonylurea, 'sul', ['on','off','contraindicated','pending','other','unknown','none']);
  ensureEnum(req.dpp4, 'dpp', ['on','off','contraindicated','pending','other','unknown','none']);
  ensureEnum(req.sglt2, 'sglt', ['on','off','contraindicated','pending','other','unknown','none']);
  ensureEnum(req.glp1, 'glp', ['on','off','contraindicated','pending','other','unknown','none']);
  ensureNum(req.hba1c_improvement, 'hi');
  ensureNum(req.weight_change_kg, 'wc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function injectable_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.plan_id, 'pid');
  ensureEnum(req.glp1_type, 'glp', ['semaglutide','dulaglutide','liraglutide','exenatide','tirzepatide','other','unknown','none']);
  ensureNum(req.dose_mg, 'dm');
  ensureNum(req.weight_loss_kg, 'wl');
  ensureNum(req.hba1c_improvement, 'hi');
  ensureBool(req.gi_side_effects, 'gi');
  ensureNum(req.adherence_pct, 'adh');
  ensureStr(req.provider, 'pr');
  return { pid: req.plan_id };
}
function diabetes_complications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.hba1c, 'hba1c');
  ensureNum(req.egfr, 'egfr');
  ensureNum(req.urine_albumin, 'ua');
  ensureNum(req.retinal_exam, 're');
  ensureNum(req.monofilament_test, 'mt');
  ensureNum(req.disease_duration_years, 'ddy');
  ensureBool(req.cardiovascular_disease, 'cvd');
  ensureNum(req.complication_count, 'cc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function gestational_diabetes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gestational_age_weeks, 'gaw');
  ensureNum(req.fasting_glucose, 'fg');
  ensureNum(req.one_hr_glucose, 'ohg');
  ensureNum(req.two_hr_glucose, 'thg');
  ensureEnum(req.management, 'mg', ['diet','metformin','insulin','combination','other','unknown']);
  ensureNum(req.fetal_weight_percentile, 'fwp');
  ensureNum(req.delivery_mode, 'dm');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { t2dm_management, oral_agents, injectable_therapy, diabetes_complications, gestational_diabetes }; }
module.exports = { funcs, ValidationError };
