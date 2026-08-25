'use strict';
// TIER4_GENETIC-106 Lyon Hypothesis / X-linked
const CITATIONS = ['Lyon_1962_Inactivation','EMQN_X_Linked'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function lyonInactivation(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const x_inactivation_pattern = ensureEnum(input.x_inactivation_pattern || 'not_applicable', ['not_applicable','random_50_50','skewed_under_80_20','extremely_skewed_under_10_90'], 'x_inactivation_pattern');
  const disease = ensureEnum(input.disease || 'fragile_x', ['fragile_x','hemophilia_a','duchenne_muscular_dystrophy','becker_muscular_dystrophy','fabry','rett_syndrome','x_linked_lymphoproliferative','x_linked_agammaglobulinemia'], 'disease');
  let implications = [];
  if (sex === 'female') {
    implications.push('heterozygous_carrier_may_show_partial_phenotype');
    if (x_inactivation_pattern === 'extremely_skewed_under_10_90') {
      implications.push('skewed_pattern_predominant_x_expression_significant_phenotype');
    }
    if (disease === 'rett_syndrome') {
      implications.push('random_x_inactivation_typically_lethal_in_males');
    }
  } else {
    implications.push('hemizygous_full_phenotype_expression');
  }
  return { sex, x_inactivation_pattern, disease, implications, citations: CITATIONS };
}

function xlinkedRecurrenceRisk(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const mother_carrier = ensureEnum(input.mother_carrier || 'carrier', ['carrier','not_carrier','unknown'], 'mother_carrier');
  const father_affected = ensureEnum(input.father_affected || 'not_affected', ['affected','not_affected','unknown'], 'father_affected');
  let sons_risk = 'low_population';
  let daughters_risk = 'low_population';
  if (mother_carrier === 'carrier') {
    sons_risk = '50_percent_affected';
    daughters_risk = '50_percent_carrier';
  }
  if (father_affected === 'affected') {
    daughters_risk = '100_percent_carrier_obligate';
    sons_risk = 'no_father_transmission_to_sons';
  }
  return { mother_carrier, father_affected, sons_risk, daughters_risk, citations: CITATIONS };
}

module.exports = { lyonInactivation, xlinkedRecurrenceRisk, CITATIONS, ValidationError };