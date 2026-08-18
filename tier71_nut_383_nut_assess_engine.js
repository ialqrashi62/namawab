// filepath: tier71_nut_383_nut_assess_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nutrition_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.screen_type, 'st', ['mst','must','nrs_2002','sga','pgnutritional','pediatric_nutrition_screen','pediatric_nutrition_screen_other','adult_malnutrition','adult_nutrition','other']);
  ensureNum(req.score, 'score');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','severe','unknown','malnourished','at_risk','normal']);
  ensureStr(req.re_screening_due, 'rsd');
  ensureBool(req.registered_dietitian_notified, 'rdn');
  ensureBool(req.nutrition_order_entered, 'noe');
  ensureStr(req.screen_completed_by, 'scb');
  ensureStr(req.screening_date, 'sd');
  return { screen: req.screen_type };
}
function malnutrition_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.assessment_type, 'at', ['sga','pg_sga','mst','must','global_leadership_initiative','academy_nutrition_dietetics','other']);
  ensureEnum(req.overall_rating, 'or', ['well_nourished','mild_malnutrition','moderate_malnutrition','severely_malnourished','normal','overweight','obese','risk_malnutrition','other']);
  ensureNum(req.weight_change_kg, 'wcg');
  ensureEnum(req.intake_change, 'ic', ['no_change','slightly_decreased','significantly_decreased','increased','highly_increased','unable_to_eat','other']);
  ensureBool(req.gastrointestinal_symptoms, 'gis');
  ensureEnum(req.functional_capacity, 'fc', ['normal','mild_dysfunction','moderate_dysfunction','severe_dysfunction','bedridden','ambulatory','wheelchair','limited','other']);
  ensureBool(req.physician_reviewed, 'pr');
  ensureStr(req.rd_name, 'rd');
  ensureNum(req.reassessment_due, 'rd2');
  return { or: req.overall_rating };
}
function anthropometric_measurements(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.height_cm, 'hc');
  ensureNum(req.weight_kg, 'wkg');
  ensureNum(req.bmi, 'bmi');
  ensureNum(req.mid_arm_circumference_cm, 'mac');
  ensureNum(req.triceps_skinfold_mm, 'tsf');
  ensureNum(req.grip_strength_kg, 'gs');
  ensureStr(req.weight_history_6mo, 'wh');
  ensureStr(req.measurements_taken_by, 'mtb');
  ensureStr(req.measurement_date, 'md');
  return { bmi: req.bmi };
}
function dietary_intake_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.assessment_method, 'am', ['24hr_recall','food_frequency','food_diary','3_day_diary','7_day_diary','diet_history','calorie_count','other']);
  ensureNum(req.total_kcal, 'tk');
  ensureNum(req.protein_g, 'pg');
  ensureNum(req.carb_pct, 'cp');
  ensureNum(req.fat_pct, 'fp');
  ensureNum(req.fiber_g, 'fg');
  ensureNum(req.sodium_mg, 'sm');
  ensureNum(req.fluid_ml, 'fm');
  ensureEnum(req.diet_quality, 'dq', ['adequate','inadequate','excessive','poor','good','acceptable','excellent','unknown']);
  ensureBool(req.counseling_needed, 'cn');
  return { method: req.assessment_method };
}
function food_allergy_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.allergy_test, 'at', ['ige_panel','igg_panel','skin_prick','patch_test','elimination_diet','food_diary','other']);
  ensureStr(req.allergens_positive, 'ap');
  ensureStr(req.allergens_negative, 'an');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','anaphylaxis_history','unknown','other']);
  ensureEnum(req.reaction_type, 'rt', ['hives','anaphylaxis','edema','gi_symptoms','eczema','respiratory','contact_derm','other','unknown']);
  ensureBool(req.epi_prescribed, 'ep');
  ensureStr(req.diet_modification, 'dm');
  ensureNum(req.follow_up_days, 'fud');
  return { sev: req.severity };
}

function funcs() { return { nutrition_screening, malnutrition_assessment, anthropometric_measurements, dietary_intake_assessment, food_allergy_assessment }; }
module.exports = { funcs, ValidationError };