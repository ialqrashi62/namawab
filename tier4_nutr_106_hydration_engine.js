'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { efsa: 'EFSA Hydration Guidelines 2010' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function hydration(input) {
  ensureObj(input, 'input');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const activity_level = ensureEnum(input.activity_level, ['sedentary','light','moderate','heavy','very_heavy'], 'activity_level');
  const climate = ensureEnum(input.climate, ['temperate','hot','very_hot'], 'climate');
  const fever = !!input.fever;
  const activity_factor = { sedentary: 30, light: 35, moderate: 40, heavy: 45, very_heavy: 50 }[activity_level];
  const climate_add = climate === 'temperate' ? 0 : climate === 'hot' ? 500 : 1000;
  const fever_add = fever ? 500 : 0;
  const total_ml = Math.round(weight_kg * activity_factor + climate_add + fever_add);
  const therapy = total_ml >= 3000 ? 'hydrate_aggressive_oral_v' : 'standard_oral_intake';
  return { weight_kg, activity_level, climate, fever, total_ml, therapy };
}

function electrolyteBalance(input) {
  ensureObj(input, 'input');
  const sodium = ensureNumber(input.sodium, 'sodium');
  const potassium = ensureNumber(input.potassium, 'potassium');
  const chloride = ensureNumber(input.chloride, 'chloride');
  const bicarbonate = ensureNumber(input.bicarbonate, 'bicarbonate');
  const sodium_disturbance = sodium < 135 || sodium > 145;
  const potassium_disturbance = potassium < 3.5 || potassium > 5.0;
  if (sodium_disturbance && potassium_disturbance) { return { sodium, potassium, chloride, bicarbonate, diagnosis: 'dual_electrolyte_disturbance', therapy: 'lab_workup_corrections' }; }
  if (sodium_disturbance) { return { sodium, potassium, chloride, bicarbonate, diagnosis: sodium < 135 ? 'hyponatremia' : 'hypernatremia', therapy: 'fluid_restriction_or_replacement' }; }
  if (potassium_disturbance) { return { sodium, potassium, chloride, bicarbonate, diagnosis: potassium < 3.5 ? 'hypokalemia' : 'hyperkalemia', therapy: 'supplement_or_correct' }; }
  return { sodium, potassium, chloride, bicarbonate, diagnosis: 'normal', therapy: 'maintain' };
}

module.exports = { hydration, electrolyteBalance, CITATIONS, ValidationError };
