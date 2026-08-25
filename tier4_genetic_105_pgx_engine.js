'use strict';
// TIER4_GENETIC-105 Pharmacogenomics
const CITATIONS = ['CPIC_2024','DPWG_Pharmacogenomics'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function cpicPhenotypeConvert(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const diplotype = ensureEnum(input.diplotype || '*1/*1', ['*1/*1','*1/*2','*1/*3','*2/*2','*2/*3','*3/*3','*1/*4','*4/*4','*1/*5','*5/*5'], 'diplotype');
  let phenotype = 'normal_metabolizer';
  if (diplotype === '*1/*1') phenotype = 'normal_metabolizer';
  else if (diplotype === '*1/*2' || diplotype === '*1/*3' || diplotype === '*1/*4' || diplotype === '*1/*5') phenotype = 'intermediate_metabolizer';
  else if (diplotype === '*2/*2' || diplotype === '*2/*3' || diplotype === '*3/*3' || diplotype === '*4/*4' || diplotype === '*5/*5') phenotype = 'poor_metabolizer';
  return { diplotype, phenotype, citations: CITATIONS };
}

function codeinePrescribing(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const cyp2d6_phenotype = ensureEnum(input.cyp2d6_phenotype || 'normal_metabolizer', ['ultra_rapid','normal_metabolizer','intermediate_metabolizer','poor_metabolizer','indeterminate'], 'cyp2d6_phenotype');
  let recommendation = 'standard_dose_per_label';
  let alternative = null;
  if (cyp2d6_phenotype === 'ultra_rapid') {
    recommendation = 'AVOID_codeine_morphine_toxicity_risk';
    alternative = 'non_opioid_or_hydrocodone_morphine_with_caution';
  } else if (cyp2d6_phenotype === 'poor_metabolizer') {
    recommendation = 'AVOID_codeine_ineffective_risk';
    alternative = 'non_opioid_alternative';
  } else if (cyp2d6_phenotype === 'intermediate_metabolizer') {
    recommendation = 'use_with_caution_monitor_efficacy';
  }
  return { cyp2d6_phenotype, recommendation, alternative, citations: CITATIONS };
}

module.exports = { cpicPhenotypeConvert, codeinePrescribing, CITATIONS, ValidationError };