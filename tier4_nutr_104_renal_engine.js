'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { kdoqi: 'KDOQI Nutrition 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function renalNutrition(input) {
  ensureObj(input, 'input');
  const ckd_stage = ensureNumber(input.ckd_stage, 'ckd_stage');
  const on_dialysis = !!input.on_dialysis;
  const potassium = ensureNumber(input.potassium, 'potassium');
  const phosphorus = ensureNumber(input.phosphorus, 'phosphorus');
  let protein_intake;
  if (ckd_stage >= 5 || on_dialysis) { protein_intake = '1.0_1.2_g_per_kg'; }
  else if (ckd_stage >= 3) { protein_intake = '0.8_g_per_kg'; }
  else { protein_intake = 'normal_0.8_g_per_kg'; }
  let potassium_restriction = potassium >= 5.0;
  let phosphorus_restriction = phosphorus >= 5.5;
  return { ckd_stage, on_dialysis, potassium, phosphorus, protein_intake, potassium_restriction, phosphorus_restriction, citations:['kdoqi'] };
}

function diabeticNutrition(input) {
  ensureObj(input, 'input');
  const hba1c = ensureNumber(input.hba1c, 'hba1c');
  const carb_counting = !!input.carb_counting;
  const glycemic_index_awareness = !!input.glycemic_index_awareness;
  const meal_pattern = ensureEnum(input.meal_pattern, ['regular','snacking','intermittent_fasting','chaotic'], 'meal_pattern');
  let carb_plan;
  if (hba1c >= 8) { carb_plan = '45_50_pct_carb_strict_counting'; }
  else if (hba1c >= 7) { carb_plan = '50_pct_carb_consistent_counting'; }
  else { carb_plan = '50_55_pct_carb_with_gi_awareness'; }
  const therapy = meal_pattern === 'chaotic' ? 'establish_regular_pattern_first' : 'carb_distribution_throughout_day';
  return { hba1c, carb_counting, glycemic_index_awareness, meal_pattern, carb_plan, therapy };
}

module.exports = { renalNutrition, diabeticNutrition, CITATIONS, ValidationError };
