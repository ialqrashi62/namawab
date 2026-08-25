'use strict';
// TIER4_ENT_EXT-104 Tonsillitis
const CITATIONS = ['IDSA_Tonsillitis','AAFP_Centor'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function centorScore(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const tonsillar_exudate = !!input.tonsillar_exudate;
  const tender_anterior_cervical_nodes = !!input.tender_anterior_cervical_nodes;
  const fever_over_38 = !!input.fever_over_38;
  const absence_of_cough = !!input.absence_of_cough;
  let score = 0;
  if (tonsillar_exudate) score += 1;
  if (tender_anterior_cervical_nodes) score += 1;
  if (fever_over_38) score += 1;
  if (absence_of_cough) score += 1;
  const age_adjustment = (typeof input.age === 'number' && input.age < 15) ? +1 : (input.age && input.age >= 45) ? -1 : 0;
  const adjusted = score + age_adjustment;
  let management = 'no_antibiotics_throat_culture_if_available';
  if (adjusted >= 4) management = 'antibiotics_penicillin_or_amoxicillin';
  else if (adjusted >= 2) management = 'rapid_strep_test_and_treat_if_positive';
  return { tonsillar_exudate, tender_anterior_cervical_nodes, fever_over_38, absence_of_cough, raw_score: score, age_adjustment, adjusted_score: adjusted, management, citations: CITATIONS };
}

function peritonsillarAbscess(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const unilateral_swelling = !!input.unilateral_swelling;
  const uvula_deviated = !!input.uvula_deviated;
  const muffled_voice = !!input.muffled_voice;
  const trismus = !!input.trismus;
  const suspect = unilateral_swelling && (uvula_deviated || muffled_voice) ? 'high_suspicion' : 'low_suspicion';
  return { unilateral_swelling, uvula_deviated, muffled_voice, trismus, suspect, recommendation: suspect === 'high_suspicion' ? 'ENT_referral_needle_aspiration_or_I_D' : 'continue_antibiotics_reassess_24_48h', citations: CITATIONS };
}

module.exports = { centorScore, peritonsillarAbscess, CITATIONS, ValidationError };