'use strict';
// TIER4_GENETIC-102 Prenatal Screening
const CITATIONS = ['ACOG_Prenatal_Screening','ACMG_2024_Prenatal'];
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

function cellFreeDnaScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const gestational_weeks = ensureNumber(input.gestational_weeks, 'gestational_weeks');
  const maternal_age = ensureNumber(input.maternal_age, 'maternal_age');
  const previous_trisomy = !!input.previous_trisomy;
  const ultrasound_abnormality = !!input.ultrasound_abnormality;
  const test_result = ensureEnum(input.test_result || 'low_risk', ['low_risk','high_risk_trisomy_21','high_risk_trisomy_18','high_risk_trisomy_13','no_call','test_failure'], 'test_result');
  let follow_up = 'routine_continuation_of_pregnancy_care';
  if (test_result === 'high_risk_trisomy_21' || test_result === 'high_risk_trisomy_18' || test_result === 'high_risk_trisomy_13') {
    follow_up = 'genetic_counseling_and_diagnostic_testing_amniocentesis_or_cvs';
  }
  if (test_result === 'no_call' || test_result === 'test_failure') follow_up = 'offer_diagnostic_testing_or_repeat_draw_2_weeks';
  const recommended = gestational_weeks >= 10 && (maternal_age >= 35 || previous_trisomy || ultrasound_abnormality);
  return { gestational_weeks, maternal_age, previous_trisomy, ultrasound_abnormality, test_result, recommended, follow_up, citations: CITATIONS };
}

function firstTrimesterScreen(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const gestational_weeks = ensureNumber(input.gestational_weeks, 'gestational_weeks');
  const nt_mm = ensureNumber(input.nt_mm || 0, 'nt_mm');
  const bhcg_mom = ensureNumber(input.bhcg_mom || 0, 'bhcg_mom');
  const papp_a_mom = ensureNumber(input.papp_a_mom || 0, 'papp_a_mom');
  let risk_trisomy_21 = 'low';
  if (nt_mm >= 3.5) risk_trisomy_21 = 'high';
  if (bhcg_mom >= 2.5 && papp_a_mom <= 0.4) risk_trisomy_21 = 'high';
  if (bhcg_mom >= 2.0 && papp_a_mom <= 0.5 && nt_mm >= 3.0) risk_trisomy_21 = 'high';
  return { gestational_weeks, nt_mm, bhcg_mom, papp_a_mom, risk_trisomy_21, follow_up: risk_trisomy_21 === 'high' ? 'genetic_counseling_cell_free_dna_or_diagnostic_testing' : 'continue_routine_care', citations: CITATIONS };
}

module.exports = { cellFreeDnaScreening, firstTrimesterScreen, CITATIONS, ValidationError };