'use strict';
// TIER4_SURG-101 Preoperative
const CITATIONS = ['ASA_Physical_Status','ASA_NPO_2017'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function asaClassification(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const comorbidities = !!input.comorbidities;
  const severe_systemic_disease = !!input.severe_systemic_disease;
  const life_threatening = !!input.life_threatening;
  const moribund = !!input.moribund;
  const brain_death = !!input.brain_death;
  const emergency = !!input.emergency;
  let asa_class = 1;
  let description = 'normal_healthy';
  if (moribund) { asa_class = 5; description = 'moribund_without_surgery'; }
  else if (life_threatening) { asa_class = 4; description = 'severe_systemic_disease_constant_threat'; }
  else if (severe_systemic_disease) { asa_class = 3; description = 'severe_systemic_disease'; }
  else if (comorbidities) { asa_class = 2; description = 'mild_systemic_disease'; }
  if (emergency) asa_class = asa_class + 1;
  return { asa_class, description, emergency, citations: CITATIONS };
}

function npoGuideline(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const surgery_type = ensureEnum(input.surgery_type || 'elective', ['elective','emergency','gi_endoscopy'], 'surgery_type');
  const diabetic = !!input.diabetic;
  let clear_liquids_hours = 2;
  let light_meal_hours = 6;
  let heavy_meal_hours = 8;
  if (diabetic) light_meal_hours = 6;
  return { surgery_type, clear_liquids_hours, light_meal_hours, heavy_meal_hours, citations: CITATIONS };
}

module.exports = { asaClassification, npoGuideline, CITATIONS, ValidationError };