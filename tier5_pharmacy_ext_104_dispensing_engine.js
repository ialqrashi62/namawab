// filepath: tier5_pharmacy_ext_104_dispensing_engine.js
// TIER5_PHARMACY_EXT-104: Dispensing + IV admixture (final check, prep, CIS labeling)
'use strict';

const CITATIONS = [
  'ASHP_Drug_Dispensing_2019',
  'USP_797_2019',
  'CDC_Cross_Contamination_2020',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function final_check(req) {
  ensureStr(req.drug, 'drug');
  ensureNumber(req.dose, 'dose');
  ensureBool(req.right_patient, 'right_patient');
  ensureBool(req.right_dose, 'right_dose');
  ensureBool(req.right_drug, 'right_drug');
  ensureBool(req.right_route, 'right_route');
  ensureBool(req.right_time, 'right_time');
  ensureBool(req.right_documentation, 'right_documentation');

  const checkpoints = [req.right_patient, req.right_dose, req.right_drug, req.right_route, req.right_time, req.right_documentation].filter(Boolean).length;
  return { checkpoints_passed: checkpoints, all_six_passed: checkpoints === 6, drug: req.drug, dose: req.dose, recommendation: checkpoints === 6 ? 'dispense' : 'do_not_dispense_correct_first_then_reverify' };
}

function ivprep(req) {
  ensureStr(req.drug, 'drug');
  ensureStr(req.iv_medium, 'iv_medium');
  ensureEnum(req.iv_medium, 'iv_medium', ['ns_0_9pct','d5w_5pct','d10w','rl_lactate','half_ns','ts_3pct','sterile_water','other_drug']);
  ensureNumber(req.drug_quantity_mg, 'drug_quantity_mg');
  ensureNumber(req.concentration_target_mg_ml, 'concentration_target_mg_ml');
  ensureNumber(req.iv_volume_ml, 'iv_volume_ml');
  ensureBool(req.hazmat_handling_required, 'hazmat_handling_required');

  let decision;
  if (req.concentration_target_mg_ml === 0) decision = 'invalid_concentration';
  else if (req.drug_quantity_mg > (req.iv_volume_ml * 100)) decision = 'high_concentration_review_handling_options';
  else if (req.hazmat_handling_required) decision = 'prepare_in_bsc_class_II_with_full_ppe';
  else if (req.iv_medium !== 'other_drug') decision = 'reconstitute_and_dilute_per_compatible_diluent_table';
  else decision = 'verify_compatibility_with_p_drug_database_then_proceed';

  return { drug: req.drug, decision };
}

function cis(req) {
  ensureStr(req.drug, 'drug');
  ensureStr(req.unit, 'unit');
  ensureEnum(req.unit, 'unit', ['kg','lbs','years','ml','mg','mcg','iu','international_units']);
  ensureNumber(req.single_dose_qty, 'single_dose_qty');
  ensureBool(req.compounded_in_class_ii_bsc, 'compounded_in_class_ii_bsc');
  ensureBool(req.iso_5_environment_in_use, 'iso_5_environment_in_use');

  let compliance;
  if (req.compounded_in_class_ii_bsc && req.iso_5_environment_in_use) compliance = 'compounding_environment_official_us_p_797_compliant';
  else if (req.compounded_in_class_ii_bsc) compliance = 'compounding_environment_class_ii_bsc_partial_compliance_then_advise_iso5_env';
  else compliance = 're_examine_compounding_environment_then_recycle_request';

  return { drug: req.drug, compliance };
}

function label_check(req) {
  ensureBool(req.high_alert_label, 'high_alert_label');
  ensureBool(req.tall_man_lettering, 'tall_man_lettering');
  ensureBool(req.dose_concentration_visible, 'dose_concentration_visible');
  ensureBool(req.patient_name_visible, 'patient_name_visible');
  ensureBool(req.expiration_date_visible, 'expiration_date_visible');
  ensureBool(req.lot_and_expiration_on_unit_doses, 'lot_and_expiration_on_unit_doses');
  ensureBool(req.barcode_present, 'barcode_present');

  return {
    all_passed: [req.high_alert_label, req.tall_man_lettering, req.dose_concentration_visible, req.patient_name_visible, req.expiration_date_visible, req.lot_and_expiration_on_unit_doses, req.barcode_present].every(Boolean),
    recommendation: 'continue_with_labeling_protocol',
  };
}

function stock_status(req) {
  ensureStr(req.drug, 'drug');
  ensureNumber(req.days_supply, 'days_supply');
  ensureNumber(req.units_in_stock, 'units_in_stock');
  ensureNumber(req.days_supply_maximum, 'days_supply_maximum');
  ensureNumber(req.forecast_use_per_day, 'forecast_use_per_day');

  if (req.forecast_use_per_day <= 0) throw new ValidationError('forecast_use_per_day >0');
  const days_left = req.units_in_stock / req.forecast_use_per_day;
  let advice;
  if (days_left >= 14) advice = 'no_action_required_review_in_two_weeks';
  else if (days_left >= 7) advice = 'plan_order_review_then_quantity_for_use_in_7_days';
  else if (days_left >= 2) advice = 'urgent_order_today_with_emergency_chain';
  else advice = 'critical_shortage_consult_inventory_for_the_supply_audit';

  return { advice, days_left: Math.round(days_left * 10) / 10 };
}

function funcs() { return { final_check, ivprep, cis, label_check, stock_status }; }
module.exports = { funcs, CITATIONS, ValidationError };
