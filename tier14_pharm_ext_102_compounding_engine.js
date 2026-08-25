// filepath: tier14_pharm_ext_102_compounding_engine.js
// TIER14_PHARM_EXT-102: IV admixture & non-sterile compounding (USP 795/797/800)
'use strict';

const CITATIONS = ['USP_795_2024','USP_797_2024','USP_800_2024','ASHP_COMPOUNDING_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function compound_recipe_validate(req) {
  ensureStr(req.recipe_id, 'recipe_id');
  ensureEnum(req.compounding_type, 'compounding_type', ['sterile_low_risk','sterile_medium_risk','sterile_high_risk','non_sterile_simple','non_sterile_moderate','non_sterile_complex','hazardous','other']);
  ensureNumber(req.ingredients_count, 'ingredients_count');
  ensureNumber(req.final_volume_ml, 'final_volume_ml');
  ensureNumber(req.concentration_mg_ml, 'concentration_mg_ml');
  ensureBool(req.stability_documented, 'stability_documented');
  ensureBool(req.master_formula_documented, 'master_formula_documented');
  ensureNumber(req.beyond_use_date_days, 'beyond_use_date_days');

  let status;
  if (req.compounding_type === 'sterile_high_risk' && req.beyond_use_date_days > 14) status = 'high_risk_sterile_bud_max_14_days_cold';
  else if (req.compounding_type === 'sterile_medium_risk' && req.beyond_use_date_days > 30) status = 'medium_risk_sterile_bud_max_30_days_cold';
  else if (req.compounding_type === 'sterile_low_risk' && req.beyond_use_date_days > 45) status = 'low_risk_sterile_bud_max_45_days_cold';
  else if (!req.master_formula_documented) status = 'master_formula_required_blocking';
  else if (!req.stability_documented) status = 'stability_study_required';
  else if (req.ingredients_count < 1) status = 'invalid_no_ingredients';
  else status = 'recipe_valid';
  return { status, type: req.compounding_type, bud_days: req.beyond_use_date_days };
}

function compound_iso_environment(req) {
  ensureStr(req.compounding_id, 'compounding_id');
  ensureEnum(req.iso_class, 'iso_class', ['iso_class_5','iso_class_6','iso_class_7','iso_class_8','cacai','non_sterile_compounding','other']);
  ensureNumber(req.pressure_differential_pa, 'pressure_differential_pa');
  ensureEnum(req.air_changes_per_hour, 'air_changes_per_hour', ['0_to_2','2_to_4','4_to_8','8_to_12','12_to_20','20_to_30','30_to_60','60_plus']);
  ensureNumber(req.particle_count_per_m3, 'particle_count_per_m3');
  ensureNumber(req.temp_celsius, 'temp_celsius');
  ensureNumber(req.humidity_pct, 'humidity_pct');
  ensureBool(req.viable_particle_test_passed, 'viable_particle_test_passed');

  let status;
  if (req.iso_class === 'iso_class_5' && req.particle_count_per_m3 > 3520) status = 'iso5_above_limit';
  else if (req.air_changes_per_hour === '0_to_2' && req.iso_class !== 'non_sterile_compounding') status = 'low_air_changes_review';
  else if (req.humidity_pct < 30 || req.humidity_pct > 60) status = 'humidity_out_of_range';
  else if (!req.viable_particle_test_passed) status = 'viable_particle_test_required_iso5_weekly';
  else status = 'iso_environment_compliant';
  return { status, iso: req.iso_class };
}

function compound_hazardous(req) {
  ensureStr(req.compounding_id, 'compounding_id');
  ensureEnum(req.hazardous_class, 'hazardous_class', ['non_hazardous','niosh_group_1','niosh_group_2','niosh_group_3','antineoplastic','reproductive_only','other']);
  ensureBool(req.cppe_required, 'cppe_required');
  ensureBool(req.cabinet_certified, 'cabinet_certified');
  ensureBool(req.spill_kit_available, 'spill_kit_available');
  ensureBool(req.eye_wash_within_10s, 'eye_wash_within_10s');
  ensureEnum(req.disposal, 'disposal', ['yellow_hazardous','black_rcra','white_donor','shar_p_container','trace_chemo','other']);
  ensureNumber(req.negative_pressure_pa, 'negative_pressure_pa');

  let status;
  if (!req.cabinet_certified) status = 'cabinet_required_for_hazardous_blocking';
  else if (!req.cppe_required && req.hazardous_class !== 'non_hazardous') status = 'cppe_required_blocking';
  else if (req.negative_pressure_pa >= 0) status = 'negative_pressure_required_for_hazardous';
  else if (!req.spill_kit_available) status = 'spill_kit_required';
  else if (!req.eye_wash_within_10s) status = 'eye_wash_within_10s_required';
  else status = 'hazardous_handling_compliant';
  return { status, hazard_class: req.hazardous_class };
}

function compound_batching(req) {
  ensureStr(req.batch_id, 'batch_id');
  ensureNumber(req.batch_size_units, 'batch_size_units');
  ensureStr(req.master_formula_ref, 'master_formula_ref');
  ensureBool(req.pre_approval_attached, 'pre_approval_attached');
  ensureBool(req.compounder_certified, 'compounder_certified');
  ensureNumber(req.compounder_years_experience, 'compounder_years_experience');
  ensureBool(req.qa_sample_retained, 'qa_sample_retained');
  ensureBool(req.environmental_monitoring_pass, 'environmental_monitoring_pass');

  let status;
  if (!req.compounder_certified) status = 'compounder_certification_required';
  else if (req.compounder_years_experience < 1 && req.compounding_type !== 'non_sterile_simple') status = 'low_experience_review_supervision';
  else if (!req.pre_approval_attached) status = 'pre_approval_required_for_batch';
  else if (!req.qa_sample_retained) status = 'qa_sample_retention_required';
  else if (!req.environmental_monitoring_pass) status = 'environmental_monitoring_pass_required';
  else status = 'batch_approved';
  return { status, batch: req.batch_id, size: req.batch_size_units };
}

function compound_release(req) {
  ensureStr(req.compounding_id, 'compounding_id');
  ensureBoolStr = ensureBool;
  ensureEnum(req.test_results, 'test_results', ['pending','passing','failing','invalid','out_of_spec','retest_in_progress','other']);
  ensureNumber(req.endotoxin_level_eu_ml, 'endotoxin_level_eu_ml');
  ensureNumber(req.sterility_test_days, 'sterility_test_days');
  ensureBool(req.visual_inspection_pass, 'visual_inspection_pass');
  ensureBool(req.labeling_complete, 'labeling_complete');
  ensureBool(req.verified_drug_name_correct, 'verified_drug_name_correct');

  let status;
  if (!req.visual_inspection_pass) status = 'visual_inspection_failed_particulate_or_clarity';
  else if (req.test_results === 'failing') status = 'testing_failing_investigate';
  else if (req.test_results === 'out_of_spec') status = 'out_of_spec_investigate';
  else if (!req.labeling_complete) status = 'labeling_incomplete_blocking';
  else if (!req.drug_name_correct) status = 'drug_name_mismatch_blocking';
  else if (req.test_results === 'pending' && req.sterility_test_days < 14) status = 'sterility_test_pending_14_day_min';
  else status = 'released_for_use';
  return { status, test: req.test_results };
}

function ensureBoolStr(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function funcs() { return { compound_recipe_validate, compound_iso_environment, compound_hazardous, compound_batching, compound_release }; }
module.exports = { funcs, CITATIONS, ValidationError };