// filepath: tier71_nut_386_nut_pediatric_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function breast_feeding_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.infant_age_days, 'iad');
  ensureNum(req.feeding_frequency_per_day, 'fpd');
  ensureNum(req.latch_score, 'ls');
  ensureNum(req.infant_weight_change_gr, 'iwcg');
  ensureBool(req.mother_support_needed, 'msn');
  ensureStr(req.lactation_consultant, 'lc');
  ensureStr(req.plan, 'plan');
  ensureNum(req.follow_up_days, 'fud');
  return { age: req.infant_age_days };
}
function infant_formula(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.formula_type, 'ft', ['standard_term','standard_preterm','extensively_hydrolyzed','partially_hydrolyzed','amino_acid','soy','lactose_free','anti_reflux','premature','fortified_term','human_milk_fortifier','specialized_metabolic']);
  ensureStr(req.brand, 'brand');
  ensureNum(req.concentration_kcal_oz, 'cko');
  ensureNum(req.volume_per_feed_oz, 'vpf');
  ensureNum(req.feeds_per_day, 'fpd');
  ensureStr(req.specialty_formula_indication, 'sfi');
  ensureBool(req.preparation_education_completed, 'pec');
  ensureStr(req.dietician_review, 'dr');
  return { formula: req.formula_type };
}
function intolerance_assessment_pediatric(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.symptoms, 'sym', ['vomiting','diarrhea','colic','blood_stool','constipation','reflux','rash','wheezing','vomiting_diarrhea','gas_bloating','failure_to_thrive','poor_weight_gain','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening','chronic','acute','other']);
  ensureStr(req.formula_change, 'fc');
  ensureEnum(req.response, 'res', ['improving','resolved','no_change','worsening','partial_response','complete_response','other']);
  ensureBool(req.milk_protein_intolerance, 'mpi');
  ensureBool(req.lactose_intolerance, 'li');
  ensureStr(req.other_intolerances, 'oi');
  ensureNum(req.resolved_days, 'rd');
  return { sev: req.severity };
}
function pediatric_growth_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_percentile, 'wp');
  ensureNum(req.height_percentile, 'hp');
  ensureNum(req.bmi_percentile, 'bp');
  ensureNum(req.head_circumference_cm, 'hc');
  ensureEnum(req.weight_for_height, 'wfh', ['normal','underweight','overweight','obese','severe_underweight','stunted','wasted','overweight_risk','unknown','other']);
  ensureBool(req.stunting, 'st');
  ensureBool(req.wasting, 'wa');
  ensureBool(req.intervention_initiated, 'ii');
  return { hp: req.height_percentile };
}
function pediatric_nutrition_counseling(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.parent_education, 'pe');
  ensureStr(req.food_aversions, 'fa');
  ensureStr(req.meal_plan, 'mp');
  ensureStr(req.follow_up_date, 'fud');
  ensureStr(req.nutritionist, 'nut');
  ensureNum(req.compliance_pct, 'cp');
  ensureStr(req.supplements_recommended, 'sr');
  ensureBool(req.growth_chart, 'gc');
  return { parent: req.parent_education };
}

function funcs() { return { breast_feeding_support, infant_formula, intolerance_assessment_pediatric, pediatric_growth_assessment, pediatric_nutrition_counseling }; }
module.exports = { funcs, ValidationError };