'use strict';
// TIER4_SURG-102 Perioperative Assessment
const CITATIONS = ['NSQIP_Risk','ACS_Optimal'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function nsqipMortalityRisk(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const asa_class = ensureNumber(input.asa_class || 2, 'asa_class');
  const emergency = !!input.emergency;
  let risk_score = 0;
  if (age >= 70) risk_score += 3;
  else if (age >= 60) risk_score += 1;
  if (asa_class === 4 || asa_class === 5) risk_score += 3;
  else if (asa_class === 3) risk_score += 1;
  if (emergency) risk_score += 2;
  let risk_pct = risk_score;
  let risk_category = 'low';
  if (risk_score >= 5) risk_category = 'high';
  else if (risk_score >= 3) risk_category = 'moderate';
  return { age, asa_class, emergency, risk_score, risk_pct, risk_category, citations: CITATIONS };
}

function surgicalSiteInfectionRisk(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const surgery_class = input.surgery_class || 'clean';
  const diabetes = !!input.diabetes;
  const bmi = ensureNumber(input.bmi || 25, 'bmi');
  const smoking = !!input.smoking;
  let risk_score = 0;
  if (surgery_class === 'contaminated' || surgery_class === 'dirty') risk_score += 3;
  if (diabetes) risk_score += 1;
  if (bmi >= 35) risk_score += 1;
  if (smoking) risk_score += 1;
  return { surgery_class, diabetes, bmi, smoking, risk_score, citations: CITATIONS };
}

module.exports = { nsqipMortalityRisk, surgicalSiteInfectionRisk, CITATIONS, ValidationError };