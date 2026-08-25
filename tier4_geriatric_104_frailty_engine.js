'use strict';
// TIER4_GERIATRICS-104 Frailty
const CITATIONS = ['Fried_Frailty_Phenotype','Clinical_Frailty_Scale'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function frailtyPhenotype(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const unintentional_weight_loss = !!input.unintentional_weight_loss;
  const exhaustion = !!input.exhaustion;
  const weakness = !!input.weakness;
  const slowness = !!input.slowness;
  const low_activity = !!input.low_activity;
  let positive_count = 0;
  if (unintentional_weight_loss) positive_count++;
  if (exhaustion) positive_count++;
  if (weakness) positive_count++;
  if (slowness) positive_count++;
  if (low_activity) positive_count++;
  let status = 'robust';
  if (positive_count >= 5) status = 'frail';
  else if (positive_count >= 3) status = 'pre_frail';
  const interventions = [];
  if (status === 'frail') interventions.push('comprehensive_geriatric_assessment');
  if (status === 'frail' || status === 'pre_frail') {
    interventions.push('protein_supplementation_1_2g_per_kg');
    interventions.push('resistance_training_program');
    interventions.push('medication_review_deprescribing');
  }
  return { unintentional_weight_loss, exhaustion, weakness, slowness, low_activity, positive_count, status, interventions, citations: CITATIONS };
}

function clinicalFrailtyScale(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const cfs_score = ensureNumber(input.cfs_score, 'cfs_score');
  let category = 'very_fit';
  if (cfs_score <= 1) category = 'very_fit';
  else if (cfs_score === 2) category = 'well';
  else if (cfs_score === 3) category = 'managing_well';
  else if (cfs_score === 4) category = 'vulnerable';
  else if (cfs_score === 5) category = 'mildly_frail';
  else if (cfs_score === 6) category = 'moderately_frail';
  else if (cfs_score === 7) category = 'severely_frail';
  else if (cfs_score === 8) category = 'very_severely_frail';
  else if (cfs_score === 9) category = 'terminally_ill';
  const surgery_outcome = cfs_score >= 5 ? 'increased_perioperative_risk' : 'standard_risk';
  return { cfs_score, category, surgery_outcome, citations: CITATIONS };
}

module.exports = { frailtyPhenotype, clinicalFrailtyScale, CITATIONS, ValidationError };