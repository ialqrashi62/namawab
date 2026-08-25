// filepath: tier5_pharmacy_ext_105_stewardship_engine.js
// TIER5_PHARMACY_EXT-105: Stewardship — anticoagulation, antimicrobial, insulin
'use strict';

const CITATIONS = [
  'CHEST_Anticoag_2022',
  'IDSA_Stewardship_2020',
  'ADA_Insulin_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function warfarin_inr(req) {
  ensureNumber(req.target_inr, 'target_inr');
  ensureNumber(req.current_inr, 'current_inr');
  ensureNumber(req.weekly_dose_mg, 'weekly_dose_mg');
  ensureNumber(req.days_on_warfarin, 'days_on_warfarin');
  ensureBool(req.bleed_present, 'bleed_present');

  let action;
  if (req.bleed_present) action = 'urgent_clinical_review_consider_holding_warfarin_with_vitamin_k_or_pcc';
  else if (req.target_inr === 2.5 && req.current_inr < 1.5) action = 'consider_maintenance_with_increase_5_to_15_percent_weekly_or_check_drug_interactions';
  else if (req.target_inr === 2.5 && req.current_inr <= 3.5) action = 'continue_dose_then_re_check_in_2_to_4_weeks';
  else if (req.target_inr === 3.0 && req.current_inr > 4.0) action = 'decrease_warfarin_5_to_15_percent_or_hold_dose_then_reassess';
  else if (req.current_inr > 4.5) action = 'consider_continue_within_target_then_hold_or_reduce_for_safety';
  else action = 'continue_then_follow_clinic_pathways';

  return { action, current_inr: req.current_inr };
}

function doac_renal(req) {
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['apixaban','rivaroxaban','dabigatran','edoxaban']);
  ensureNumber(req.current_dose_mg, 'current_dose_mg');
  ensureNumber(req.egfr, 'egfr');

  let decision;
  if (req.drug === 'dabigatran' && req.egfr < 30) decision = 'avoid_dabigatran_then_switch_alternative_drug';
  else if (req.drug === 'rivaroxaban' && req.egfr < 30) decision = 'consider_alternative_in_low_egfr_then_recheck_coagulation';
  else if (req.drug === 'apixaban' && req.egfr < 15) decision = 'consider_apixaban_then_recheck_at_3_months_or_alternative';
  else decision = 'continue_then_routine_check';

  return { drug: req.drug, decision };
}

function antimicrobial_stewardship(req) {
  ensureStr(req.drug, 'drug');
  ensureBool(req.empiric_without_specimen, 'empiric_without_specimen');
  ensureBool(req.allergy_or_organ_failure_reviewed, 'allergy_or_organ_failure_reviewed');
  ensureNumber(req.days_of_therapy, 'days_of_therapy');
  ensureBool(req.biostewardship_reviewed, 'biostewardship_reviewed');
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['uti_lower','uti_upper_respiratory','uti_upper_pyelonephritis','intra_abdominal','skin_soft_tissue','bone_joint','respiratory_aspiration','respiratory_pneumonia','sepsis_unknown_origin','endocarditis']);

  let signal;
  if (req.drug === 'cefepime' && req.days_of_therapy > 7) signal = 'consider_iv_to_po_switch_or_spectrum_review';
  else if (req.empiric_without_specimen && req.days_of_therapy >= 4) signal = 'specimen_collection_or_adjustment_to_culture_results';
  else if (!req.biostewardship_reviewed) signal = 'add_biostewardship_review_for_each_antibiotic_ordered';
  else if (req.drug === 'vancomycin' && req.days_of_therapy >= 7) signal = 'reassess_per_renal_function_then_stewardship_review';
  else signal = 'continue_then_review_in_3_days';

  if (req.indication === 'uti_lower' && req.days_of_therapy >= 4) signal = 'consider_iv_to_po_switch_to_micro_then_complete_5_7_days';

  return { signal };
}

function insulin_protocol(req) {
  ensureNumber(req.bg_value, 'bg_value');
  ensureStr(req.bg_unit, 'bg_unit');
  ensureEnum(req.bg_unit, 'bg_unit', ['mg_dl','mmol_l']);
  ensureNumber(req.last_insulin_dose_units, 'last_insulin_dose_units');
  ensureNumber(req.current_hypoglycemia_status, 'current_hypoglycemia_status'); // 0 none, 1 hypoglycemic
  ensureBool(req.meal_consumed, 'meal_consumed');
  ensureStr(req.protocol_kind, 'protocol_kind');
  ensureEnum(req.protocol_kind, 'protocol_kind', ['sliding_scale','standard_basal_with_correctional','glargine_plus_lispro_carb_ratio','other']);

  let advice;
  if (req.bg_value < 70 || req.current_hypoglycemia_status === 1) advice = 'immediate_glucose_then_review_insulin_protocol_with_reduction';
  else if (req.bg_value < 100 && req.protocol_kind === 'sliding_scale') advice = 'consider_reassess_with_insulin_resistance_increase_then_re_assess_in_4_to_8_hours';
  else if (req.bg_value < 200 && req.protocol_kind === 'standard_basal_with_correctional') advice = 'continue_with_protocol_consistency_review_then_trail_assess_dosing_each_day';
  else if (req.bg_value > 350) advice = 'consider_insulin_dose_increase_with_correct_metric_review_then_care';
  else advice = 'continue_with_protocol';

  if (!req.meal_consumed && req.bg_value >= 200) advice += '_consider_meal_then_adjust_insulin_for_food_consumption';

  return { advice };
}

function almperi_stewardship(req) {
  ensureStr(req.drug_class, 'drug_class');
  ensureEnum(req.drug_class, 'drug_class', ['macrolide','carbapenem','antipseudomonal','third_gen_cephalosporin','vancomycin_iv','linezolid','daptomycin','echinocandin','quinolone']);
  ensureStr(req.target_indication, 'target_indication');
  ensureNumber(req.bc_culture_spec_status, 'bc_culture_spec_status');
  ensureBool(req.tissue_through_program, 'tissue_through_program');
  ensureNumber(req.days_to_optimal_in_30, 'days_to_optimal_in_30');

  let prescription_audit;
  if (req.days_to_optimal_in_30 <= 14) prescription_audit = 'evidence_review_documented_then_supply_chain_audit';
  else if (req.tissue_through_program) prescription_audit = 'continue_within_targets_then_review_30_days';
  else if (req.drug_class === 'carbapenem') prescription_audit = 'carbapenem_resistance_audit_then_dose_adjust';
  else prescription_audit = 'consider_alternative_drug_then_reassess';
  return { prescription_audit };
}

function funcs() { return { warfarin_inr, doac_renal, antimicrobial_stewardship, insulin_protocol, almperi_stewardship }; }
module.exports = { funcs, CITATIONS, ValidationError };
