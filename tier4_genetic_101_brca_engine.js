'use strict';
// TIER4_GENETIC-101 BRCA & Hereditary Cancer
const CITATIONS = ['NCCN_Hereditary_Breast_Ovarian','ACMG_BRCA_Testing'];
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

function brcaRiskAssessment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const breast_cancer_history = !!input.breast_cancer_history;
  const ovarian_cancer_history = !!input.ovarian_cancer_history;
  const family_breast_cancer = !!input.family_breast_cancer;
  const family_ovarian_cancer = !!input.family_ovarian_cancer;
  const ashkenazi_jewish = !!input.ashkenazi_jewish;
  const male_relative_breast = !!input.male_relative_breast;
  let risk_category = 'average';
  let testing_recommended = false;
  if (breast_cancer_history && age <= 50) { risk_category = 'high'; testing_recommended = true; }
  if (ovarian_cancer_history) { risk_category = 'high'; testing_recommended = true; }
  if (family_breast_cancer && family_ovarian_cancer) { risk_category = 'high'; testing_recommended = true; }
  if (ashkenazi_jewish && (family_breast_cancer || family_ovarian_cancer)) { risk_category = 'high'; testing_recommended = true; }
  if (male_relative_breast) { risk_category = 'high'; testing_recommended = true; }
  if (sex === 'female' && !testing_recommended) {
    if (age >= 40 && family_breast_cancer) { risk_category = 'moderate'; testing_recommended = true; }
  }
  const screening = risk_category === 'high'
    ? ['annual_breast_mri','annual_mammogram_10_years_earlier','risk_reducing_surgery_discussion']
    : risk_category === 'moderate'
    ? ['annual_mammogram','discuss_supplementary_mri']
    : ['routine_age_appropriate_screening'];
  return { age, sex, breast_cancer_history, ovarian_cancer_history, family_breast_cancer, family_ovarian_cancer, ashkenazi_jewish, male_relative_breast, risk_category, testing_recommended, screening, citations: CITATIONS };
}

function geneticCounselingNote(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const indication = ensureEnum(input.indication || 'family_history', ['family_history','personal_history','reproductive_planning','carrier_screening','prenatal','pharmacogenomic','unknown'], 'indication');
  const test_panel = ensureEnum(input.test_panel || 'brca1_brca2', ['brca1_brca2','comprehensive_cancer_panel','prenatal_panel','newborn_screen','carrier_screen','pgx_panel'], 'test_panel');
  const elements = [
    'family_history_3_generation',
    'informed_consent_testing',
    'discussion_of_results_possibilities',
    'psychosocial_assessment',
    'insurance_genetic_discrimination_review'
  ];
  return { indication, test_panel, elements, citations: CITATIONS };
}

module.exports = { brcaRiskAssessment, geneticCounselingNote, CITATIONS, ValidationError };