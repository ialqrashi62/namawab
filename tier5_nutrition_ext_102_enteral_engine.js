'use strict';
// TIER5_NUTRITION_EXT-102: Enteral nutrition formula + rate calculator
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ASPEN_Enteral_2017', 'ESPEN_Enteral_2020'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function rate_calc(req) {
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.calorie_needs_kcal_kg, 'calorie_needs_kcal_kg');
  ensureNumber(req.formula_density_kcal_ml, 'formula_density_kcal_ml');
  ensureStr(req.formula, 'formula'); // standard_1 | high_protein_1_5 | renal_low_protein_2 | fiber_1_2 | diabetic_1
  ensureNumber(req.hours_per_day, 'hours_per_day');
  ensureBool(req.bolus_or_continuous, 'bolus_or_continuous');
  const bolus_or_continuous = req.bolus_or_continuous;

  const total_kcal = req.weight_kg * req.calorie_needs_kcal_kg;
  const total_volume = total_kcal / req.formula_density_kcal_ml;
  const rate_ml_per_hour = total_volume / req.hours_per_day;
  const bolus_volume = total_volume / 6; // typical 6 boluses/day
  const initiation_rate = bolus_or_continuous ? Math.min(rate_ml_per_hour, 50) : Math.min(bolus_volume, 250);
  const advance_target = rate_ml_per_hour;
  return {
    weight_kg: req.weight_kg,
    total_kcal,
    total_volume_ml: Math.round(total_volume),
    rate_ml_per_hour: Math.round(rate_ml_per_hour),
    bolus_volume_ml: Math.round(bolus_volume),
    initiation_rate_ml: Math.round(initiation_rate),
    advance_to_target_ml_per_hour: Math.round(advance_target),
    protocol: 'start_at_initiation_rate_advance_q6h_to_target',
    citations: CITATIONS,
  };
}

function formula_choice(req) {
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.ckd_stage_5, 'ckd_stage_5');
  ensureBool(req.dysphagia_thickened, 'dysphagia_thickened');
  ensureBool(req.immobility_constipation, 'immobility_constipation');
  ensureBool(req.malnutrition_severe, 'malnutrition_severe');
  ensureBool(req.hypoalbuminemia, 'hypoalbuminemia');

  let formula, rationale;
  if (req.ckd_stage_5) { formula = 'renal_low_protein_2_kcal_ml'; rationale = 'low_protein_to_delay_dialysis_low_electrolyte_load'; }
  else if (req.diabetes) { formula = 'diabetic_1_kcal_ml_with_low_glycemic_index_carbs'; rationale = 'glycemic_control'; }
  else if (req.immobility_constipation) { formula = 'fiber_1_2_kcal_ml'; rationale = 'bowel_regularity'; }
  else if (req.malnutrition_severe || req.hypoalbuminemia) { formula = 'high_protein_1_5_kcal_ml'; rationale = 'high_protein_for_anabolic_need'; }
  else { formula = 'standard_1_kcal_ml'; rationale = 'standard_needs'; }
  return { formula, rationale, citations: CITATIONS };
}

module.exports = { rate_calc, formula_choice, CITATIONS, ValidationError };