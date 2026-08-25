'use strict';
// TIER4_GERIATRICS-101 Geriatric Assessment
const CITATIONS = ['AGS_2024_Comprehensive_Assessment','USPSTF_Geriatric'];
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

function comprehensiveGeriatricAssessment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const functional_status = ensureEnum(input.functional_status || 'independent', ['independent','needs_assistance','dependent'], 'functional_status');
  const cognitive_screen = ensureEnum(input.cognitive_screen || 'mmse', ['mmse','moca','mini_cog','normal'], 'cognitive_screen');
  const falls_last_year = ensureNumber(input.falls_last_year || 0, 'falls_last_year');
  const polypharmacy = ensureNumber(input.polypharmacy || 0, 'polypharmacy');
  const domains = [];
  if (age >= 65) domains.push('comprehensive_assessment');
  if (functional_status !== 'independent') domains.push('functional_rehab');
  if (cognitive_screen !== 'normal') domains.push('cognitive_workup');
  if (falls_last_year > 0) domains.push('fall_prevention');
  if (polypharmacy >= 5) domains.push('medication_review');
  const recommendations = [];
  if (cognitive_screen !== 'normal') recommendations.push('cognitive_followup_3_6_months');
  if (falls_last_year >= 2) recommendations.push('multifactorial_fall_intervention');
  if (polypharmacy >= 5) recommendations.push('deprescribing_review_with_pharmacist');
  if (age >= 75) recommendations.push('goals_of_care_discussion');
  return { age, sex, functional_status, cognitive_screen, falls_last_year, polypharmacy, domains, recommendations, citations: CITATIONS };
}

function adlIadlScore(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const bathing = ensureNumber(input.bathing || 0, 'bathing');
  const dressing = ensureNumber(input.dressing || 0, 'dressing');
  const toileting = ensureNumber(input.toileting || 0, 'toileting');
  const transferring = ensureNumber(input.transferring || 0, 'transferring');
  const continence = ensureNumber(input.continence || 0, 'continence');
  const feeding = ensureNumber(input.feeding || 0, 'feeding');
  const telephone = ensureNumber(input.telephone || 0, 'telephone');
  const shopping = ensureNumber(input.shopping || 0, 'shopping');
  const food_prep = ensureNumber(input.food_prep || 0, 'food_prep');
  const housekeeping = ensureNumber(input.housekeeping || 0, 'housekeeping');
  const laundry = ensureNumber(input.laundry || 0, 'laundry');
  const transport = ensureNumber(input.transport || 0, 'transport');
  const medications = ensureNumber(input.medications || 0, 'medications');
  const finances = ensureNumber(input.finances || 0, 'finances');
  const adl_score = bathing + dressing + toileting + transferring + continence + feeding;
  const iadl_score = telephone + shopping + food_prep + housekeeping + laundry + transport + medications + finances;
  const adl_max = 6, iadl_max = 8;
  let adl_dep = 'independent';
  if (adl_score <= 2) adl_dep = 'severe_dependence';
  else if (adl_score <= 4) adl_dep = 'moderate_dependence';
  else if (adl_score < adl_max) adl_dep = 'mild_dependence';
  let iadl_dep = 'independent';
  if (iadl_score <= 2) iadl_dep = 'severe_dependence';
  else if (iadl_score <= 4) iadl_dep = 'moderate_dependence';
  else if (iadl_score < iadl_max) iadl_dep = 'mild_dependence';
  return { adl_score, adl_max, iadl_score, iadl_max, adl_dependence: adl_dep, iadl_dependence: iadl_dep, citations: CITATIONS };
}

module.exports = { comprehensiveGeriatricAssessment, adlIadlScore, CITATIONS, ValidationError };