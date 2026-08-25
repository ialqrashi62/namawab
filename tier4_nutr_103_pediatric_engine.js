'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aap_ped: 'AAP Pediatric Nutrition Handbook 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function infantFormula(input) {
  ensureObj(input, 'input');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const feedings_per_day = ensureNumber(input.feedings_per_day, 'feedings_per_day');
  const formula_type = ensureEnum(input.formula_type, ['standard','preterm','hydrolyzed','soy','amino_acid'], 'formula_type');
  const cow_milk_allergy = !!input.cow_milk_allergy;
  let formula;
  if (cow_milk_allergy || formula_type === 'amino_acid') { formula = 'amino_acid_neocate'; }
  else if (formula_type === 'hydrolyzed') { formula = 'extensively_hydrolyzed'; }
  else if (age_months < 6) { formula = 'standard_breast_first'; }
  else { formula = 'standard_cow_milk_based'; }
  const daily_volume_ml = Math.round(weight_kg * 150);
  return { age_months, weight_kg, feedings_per_day, formula_type, cow_milk_allergy, formula, daily_volume_ml, citations:['aap_ped'] };
}

function failureToThrive(input) {
  ensureObj(input, 'input');
  const weight_z_score = ensureNumber(input.weight_z_score, 'weight_z_score');
  const height_z_score = ensureNumber(input.height_z_score, 'height_z_score');
  const caloric_intake_pct = ensureNumber(input.caloric_intake_pct, 'caloric_intake_pct');
  const chronic_illness = !!input.chronic_illness;
  let severity;
  if (weight_z_score < -3) { severity = 'severe_malnutrition'; }
  else if (weight_z_score < -2) { severity = 'moderate_faltering'; }
  else if (weight_z_score < -1.5) { severity = 'mild_faltering'; }
  else { severity = 'normal_growth'; }
  const therapy = chronic_illness ? 'medical_workup_high_cal_density_feeding' : severity === 'severe_malnutrition' ? 'high_cal_density_supplementation_with_caution' : 'enhanced_feeding_counseling';
  return { weight_z_score, height_z_score, caloric_intake_pct, chronic_illness, severity, therapy };
}

module.exports = { infantFormula, failureToThrive, CITATIONS, ValidationError };
