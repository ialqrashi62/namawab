// filepath: tier34_gastroenterology_ext_207_gi_nutrition_engine.js
// TIER34_GASTROENTEROLOGY-207: GI nutrition
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function malnutrition_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.albumin, 'alb');
  ensureNumber(req.weight_loss_pct, 'wl');
  ensureNumber(req.bmi, 'bmi');
  ensureEnum(req.sga_grade, 'sga', ['a','b','c','normal','mild','severe','other']);
  ensureEnum(req.risk_level, 'risk', ['low','moderate','high','severe','other']);
  let status;
  if (req.sga_grade === 'c' || req.risk_level === 'severe') status = 'severe_malnutrition_nutrition_refer';
  else if (req.albumin < 2.5 && req.weight_loss_pct >= 10) status = 'protein_calorie_malnutrition_severe';
  else if (req.bmi < 18.5 && req.weight_loss_pct >= 5) status = 'underweight_significant_loss_review';
  else if (req.risk_level === 'low') status = 'malnutrition_low_risk_routine_monitoring';
  else status = 'malnutrition_screen_review';
  return { status, r: req.risk_level };
}

function enteral_nutrition(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.route, 'route', ['ng_tube','nj_tube','peg','pej','oral_supplement','other']);
  ensureEnum(req.formula, 'formula', ['standard_isotonic','high_protein','elemental','semi_elemental','diabetic','renal','hepatic','pulmonary','immune_modulating','other']);
  ensureNumber(req.goal_kcal, 'goal');
  ensureNumber(req.current_intake_pct, 'pct');
  ensureEnum(req.tolerance, 'tol', ['excellent','good','fair','poor','intolerance','other']);
  let status;
  if (req.tolerance === 'intolerance' || req.tolerance === 'poor') status = 'enteral_intolerance_change_formula';
  else if (req.current_intake_pct < 60) status = 'inadequate_intake_reassess_route';
  else if (req.current_intake_pct >= 80 && req.tolerance === 'good') status = 'enteral_adequate_tolerated';
  else status = 'enteral_review_appropriate';
  return { status, route: req.route };
}

function parenteral_nutrition(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.route, 'route', ['central','peripheral','picc','tunneled','other']);
  ensureNumber(req.dextrose_pct, 'dex');
  ensureNumber(req.amino_acids_pct, 'aa');
  ensureNumber(req.lipids_pct, 'lip');
  ensureNumber(req.total_kcal, 'kcal');
  ensureEnum(req.complication, 'comp', ['none','line_infection','metabolic','hyperglycemia','liver_abnormalities','catheter_thrombosis','other']);
  let status;
  if (req.complication === 'line_infection') status = 'catheter_sepsis_treat_remove';
  else if (req.complication === 'hyperglycemia' && req.dextrose_pct > 25) status = 'hyperglycemia_reduce_dex_insulin';
  else if (req.complication === 'liver_abnormalities') status = 'pn_liver_disease_review_lipid';
  else if (req.total_kcal < 1000 && req.total_kcal >= 0) status = 'inadequate_pn_calories_review';
  else status = 'parenteral_nutrition_review';
  return { status, r: req.route };
}

function gi_diet_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.diet_type, 'diet', ['low_fodmap','gluten_free','low_residue','high_protein','low_fat','renal','diabetic','carbohydless','ketogenic','elemental','other']);
  ensureEnum(req.condition, 'cond', ['ibs','celiac','ibd','short_bowel','gerd','peg_tube','constipation','diarrhea','other']);
  ensureEnum(req.response, 'resp', ['excellent','improving','partial','no_response','worsened','unknown']);
  ensureNumber(req.duration_weeks, 'weeks');
  ensureEnum(req.adherence, 'adh', ['excellent','good','suboptimal','poor']);
  let status;
  if (req.response === 'worsened') status = 'diet_worsened_reassess_review_alternative';
  else if (req.response === 'no_response' && req.adherence === 'good' && req.duration_weeks >= 8) status = 'no_response_diet_failed_alternative';
  else if (req.response === 'excellent' && req.adherence === 'good') status = 'diet_response_favorable';
  else status = 'gi_diet_review';
  return { status, d: req.diet_type };
}

function fecal_microbiota(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'ind', ['recurrent_c_diff','severe_c_diff','ulcerative_colitis','ibs','metabolic_syndrome','other']);
  ensureEnum(req.donor_source, 'donor', ['stool_bank','related_donor','unknown_donor','standardized_product','other']);
  ensureEnum(req.route, 'route', ['colonoscopy','upper_endoscopy','enema','oral_capsule','ng_tube','other']);
  ensureEnum(req.response, 'resp', ['resolved','partial','recurrence','failed','unknown']);
  ensureNumber(req.follow_up, 'fup');
  let status;
  if (req.indication === 'recurrent_c_diff' && req.response === 'resolved') status = 'fmt_successful_cdiff';
  else if (req.response === 'recurrence' && req.follow_up < 60) status = 'early_recurrence_repeat_fmt';
  else if (req.response === 'failed' && req.follow_up >= 90) status = 'fmt_failed_alternative_review';
  else status = 'fmt_review_appropriate';
  return { status, ind: req.indication };
}

function funcs() { return { malnutrition_screen, enteral_nutrition, parenteral_nutrition, gi_diet_therapy, fecal_microbiota }; }
module.exports = { funcs, ValidationError };