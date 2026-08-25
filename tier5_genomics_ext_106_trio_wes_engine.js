'use strict';
// TIER5_GENOMICS_EXT-106: Trio WES / WGS interpretation
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACMG_SF_2021', 'ACMG_SF_v3_2021'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function indication(req) {
  ensureNumber(req.patient_age, 'patient_age');
  ensureStr(req.phenotype, 'phenotype'); // multiple_congenital_anomalies | intellectual_disability | autism_spectrum | metabolic | neurological | non_specific
  ensureBool(req.consanguinity, 'consanguinity');
  ensureBool(req.previous_targeted_testing_negative, 'previous_targeted_testing_negative');
  ensureBool(req.family_history, 'family_history');

  const meets = req.phenotype !== 'non_specific' || req.consanguinity || req.family_history;
  let test_choice;
  if (req.consanguinity) test_choice = 'autozygome_mapping_plus_exome_with_focus_on_homozygous_variants';
  else if (req.phenotype === 'multiple_congenital_anomalies') test_choice = 'trio_exome_strongly_recommended';
  else if (req.phenotype === 'intellectual_disability' || req.phenotype === 'autism_spectrum') test_choice = 'trio_exome_with_cma_first';
  else if (req.phenotype === 'metabolic' || req.phenotype === 'neurological') test_choice = 'trio_exome_with_metabolic_panel_or_mitochondrial_genome';
  else test_choice = 'cma_then_consider_exome';
  return {
    meets_criteria: meets && req.previous_targeted_testing_negative,
    test_choice,
    reanalysis_recommendation: 'reanalysis_q12_to_18_months_if_no_diagnosis',
    citations: CITATIONS,
  };
}

function variant_interpret(req) {
  ensureStr(req.variant_classification, 'variant_classification'); // pathogenic | lp | vus | lb | benign
  ensureBool(req.de_novo, 'de_novo');
  ensureStr(req.inheritance_pattern, 'inheritance_pattern'); // ad | ar | x_linked | y_linked | mitochondrial | unknown
  ensureStr(req.zygosity, 'zygosity'); // het | hom | hemi
  ensureBool(req.phase_with_partner, 'phase_with_partner');

  let interpretation, action;
  if (req.variant_classification === 'pathogenic' || req.variant_classification === 'lp') {
    if (req.de_novo && (req.inheritance_pattern === 'ad' || req.inheritance_pattern === 'unknown')) {
      interpretation = 'strong_evidence_for_diagnosis';
      action = 'correlate_with_phenotype_confirmatory_testing_medical_management';
    } else if (req.inheritance_pattern === 'ar' && req.zygosity === 'hom' && req.phase_with_partner) {
      interpretation = 'strong_evidence_for_diagnosis';
      action = 'medical_management_genetic_counseling';
    } else if (req.inheritance_pattern === 'x_linked' && req.zygosity === 'hemi') {
      interpretation = 'likely_pathogenic';
      action = 'correlate_with_phenotype';
    } else {
      interpretation = 'incomplete_evidence';
      action = 'segregation_studies_reclassification_consider_reanalysis';
    }
  } else {
    interpretation = 'uncertain_or_benign';
    action = 'no_clinical_action_documented_in_medical_record';
  }
  return {
    variant_classification: req.variant_classification,
    interpretation,
    action,
    citations: CITATIONS,
  };
}

module.exports = { indication, variant_interpret, CITATIONS, ValidationError };