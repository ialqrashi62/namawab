// filepath: tier71_nut_385_nut_clinical_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function diabetes_medical_nutrition(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.a1c_pct, 'a1c');
  ensureBool(req.carb_counting_taught, 'cct');
  ensureStr(req.glycemic_target_range, 'gtr');
  ensureStr(req.meal_pattern, 'mp');
  ensureStr(req.registered_dietitian, 'rd');
  ensureStr(req.monitoring_plan, 'mop');
  ensureNum(req.follow_up_months, 'fum');
  return { a1c: req.a1c_pct };
}
function renal_diet_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ckd_stage, 'cs');
  ensureNum(req.protein_g_per_kg, 'pgp');
  ensureNum(req.sodium_mg, 'sm');
  ensureNum(req.potassium_mg, 'pm');
  ensureNum(req.phosphorus_mg, 'phm');
  ensureBool(req.fluid_restricted, 'fr');
  ensureNum(req.fluid_limit_ml, 'flm');
  ensureStr(req.renally_appropriate_foods, 'rap');
  ensureBool(req.education_completed, 'ec');
  return { ckd: req.ckd_stage };
}
function cardiac_diet_education(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cardiac_dx, 'cdx', ['chf','cad','post_mi','post_stent','cabg','valve_disease','hypertension','dyslipidemia','cardiomyopathy','afib','stroke','arrhythmia','other']);
  ensureNum(req.sodium_mg, 'sm');
  ensureNum(req.fluid_ml, 'fm');
  ensureNum(req.saturated_fat_pct, 'sfp');
  ensureNum(req.cholesterol_mg, 'cm');
  ensureNum(req.fiber_g, 'fg');
  ensureBool(req.dash_compliance, 'dash');
  ensureBool(req.patient_understanding_verified, 'puv');
  ensureStr(req.rd_name, 'rd');
  ensureNum(req.follow_up_due, 'fud');
  return { dx: req.cardiac_dx };
}
function oncology_nutrition_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cancer_treatment, 'ct', ['chemo','radiation','chemo_radiation','surgery','immunotherapy','hormone','targeted','transplant','palliative','observation','other']);
  ensureStr(req.symptoms_affecting_intake, 'sai');
  ensureEnum(req.nutrition_support, 'ns', ['oral_diet','oral_nutrition_supplement','tube_feeding','tpn','diet_counseling','symptom_management','other']);
  ensureBool(req.nsaid_antiemetic, 'na');
  ensureBool(req.high_calorie_density, 'hcd');
  ensureStr(req.rd_name, 'rd');
  ensureNum(req.quality_of_life_score, 'qos');
  ensureNum(req.next_session, 'ns2');
  return { tx: req.cancer_treatment };
}
function weight_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.current_weight_kg, 'cwg');
  ensureNum(req.goal_weight_kg, 'gwg');
  ensureNum(req.weight_change_per_week, 'wcpw');
  ensureEnum(req.program_type, 'pt', ['medifast_shakes','nutrisystem','ww','keto','low_carb','balanced','dash','portion','plant_based','mediterranean','other']);
  ensureNum(req.physical_activity_min, 'pam');
  ensureBool(req.behavioral_counseling, 'bc');
  ensureStr(req.monitoring_log, 'ml');
  ensureStr(req.rd_name, 'rd');
  return { bmi: req.bmi };
}

function funcs() { return { diabetes_medical_nutrition, renal_diet_education, cardiac_diet_education, oncology_nutrition_support, weight_management }; }
module.exports = { funcs, ValidationError };