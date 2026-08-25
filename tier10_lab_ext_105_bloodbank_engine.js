// filepath: tier10_lab_ext_105_bloodbank_engine.js
// TIER10_LAB_EXT-105: Blood bank (type & screen, crossmatch, transfusion reaction, donor, inventory)
'use strict';

const CITATIONS = ['AABB_2024','CAP_BB_2024','FDA_CBER_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function bb_type_and_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.abogroup, 'abogroup', ['a','b','ab','o','indeterminate','weak_d']);
  ensureEnum(req.rh, 'rh', ['positive','negative','weak_d','indeterminate']);
  ensureEnum(req.antibody_screen, 'antibody_screen', ['negative','positive_one_antibody','positive_multiple','pending','invalid']);
  ensureNumber(req.previous_records_count, 'previous_records_count');
  ensureBool(req.dual_sample_required, 'dual_sample_required');

  let ts_status;
  if (req.antibody_screen === 'positive_multiple') ts_status = 'multiple_antibodies_antigen_phenotyping_required';
  else if (req.abogroup === 'indeterminate' || req.rh === 'indeterminate') ts_status = 'indeterminate_re_collect_or_send_reference';
  else if (req.previous_records_count >= 1 && req.dual_sample_required) ts_status = 'historical_record_compare_required';
  else if (req.antibody_screen === 'pending') ts_status = 'pending_antibody_screen_results';
  else ts_status = 'type_screen_complete_ready_for_crossmatch';
  return { ts_status, abo: req.abogroup, rh: req.rh };
}

function bb_crossmatch(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.unit_id, 'unit_id');
  ensureEnum(req.method, 'method', ['immediate_spin','ahg_full','gel_ahg','solid_phase','electronic_computer','none']);
  ensureEnum(req.compatibility, 'compatibility', ['compatible','incompatible','inconclusive','pending','not_tested']);
  ensureNumber(req.transfusion_risk_score, 'transfusion_risk_score');

  let cm_status;
  if (req.compatibility === 'incompatible') cm_status = 'incompatible_do_not_transfuse_investigate';
  else if (req.compatibility === 'inconclusive') cm_status = 'inconclusive_resolve_antibody_screen_first';
  else if (req.method === 'none' && req.transfusion_risk_score >= 3) cm_status = 'crossmatch_required_for_high_risk';
  else if (req.method === 'electronic_computer' && req.transfusion_risk_score >= 4) cm_status = 'electronic_only_for_low_risk_serologic_required';
  else cm_status = 'compatible_release_unit';
  return { cm_status, compatibility: req.compatibility, unit: req.unit_id };
}

function bb_transfusion_reaction(req) {
  ensureStr(req.reaction_id, 'reaction_id');
  ensureEnum(req.symptoms,'symptoms', ['none','fever','chills','urticaria','dyspnea','hypotension','hemoglobinuria','back_pain','flushing','tachycardia','anaphylaxis','taco','trali','septic','allergic_severe','febrile','delayed_hemolytic','other'],
  );
  ensureNumber(req.temp_pre, 'temp_pre');
  ensureNumber(req.temp_during, 'temp_during');
  ensureNumber(req.temp_delta, 'temp_delta');
  ensureEnum(req.severity, 'severity', ['none','mild','moderate','severe','life_threatening','fatal']);
  ensureBool(req.workup_returned, 'workup_returned');

  let reaction_status;
  if (req.severity === 'life_threatening' || req.severity === 'fatal') reaction_status = 'severe_immediate_clinical_investigation_required';
  else if (req.symptoms === 'febrile') reaction_status = 'febrile_non_hemolytic_evaluate';
  else if (req.symptoms === 'allergic_severe') reaction_status = 'allergic_severe_desensitization';
  else if (req.symptoms === 'taco') reaction_status = 'taco_diuretic_management';
  else if (req.symptoms === 'trali') reaction_status = 'trali_supportive_respiratory';
  else if (req.workup_returned) reaction_status = 'workup_complete_determine_cause';
  else reaction_status = 'in_progress_evaluate_and_test';
  return { reaction_status, severity: req.severity, symptoms: req.symptoms };
}

function bb_donor_screen(req) {
  ensureStr(req.donor_id, 'donor_id');
  ensureEnum(req.donation_type, 'donation_type', ['whole_blood','red_cells','platelets','plasma','cryoprecipitate','granulocytes','autologous','directed']);
  ensureBool(req.health_questionnaire_pass, 'health_questionnaire_pass');
  ensureBool(req.infectious_disease_negative, 'infectious_disease_negative');
  ensureNumber(req.hemoglobin, 'hemoglobin');
  ensureNumber(req.blood_pressure_systolic, 'blood_pressure_systolic');
  ensureNumber(req.blood_pressure_diastolic, 'blood_pressure_diastolic');

  let donor_status;
  if (!req.infectious_disease_negative) donor_status = 'id_positive_permanent_deferral';
  else if (!req.health_questionnaire_pass) donor_status = 'health_q_failed_temporary_deferral';
  else if (req.hemoglobin < 12.5) donor_status = 'low_hgb_defer_or_iron_evaluation';
  else if (req.blood_pressure_systolic > 180 || req.blood_pressure_diastolic > 100) donor_status = 'bp_too_high_defer';
  else if (req.blood_pressure_systolic < 90) donor_status = 'bp_too_low_defer';
  else donor_status = 'donor_accepted_proceed';
  return { donor_status, donation: req.donation_type, hgb: req.hemoglobin };
}

function bb_inventory(req) {
  ensureEnum(req.component_type, 'component_type', ['whole_blood','red_cells','platelets_aph','platelets_whole','plasma_fresh_frozen','plasma_liquid','cryoprecipitate','granulocytes','washed_red_cells','irradiated_red_cells']);
  ensureNumber(req.units_in_stock, 'units_in_stock');
  ensureNumber(req.days_to_outdate_oldest, 'days_to_outdate_oldest');
  ensureNumber(req.units_used_30d, 'units_used_30d');
  ensureNumber(req.days_supply_target, 'days_supply_target');

  const burn_rate = req.units_used_30d / 30;
  const days_supply = burn_rate > 0 ? req.units_in_stock / burn_rate : Infinity;
  let inventory_status;
  if (req.days_to_outdate_oldest <= 7) inventory_status = 'oldest_unit_outdate_within_week_transfer_priority';
  else if (days_supply < req.days_supply_target) inventory_status = 'low_inventory_order_restock';
  else if (days_supply > req.days_supply_target * 2) inventory_status = 'overstocked_reduce_orders';
  else inventory_status = 'optimal_inventory';
  return { inventory_status, days_supply: Math.round(days_supply * 10) / 10, oldest_outdate: req.days_to_outdate_oldest };
}

function funcs() { return { bb_type_and_screen, bb_crossmatch, bb_transfusion_reaction, bb_donor_screen, bb_inventory }; }
module.exports = { funcs, CITATIONS, ValidationError };