'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aasm_osa: 'AASM OSA Treatment 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function stopBang(input) {
  ensureObj(input, 'input');
  const snoring = !!input.snoring;
  const tired = !!input.tired;
  const observed_apnea = !!input.observed_apnea;
  const high_blood_pressure = !!input.high_blood_pressure;
  const bmi = ensureNumber(input.bmi, 'bmi');
  const age = ensureNumber(input.age, 'age');
  const neck_cm = ensureNumber(input.neck_cm, 'neck_cm');
  const male = !!input.male;
  const score = (snoring?1:0) + (tired?1:0) + (observed_apnea?1:0) + (high_blood_pressure?1:0) + (bmi >= 35 ? 1 : 0) + (age >= 50 ? 1 : 0) + (neck_cm >= 40 ? 1 : 0) + (male ? 1 : 0);
  let risk;
  if (score >= 5) { risk = 'high_risk_osa'; }
  else if (score >= 3) { risk = 'intermediate_risk'; }
  else { risk = 'low_risk'; }
  return { snoring, tired, observed_apnea, high_blood_pressure, bmi, age, neck_cm, male, score, risk, citations:['aasm_osa'] };
}

function osaSeverity(input) {
  ensureObj(input, 'input');
  const ahi = ensureNumber(input.ahi, 'ahi');
  let severity;
  if (ahi < 5) { severity = 'normal'; }
  else if (ahi < 15) { severity = 'mild'; }
  else if (ahi < 30) { severity = 'moderate'; }
  else { severity = 'severe'; }
  let therapy;
  if (severity === 'normal') { therapy = 'no_treatment'; }
  else if (severity === 'mild') { therapy = 'lifestyle_position_therapy'; }
  else if (severity === 'moderate') { therapy = 'cpap_or_mad'; }
  else { therapy = 'cpap_strongly_recommended'; }
  return { ahi, severity, therapy };
}

module.exports = { stopBang, osaSeverity, CITATIONS, ValidationError };
