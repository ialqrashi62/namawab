'use strict';
// TIER4_REPRO-106 PCOS
const CITATIONS = ['Rotterdam_PCOS_Criteria','ACOG_PCOS'];
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

function rotterdamCriteria(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const oligo_or_anovulation = !!input.oligo_or_anovulation;
  const hyperandrogenism_clinical_or_biochemical = !!input.hyperandrogenism_clinical_or_biochemical;
  const polycystic_ovaries_on_us = !!input.polycystic_ovaries_on_us;
  let criteria_count = 0;
  if (oligo_or_anovulation) criteria_count++;
  if (hyperandrogenism_clinical_or_biochemical) criteria_count++;
  if (polycystic_ovaries_on_us) criteria_count++;
  const diagnosis = (criteria_count >= 2) ? 'pcos_diagnosed_exclude_other_causes' : 'criteria_not_met';
  const phenotypes = {
    'classic': oligo_or_anovulation && hyperandrogenism_clinical_or_biochemical,
    'ovulatory': oligo_or_anovulation && polycystic_ovaries_on_us,
    'hyperandrogenic': hyperandrogenism_clinical_or_biochemical && polycystic_ovaries_on_us,
    'classic_full': oligo_or_anovulation && hyperandrogenism_clinical_or_biochemical && polycystic_ovaries_on_us
  };
  return { oligo_or_anovulation, hyperandrogenism_clinical_or_biochemical, polycystic_ovaries_on_us, criteria_count, diagnosis, phenotypes, citations: CITATIONS };
}

function pcosManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const goal = ensureEnum(input.goal || 'reproductive', ['reproductive','metabolic','cosmetic'], 'goal');
  let recommendation = 'lifestyle_modification_weight_loss_5_to_10_percent';
  if (goal === 'reproductive') recommendation = 'letrozole_first_line_for_ovulation_or_clomiphene';
  if (goal === 'metabolic') recommendation = 'metformin_for_insulin_resistance';
  if (goal === 'cosmetic') recommendation = 'combined_oral_contraceptive_or_spironolactone_for_hyperandrogenism';
  return { goal, recommendation, citations: CITATIONS };
}

module.exports = { rotterdamCriteria, pcosManagement, CITATIONS, ValidationError };