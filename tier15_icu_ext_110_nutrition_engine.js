// filepath: tier15_icu_ext_110_nutrition_engine.js
// TIER15_ICU_EXT-110: ICU nutrition & glycemic control
'use strict';

const CITATIONS = ['ASPEN_ICU_2024','ESPEN_ICU_2024','ADA_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function icu_nutrition_assess(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.height_cm, 'height_cm');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.bmi, 'bmi');
  ensureEnum(req.nutrition_route, 'nutrition_route', ['oral','enteral_ngt','enteral_pgt','enteral_jejunal','parenteral_pn','combined_en_pn','tpn_only','pending','not_appropriate','other']);
  ensureBool(req.energy_requirement_calculated, 'energy_requirement_calculated');
  ensureNumber(req.energy_target_kcal_per_kg, 'energy_target_kcal_per_kg');
  ensureNumber(req.protein_target_g_per_kg, 'protein_target_g_per_kg');
  ensureNumber(req.days_since_icu_admission, 'days_since_icu_admission');

  let status;
  if (req.days_since_icu_admission > 2 && req.nutrition_route === 'pending') status = 'over_48h_unfed_start_now';
  else if (req.bmi < 18.5 && req.days_since_icu_admission > 3) status = 'underweight_protein_review';
  else if (req.bmi >= 30 && req.energy_target_kcal_per_kg > 25) status = 'obese_avoid_overfeeding_hypocaloric';
  else if (!req.energy_requirement_calculated) status = 'energy_requirement_not_calculated';
  else if (req.nutrition_route === 'not_appropriate') status = 'not_appropriate_review_palliative';
  else status = 'nutrition_assessed';
  return { status, route: req.nutrition_route };
}

function icu_enteral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.rate_ml_per_h, 'rate_ml_per_h');
  ensureNumber(req.goal_rate_ml_per_h, 'goal_rate_ml_per_h');
  ensureNumber(req.residual_volume_ml, 'residual_volume_ml');
  ensureNumber(req.fluid_today_ml, 'fluid_today_ml');
  ensureBool(req.hob_30, 'hob_30');
  ensureEnum(req.feeding_tolerance, 'feeding_tolerance', ['tolerating','grv_high','grv_500_plus','aspiration_suspected','abdominal_distension','diarrhea','ileus','other']);
  ensureEnum(req.formula, 'formula', ['standard_isotonic','standard_fiber','high_protein','diabetic','renal','hepatic','pulmonary','immune_modulating','elemental','other']);

  let status;
  if (req.feeding_tolerance === 'grv_500_plus') status = 'grv_over_500ml_hold_review';
  else if (req.feeding_tolerance === 'aspiration_suspected') status = 'aspiration_suspected_jejunal';
  else if (!req.hob_30) status = 'head_of_bed_required_30deg';
  else if (req.rate_ml_per_h < req.goal_rate_ml_per_h * 0.5) status = 'under_goal_titrate_up';
  else if (req.rate_ml_per_h >= req.goal_rate_ml_per_h) status = 'at_goal_monitor';
  else status = 'enteral_feeding_appropriate';
  return { status, tolerance: req.feeding_tolerance };
}

function icu_parenteral(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.dextrose_pct, 'dextrose_pct');
  ensureNumber(req.protein_g_per_kg, 'protein_g_per_kg');
  ensureNumber(req.lipid_g_per_kg, 'lipid_g_per_kg');
  ensureNumber(req.total_kcal_per_kg, 'total_kcal_per_kg');
  ensureBool(req.central_line, 'central_line');
  ensureBool(req.micronutrients_added, 'micronutrients_added');
  ensureEnum(req.indication, 'indication', ['bowel_obstruction','perforation','ischemia','severe_malabsorption','high_output_fistula','failed_enteral','short_bowel','gi_surgery','other']);

  let status;
  if (req.indication === 'failed_enteral' && req.protein_g_per_kg < 1.2) status = 'failed_enteral_low_protein_increase';
  else if (!req.micronutrients_added) status = 'micronutrients_required_tpn';
  else if (req.lipid_g_per_kg > 1.5) status = 'lipid_over_1.5g_per_kg_overfeeding';
  else if (req.total_kcal_per_kg > 35) status = 'overfeeding_carbon_dioxide_retention';
  else if (req.indication === 'short_bowel') status = 'short_bowel_review_specialty';
  else status = 'tpn_appropriate';
  return { status, kcal: req.total_kcal_per_kg };
}

function icu_glycemic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.bg_current_mg_dl, 'bg_current_mg_dl');
  ensureNumber(req.bg_mean_24h_mg_dl, 'bg_mean_24h_mg_dl');
  ensureNumber(req.bg_variability_pct, 'bg_variability_pct');
  ensureBool(req.on_insulin_drip, 'on_insulin_drip');
  ensureEnum(req.target_band, 'target_band', ['tight_80_110','moderate_110_150','loose_140_180','avoid_hypo','custom','not_set','other']);
  ensureNumber(req.hypo_events_24h, 'hypo_events_24h');

  let status;
  if (req.bg_current_mg_dl < 70 || req.hypo_events_24h > 0) status = 'hypoglycemia_reduce_insulin';
  else if (req.bg_current_mg_dl > 180 && !req.on_insulin_drip) status = 'hyperglycemia_start_insulin';
  else if (req.bg_variability_pct > 30) status = 'high_variability_review_protocol';
  else if (req.target_band === 'tight_80_110' && req.hypo_events_24h > 0) status = 'tight_target_with_hypo_relax';
  else if (req.bg_mean_24h_mg_dl > 180) status = 'mean_high_protocol_review';
  else status = 'glycemic_in_target';
  return { status, bg: req.bg_current_mg_dl };
}

function icu_pressure_injury(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.braden_score, 'braden_score');
  ensureEnum(req.braden_risk, 'braden_risk', ['no_risk_19_plus','mild_15_18','moderate_13_14','high_10_12','very_high_9_or_less','not_assessed','other']);
  ensureBool(req.turned_2h, 'turned_2h');
  ensureBool(req.heel_offloading, 'heel_offloading');
  ensureBool(req.skin_assessed_daily, 'skin_assessed_daily');
  ensureBool(req.special_surface, 'special_surface');

  let status;
  if (req.braden_score <= 9 && !req.special_surface) status = 'very_high_no_surface_add_now';
  else if (!req.turned_2h && req.braden_score <= 14) status = 'no_turning_2h_high_risk';
  else if (!req.heel_offloading && req.braden_score <= 12) status = 'heel_offloading_required';
  else if (!req.skin_assessed_daily) status = 'daily_skin_assessment_required';
  else if (req.braden_score >= 19) status = 'low_risk_maintain';
  else status = 'prevention_in_place';
  return { status, braden: req.braden_score };
}

function funcs() { return { icu_nutrition_assess, icu_enteral, icu_parenteral, icu_glycemic, icu_pressure_injury }; }
module.exports = { funcs, CITATIONS, ValidationError };