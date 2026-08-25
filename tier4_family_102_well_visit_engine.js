'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aafp_wellness: 'AAFP Wellness Exam 2019' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function wellVisitAdult(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const last_visit_months = ensureNumber(input.last_visit_months, 'last_visit_months');
  const intervals = [];
  if (last_visit_months > 24) { intervals.push('overdue_full_visit'); }
  else if (last_visit_months >= 12) { intervals.push('annual_due'); }
  else { intervals.push('routine_followup'); }
  const components = ['blood_pressure','weight_bmi','depression_screen','substance_screen'];
  if (sex === 'female' && age >= 50) { components.push('mammography'); }
  if (sex === 'female' && age >= 21 && age <= 65) { components.push('cervical_screening'); }
  if (sex === 'male' && age >= 50) { components.push('shared_decision_psa'); }
  if (age >= 50) { components.push('colorectal_screening'); }
  return { age, sex, last_visit_months, intervals, components, citations:['aafp_wellness'] };
}

function developmentalMilestones(input) {
  ensureObj(input, 'input');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const milestones_met = input.milestones_met || [];
  const social_smile = !!input.social_smile;
  const language_words = ensureNumber(input.language_words, 'language_words');
  const gross_motor = ensureEnum(input.gross_motor, ['unknown','onset','walking','running','climbing'], 'gross_motor');
  let delay;
  if (age_months >= 18 && language_words < 5) { delay = 'speech_delay_referral'; }
  else if (age_months >= 18 && !social_smile) { delay = 'social_developmental_referral'; }
  else { delay = 'within_normal'; }
  return { age_months, milestones_met, social_smile, language_words, gross_motor, delay };
}

module.exports = { wellVisitAdult, developmentalMilestones, CITATIONS, ValidationError };
