// filepath: tier5_pharmacy_ext_102_formulary_engine.js
// TIER5_PHARMACY_EXT-102: Formulary, drug info, drug interaction, IV compatibility, cost
'use strict';

const CITATIONS = [
  'ASHP_Drug_Interactions_2020',
  'King_Guide_to_IV_Compatibility_2019',
  'KBMA_FDA_Brief_Summaries',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function check_formulary(req) {
  ensureStr(req.drug, 'drug');
  ensureBool(req.tier_2_or_3, 'tier_2_or_3');
  ensureBool(req.biosimilar_or_brand_only, 'biosimilar_or_brand_only');
  ensureStr(req.drug_class, 'drug_class');
  ensureEnum(req.drug_class, 'drug_class', ['oncology_targeted_therapy','biologic_immunology','antimicrobial_high_cost','glucometer_and_insulin_dmx','rdt_disease_modifying_tx','rare_disease','cardiovascular_specialty','palliative_specialty','mental_health_specialty','analgesic_specialty']);
  ensureNumber(req.local_cost_index, 'local_cost_index'); // 1..2 of standard

  let recommendation;
  if (req.drug_class === 'oncology_targeted_therapy' && !req.tier_2_or_3) recommendation = 'requires_pharmacy_and_therapeutics_review_prior_to_use_with_biosimilar';
  else if (req.local_cost_index > 1.5) recommendation = 'consider_alternative_or_clinical_review_highest_cost_index';
  else if (req.biosimilar_or_brand_only) recommendation = 'replace_with_biosimilar_when_possible_per_q1';
  else recommendation = 'standard_formulary_use_then_monitor';
  return { drug: req.drug, recommendation };
}

function check_interaction(req) {
  ensureStr(req.drug_a, 'drug_a');
  ensureStr(req.drug_b, 'drug_b');
  ensureStr(req.mechanism, 'mechanism');
  ensureEnum(req.mechanism, 'mechanism', ['cyp3a4_inhibitor','cyp3a4_inducer','cyp2c9_inhibitor','cyp2c9_inducer','cyp2c19_inhibitor','pgp_inhibitor','absorption_chelator','psp_enhancer','renal_clearance_competition','qt_prolongation']);
  ensureNumber(req.drug_a_renal_clearance_ml_min, 'drug_a_renal_clearance_ml_min');
  ensureBool(req.both_with_qt_prolongation_risk, 'both_with_qt_prolongation_risk');

  let severity;
  if (req.mechanism === 'cyp3a4_inhibitor' && ['cyp3a4_inhibitor','cyp3a4_inducer'].includes(req.mechanism) === false) severity = req.mechanism.includes('cyp3a4') || req.mechanism.includes('cyp2c9') ? 'major' : 'moderate';

  if (req.both_with_qt_prolongation_risk) severity = 'major_qt_prolongation_avoid_concomitant_use';

  let approach;
  if (severity && severity.startsWith('major')) approach = 'consider_alternative_drug_or_change_route_then_repeat_qtc_in_2_weeks';
  else if (severity === 'moderate') approach = 'monitor_drug_levels_or_clinical_signs_then_review';
  else approach = 'standard_with_education';

  if (req.drug_a_renal_clearance_ml_min < 30) approach += '_review_dose_adjust_renal';

  return { severity, approach };
}

function iv_compatibility(req) {
  ensureStr(req.drug_a, 'drug_a');
  ensureStr(req.drug_b, 'drug_b');
  ensureEnum(req.compatibility_layer, 'compatibility_layer', ['outer_y_at_y_line','same_piggyback_bag','y_site_compatibility','single_lumen_tested_with_three_in_one_or_dual_lumen','broken_dual_lumen','secondary_line']);
  ensureStr(req.reaction_when_mixture, 'reaction_when_mixture');
  ensureEnum(req.reaction_when_mixture, 'reaction_when_mixture', ['cloudy','precipitate','color_change','ph_irregularity','crystallization','no_test_observed']);

  let verdict;
  if (req.reaction_when_mixture === 'no_test_observed') verdict = 'use_immediately_in_y_site_after_compatibility_confirmation_then_continue';
  else verdict = 'incompatible_use_separate_iv_lines_or_review_diluent';

  if (req.compatibility_layer === 'same_piggyback_bag' && req.reaction_when_mixture !== 'no_test_observed') verdict = 'recommendation_re_evaluate_changing_diluent_then_stagger';
  return { verdict };
}

function dose_check(req) {
  ensureStr(req.drug, 'drug');
  ensureNumber(req.dose_ordered_mg, 'dose_ordered_mg');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.renal_egfr, 'renal_egfr');

  if (req.dose_ordered_mg <= 0 || req.weight_kg <= 0) throw new ValidationError('dose/weight must be >0');
  const per_kg = req.dose_ordered_mg / req.weight_kg;

  let decision;
  if (req.renal_egfr < 30 && req.dose_ordered_mg >= 1000) decision = 'consult_clinical_pharmacy_for_renal_adjust';
  else if (req.age_years < 12 && per_kg > 30) decision = 'consider_pediatric_dose_formulation_or_consult';
  else if (per_kg > 50 || req.dose_ordered_mg > 4000) decision = 'consider_max_single_dose_then_reassess';
  else decision = 'standard_dose_no_action';

  return { drug: req.drug, per_kg: Math.round(per_kg * 10) / 10, decision };
}

function drug_info_lookup(req) {
  ensureStr(req.drug, 'drug');
  ensureNumber(req.dose_mg, 'dose_mg');
  ensureStr(req.frequency, 'frequency');
  ensureEnum(req.frequency, 'frequency', ['once_daily','twice_daily','three_times_a_day','four_times_a_day','q6h','q8h','q12h','weekly','monthly']);
  ensureBool(req.renal_adjust_required, 'renal_adjust_required');
  ensureNumber(req.egfr_value, 'egfr_value');

  let decision;
  if (req.renal_adjust_required && req.egfr_value < 50) decision = 'review_renal_adjust_with_pharmacist_call_or_lab_input';
  else if (req.frequency === 'q6h' && (req.dose_mg >= 4000)) decision = 'review_max_daily_then_reduce_frequency_or_change_dose';
  else if (req.frequency === 'four_times_a_day' && req.renal_adjust_required) decision = 'review_renal_adjust_through_q8h_interval_instead_of_q6h';
  else decision = 'standard_dose_lookup_with_instructive_thorough_response';
  return { decision };
}

function funcs() { return { check_formulary, check_interaction, iv_compatibility, dose_check, drug_info_lookup }; }
module.exports = { funcs, CITATIONS, ValidationError };
