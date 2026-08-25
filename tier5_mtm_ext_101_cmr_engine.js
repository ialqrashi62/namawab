// filepath: tier5_mtm_ext_101_cmr_engine.js
// TIER5_MTM_EXT-101: Comprehensive medication review
'use strict';

const CITATIONS = [
  'ASHP_CMR_2019',
  'CDC_MTM_2022',
  'AHRQ_Medication_Safety_2021',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function med_review(req) {
  ensureNumber(req.med_count, 'med_count');
  ensureNumber(req.drug_related_problem_count, 'drug_related_problem_count');
  ensureBool(req.renal_adjustment_required, 'renal_adjustment_required');
  ensureBool(req.liver_adjustment_required, 'liver_adjustment_required');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.therapeutic_duplication, 'therapeutic_duplication');
  ensureBool(req.drug_interaction_found, 'drug_interaction_found');

  let action;
  if (req.drug_related_problem_count === 0) action = 'continue_with_review';
  else if (req.therapeutic_duplication || req.drug_interaction_found) action = 'continue_with_intervention_review';
  else if (req.renal_adjustment_required && req.egfr < 30) action = 'continue_with_renal_adjustment';
  else if (req.liver_adjustment_required) action = 'continue_with_liver_adjustment';
  else action = 'continue_with_standard_review';
  return { action };
}

function drug_related_problems(req) {
  ensureBool(req.unnecessary_therapy, 'unnecessary_therapy');
  ensureBool(req.needs_additional_therapy, 'needs_additional_therapy');
  ensureBool(req.ineffective_drug, 'ineffective_drug');
  ensureBool(req.dosage_too_low, 'dosage_too_low');
  ensureBool(req.dosage_too_high, 'dosage_too_high');
  ensureBool(req.noncompliance, 'noncompliance');

  let priority;
  if (req.ineffective_drug) priority = 'continue_with_switch_or_alternative_review';
  else if (req.dosage_too_high) priority = 'continue_with_dose_reduction_review';
  else if (req.dosage_too_low) priority = 'continue_with_dose_increase_review';
  else if (req.unnecessary_therapy) priority = 'continue_with_discontinuation_review';
  else if (req.needs_additional_therapy) priority = 'continue_with_addition_review';
  else if (req.noncompliance) priority = 'continue_with_adherence_review';
  else priority = 'continue_with_review';
  return { priority };
}

function allergies_check(req) {
  ensureNumber(req.allergy_count, 'allergy_count');
  ensureBool(req.known_allergy_to_ordered_drug, 'known_allergy_to_ordered_drug');
  ensureNumber(req.cross_reactivity_risk_count, 'cross_reactivity_risk_count');
  ensureBool(req.patient_verbalized, 'patient_verbalized');
  ensureBool(req.chart_documented, 'chart_documented');

  let advice;
  if (req.known_allergy_to_ordered_drug) advice = 'continue_with_immediate_alternative_review';
  else if (req.cross_reactivity_risk_count > 0) advice = 'continue_with_cross_reactivity_review';
  else if (!req.patient_verbalized && !req.chart_documented) advice = 'continue_with_allergy_verification';
  else advice = 'continue_with_review';
  return { advice };
}

function indication_review(req) {
  ensureNumber(req.medication_count, 'medication_count');
  ensureNumber(req.documented_indication_count, 'documented_indication_count');
  ensureBool(req.beer_criteria_violation, 'beer_criteria_violation');
  ensureBool(req.off_label_use, 'off_label_use');
  ensureNumber(req.age, 'age');

  let recommendation;
  if (req.beer_criteria_violation) recommendation = 'continue_with_beer_review';
  else if (req.documented_indication_count < req.medication_count) recommendation = 'continue_with_indication_clarification';
  else if (req.off_label_use) recommendation = 'continue_with_off_label_review';
  else recommendation = 'continue_with_standard_review';
  return { recommendation };
}

function regimen_simplification(req) {
  ensureNumber(req.dose_per_day_count, 'dose_per_day_count');
  ensureBool(req.combination_product_available, 'combination_product_available');
  ensureBool(req.extended_release_available, 'extended_release_available');
  ensureBool(req.once_daily_target, 'once_daily_target');
  ensureNumber(req.pill_burden_count, 'pill_burden_count');

  let plan;
  if (req.dose_per_day_count >= 4 && req.extended_release_available) plan = 'continue_with_extended_release_review';
  else if (req.combination_product_available) plan = 'continue_with_combination_review';
  else if (req.once_daily_target && req.dose_per_day_count >= 2) plan = 'continue_with_once_daily_review';
  else if (req.pill_burden_count >= 8) plan = 'continue_with_pill_burden_review';
  else plan = 'continue_with_review';
  return { plan };
}

function cost_review(req) {
  ensureNumber(req.out_of_pocket_monthly_usd, 'out_of_pocket_monthly_usd');
  ensureBool(req.generic_alternative_available, 'generic_alternative_available');
  ensureBool(req.patient_assistance_eligible, 'patient_assistance_eligible');
  ensureBool(req.coverage_gap_doughnut_hole, 'coverage_gap_doughnut_hole');

  let advice;
  if (req.out_of_pocket_monthly_usd >= 200) advice = 'continue_with_financial_assistance_review';
  else if (req.generic_alternative_available) advice = 'continue_with_generic_review';
  else if (req.patient_assistance_eligible) advice = 'continue_with_assistance_enrollment_review';
  else if (req.coverage_gap_doughnut_hole) advice = 'continue_with_coverage_gap_review';
  else advice = 'continue_with_review';
  return { advice };
}

function funcs() { return { med_review, drug_related_problems, allergies_check, indication_review, regimen_simplification, cost_review }; }
module.exports = { funcs, CITATIONS, ValidationError };
