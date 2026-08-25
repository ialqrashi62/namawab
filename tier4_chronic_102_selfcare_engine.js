'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { ada_self: 'ADA Self-Care 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function selfManagementSupport(input) {
  ensureObj(input, 'input');
  const self_efficacy = ensureNumber(input.self_efficacy, 'self_efficacy');
  const knowledge_of_condition = ensureNumber(input.knowledge_of_condition, 'knowledge_of_condition');
  const skill_use = ensureNumber(input.skill_use, 'skill_use');
  const social_support = ensureNumber(input.social_support, 'social_support');
  const total = self_efficacy + knowledge_of_condition + skill_use + social_support;
  let tier;
  if (total >= 16) { tier = 'high_self_manager'; }
  else if (total >= 12) { tier = 'moderate_support'; }
  else if (total >= 8) { tier = 'frequent_support'; }
  else { tier = 'intensive_case_management'; }
  return { self_efficacy, knowledge_of_condition, skill_use, social_support, total, tier };
}

function adherence(input) {
  ensureObj(input, 'input');
  const missed_doses_per_week = ensureNumber(input.missed_doses_per_week, 'missed_doses_per_week');
  const prescribed_doses_per_week = ensureNumber(input.prescribed_doses_per_week, 'prescribed_doses_per_week');
  const mmas_score = ensureNumber(input.mmas_score, 'mmas_score');
  let adherence_rate;
  if (prescribed_doses_per_week > 0) { adherence_rate = Math.round((1 - (missed_doses_per_week / prescribed_doses_per_week)) * 1000) / 10; }
  else { adherence_rate = 100; }
  let category;
  if (mmas_score >= 8) { category = 'high_adherence'; }
  else if (mmas_score >= 6) { category = 'moderate_adherence'; }
  else if (mmas_score >= 4) { category = 'low_adherence'; }
  else { category = 'poor_adherence'; }
  return { missed_doses_per_week, prescribed_doses_per_week, mmas_score, adherence_rate, category };
}

module.exports = { selfManagementSupport, adherence, CITATIONS, ValidationError };
