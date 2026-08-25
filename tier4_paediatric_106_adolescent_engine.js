'use strict';
// TIER4_PAEDIATRIC-106 Adolescent
const CITATIONS = ['AAP_Adolescent_Health','HEEADSSS_Assessment'];
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

function heeadsssScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  if (age < 10 || age > 21) throw new ValidationError('HEEADSSS screening age 10-21 years');
  const home_environment = ensureEnum(input.home_environment || 'stable', ['stable','supportive','conflict','unsafe'], 'home_environment');
  const education_performance = ensureEnum(input.education_performance || 'good', ['excellent','good','declining','poor'], 'education_performance');
  const eating_pattern = ensureEnum(input.eating_pattern || 'normal', ['normal','restrictive','binge','purging','disordered'], 'eating_pattern');
  const activities_peer = ensureEnum(input.activities_peer || 'typical', ['typical','isolated','excessive','risky','team_oriented'], 'activities_peer');
  const drug_use = ensureEnum(input.drug_use || 'none', ['none','alcohol','cannabis','tobacco','prescription','illicit'], 'drug_use');
  const sexual_activity = ensureEnum(input.sexual_activity || 'none', ['none','thoughts','active','multiple_partners','msm','pregnant'], 'sexual_activity');
  const suicidal_ideation = !!input.suicidal_ideation;
  const safety_violence = !!input.safety_violence;
  let risk_score = 0;
  if (home_environment === 'unsafe') risk_score += 3;
  else if (home_environment === 'conflict') risk_score += 1;
  if (eating_pattern === 'restrictive' || eating_pattern === 'purging' || eating_pattern === 'disordered') risk_score += 3;
  if (drug_use !== 'none') risk_score += 2;
  if (sexual_activity === 'multiple_partners' || sexual_activity === 'msm') risk_score += 1;
  if (suicidal_ideation) risk_score += 4;
  if (safety_violence) risk_score += 3;
  let risk_level = 'low';
  if (risk_score >= 6) risk_level = 'high';
  else if (risk_score >= 3) risk_level = 'moderate';
  return { age, home_environment, education_performance, eating_pattern, activities_peer, drug_use, sexual_activity, suicidal_ideation, safety_violence, risk_score, risk_level, citations: CITATIONS };
}

function adolescentImmunization(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const vaccines = ['Tdap','HPV','MenACWY','MenB','Influenza','COVID19','HepA','HepB','MMR','Varicella'];
  const needed = [];
  if (age >= 11 && age < 12) needed.push('Tdap_booster','HPV_series_initiate','MenACWY_first');
  if (age >= 16) needed.push('MenACWY_booster','HPV_series_complete','MenB_discuss');
  if (age >= 13 && age < 15) needed.push('HPV_catchup_if_not_initiated');
  needed.push('annual_influenza');
  return { age, vaccines_recommended: vaccines, needed, citations: CITATIONS };
}

module.exports = { heeadsssScreening, adolescentImmunization, CITATIONS, ValidationError };