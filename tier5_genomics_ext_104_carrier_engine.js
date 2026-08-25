'use strict';
// TIER5_GENOMICS_EXT-104: Carrier screening - expanded carrier screen (ECS)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_ECS_2017', 'ACMG_ECS_2021'];

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

function recommend(req) {
  ensureNumber(req.maternal_age, 'maternal_age');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.partner_known_carrier, 'partner_known_carrier');
  ensureBool(req.partner_affected, 'partner_affected');
  ensureBool(req.family_history_x_linked, 'family_history_x_linked');
  ensureBool(req.consanguinity, 'consanguinity');
  ensureStr(req.ethnicity, 'ethnicity'); // ashkenazi | caucasian | asian | hispanic | african | mediterranean | mixed | other

  let recommendation = [];
  if (req.pregnant || req.partner_known_carrier) {
    recommendation.push('expanded_carrier_screen_targeted_to_ethnicity');
  } else if (req.partner_affected || req.consanguinity) {
    recommendation.push('expanded_carrier_screen_comprehensive');
  } else if (req.family_history_x_linked) {
    recommendation.push('fragile_x_carrier_screen');
  } else if (req.ethnicity === 'ashkenazi') {
    recommendation.push('ashkenazi_panel_tay_sachs_cystic_fibrosis_canavan_gaucher_fanconi_anemia_niemann_pick_dg');
  } else {
    recommendation.push('universal_cystic_fibrosis_sma_thalassemia_fragile_x');
  }
  if (req.consanguinity) recommendation.push('counsanguinity_counseling_extended_panel');
  return {
    recommendation,
    partner_screening: req.partner_known_carrier ? 'already_done' : 'recommended_in_parallel',
    pretest_counseling: 'genetic_counselor_consultation_recommended',
    posttest_if_positive: 'partner_screening_and_reproductive_counseling',
    citations: CITATIONS,
  };
}

function result_counsel(req) {
  ensureStr(req.variant_classification, 'variant_classification'); // pathogenic | lp | vus | lb | benign
  ensureStr(req.condition, 'condition');
  ensureBool(req.partner_also_carrier, 'partner_also_carrier');
  ensureBool(req.reproductive_age, 'reproductive_age');

  const risk_if_both_carriers = req.partner_also_carrier && (req.variant_classification === 'pathogenic' || req.variant_classification === 'lp') ? 0.25 : 0;
  return {
    variant_classification: req.variant_classification,
    condition: req.condition,
    risk_per_pregnancy: risk_if_both_carriers,
    recommendations: req.variant_classification === 'vus' ? 'do_not_change_management_reclassification_over_time' :
      risk_if_both_carriers ? 'reproductive_options_pgd_prenatal_diagnosis_donor_sperm_egg' : 'no_reproductive_intervention_per_data',
    citations: CITATIONS,
  };
}

module.exports = { recommend, result_counsel, CITATIONS, ValidationError };