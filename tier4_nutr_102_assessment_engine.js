'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aspEN: 'ASPEN Adult Nutrition 2016' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function malnutritionUniversal(input) {
  ensureObj(input, 'input');
  const unintentional_weight_loss_pct = ensureNumber(input.unintentional_weight_loss_pct, 'unintentional_weight_loss_pct');
  const bmi = ensureNumber(input.bmi, 'bmi');
  const muscle_loss = !!input.muscle_loss;
  const fat_loss = !!input.fat_loss;
  let malnutrition;
  if (bmi < 18.5 || unintentional_weight_loss_pct >= 10) { malnutrition = 'severe_malnutrition'; }
  else if (unintentional_weight_loss_pct >= 5 || (bmi >= 18.5 && bmi < 20) || muscle_loss || fat_loss) { malnutrition = 'moderate_malnutrition'; }
  else if (unintentional_weight_loss_pct >= 5) { malnutrition = 'mild_malnutrition'; }
  else { malnutrition = 'no_malnutrition'; }
  return { unintentional_weight_loss_pct, bmi, muscle_loss, fat_loss, malnutrition, citations:['aspEN'] };
}

function calorieNeeds(input) {
  ensureObj(input, 'input');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const height_cm = ensureNumber(input.height_cm, 'height_cm');
  const age = ensureNumber(input.age, 'age');
  const is_female = !!input.is_female;
  const activity_factor = ensureNumber(input.activity_factor, 'activity_factor');
  const bmr = (is_female ? 655.1 : 66.5) + (9.563 * weight_kg) + (1.85 * height_cm) - (4.676 * age);
  const tdee = Math.round(bmr * activity_factor);
  let goal;
  if (input.stress_factor) { goal = Math.round(tdee * input.stress_factor); }
  else { goal = tdee; }
  return { weight_kg, height_cm, age, is_female, activity_factor, bmr: Math.round(bmr), tdee, goal };
}

module.exports = { malnutritionUniversal, calorieNeeds, CITATIONS, ValidationError };
