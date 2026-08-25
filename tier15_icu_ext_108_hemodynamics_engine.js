// filepath: tier15_icu_ext_108_hemodynamics_engine.js
// TIER15_ICU_EXT-108: Hemodynamic monitoring (shock, fluid, pressors)
'use strict';

const CITATIONS = ['SSC_2024','ESICM_SHOCK_2024','SCAI_2022'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function icu_shock_classify(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.map_mmhg, 'map_mmhg');
  ensureNumber(req.lactate_mmol_l, 'lactate_mmol_l');
  ensureNumber(req.ci_l_min_m2, 'ci_l_min_m2');
  ensureNumber(req.svri, 'svri');
  ensureNumber(req.cvp_mmhg, 'cvp_mmhg');
  ensureNumber(req.svo2_pct, 'svo2_pct');
  ensureEnum(req.shock_type, 'shock_type', ['hypovolemic','cardiogenic','obstructive','distributive_septic','distributive_anaphylactic','distributive_neurogenic','mixed','unknown','not_yet','other']);
  ensureBool(req.fluid_responsive, 'fluid_responsive');

  let status;
  if (req.shock_type === 'cardiogenic' && req.ci_l_min_m2 < 1.8) status = 'cardiogenic_very_low_ci_inotropes';
  else if (req.shock_type === 'distributive_septic' && req.svri < 1200) status = 'distributive_low_svri_septic';
  else if (req.shock_type === 'hypovolemic' && req.cvp_mmhg < 8) status = 'hypovolemic_low_cvp_fluid';
  else if (req.shock_type === 'obstructive') status = 'obstructive_imaging_cause';
  else if (req.lactate_mmol_l >= 4 && req.map_mmhg < 65) status = 'lactate_plus_low_map_critical';
  else if (!req.fluid_responsive && req.shock_type !== 'cardiogenic') status = 'not_fluid_responsive_pressors';
  else status = 'shock_classified';
  return { status, type: req.shock_type };
}

function icu_fluid_responsiveness(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.svv_pct, 'svv_pct');
  ensureNumber(req.delta_ivc_pct, 'delta_ivc_pct');
  ensureNumber(req.plr_co_increase_pct, 'plr_co_increase_pct');
  ensureNumber(req.fluid_challenge_volume_ml, 'fluid_challenge_volume_ml');
  ensureNumber(req.co_change_pct, 'co_change_pct');
  ensureNumber(req.ivc_diameter_cm, 'ivc_diameter_cm');

  let status;
  if (req.svv_pct >= 13) status = 'svv_high_fluid_responsive';
  else if (req.delta_ivc_pct >= 18) status = 'ivc_collapsibility_high_fluid_responsive';
  else if (req.plr_co_increase_pct >= 10) status = 'plr_positive_fluid_responsive';
  else if (req.co_change_pct >= 15) status = 'fluid_challenge_responsive';
  else if (req.svv_pct < 10 && req.delta_ivc_pct < 12 && req.plr_co_increase_pct < 10) status = 'not_fluid_responsive_avoid_fluid';
  else status = 'fluid_responsiveness_indeterminate';
  return { status, svv: req.svv_pct };
}

function icu_vasopressor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.vasopressor, 'vasopressor', ['norepinephrine','epinephrine','dopamine','vasopressin','phenylephrine','dobutamine','milrinone','none','other']);
  ensureNumber(req.dose_mcg_kg_min, 'dose_mcg_kg_min');
  ensureNumber(req.map_target_mmhg, 'map_target_mmhg');
  ensureNumber(req.map_current_mmhg, 'map_current_mmhg');
  ensureNumber(req.lactate_mmol_l, 'lactate_mmol_l');
  ensureNumber(req.central_line_hours, 'central_line_hours');
  ensureBool(req.two_pressor_combination, 'two_pressor_combination');

  let status;
  if (req.map_current_mmhg < req.map_target_mmhg && req.lactate_mmol_l >= 2) status = 'below_target_with_hyperlactatemia_titrate_up';
  else if (req.vasopressor === 'norepinephrine' && req.dose_mcg_kg_min > 0.5 && req.two_pressor_combination) status = 'high_dose_norepi_add_vasopressin';
  else if (req.vasopressor === 'dopamine') status = 'dopamine_replace_with_norepinephrine';
  else if (req.central_line_hours > 96 && !req.two_pressor_combination) status = 'line_in_96h_review_clabsi';
  else if (req.map_current_mmhg >= req.map_target_mmhg) status = 'at_target_weaning_consideration';
  else status = 'vasopressor_appropriate';
  return { status, drug: req.vasopressor };
}

function icu_cardiogenic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.ci_l_min_m2, 'ci_l_min_m2');
  ensureNumber(req.pcap_mmhg, 'pcap_mmhg');
  ensureNumber(req.scai_shock_stage, 'scai_shock_stage');
  ensureNumber(req.ef_pct, 'ef_pct');
  ensureNumber(req.troponin_ng_ml, 'troponin_ng_ml');
  ensureBool(req.mechanical_support, 'mechanical_support');

  let status;
  if (req.scai_shock_stage >= 4) status = 'scai_stage_c_or_d_immediate_support';
  else if (req.ci_l_min_m2 < 1.8 && req.pcap_mmhg >= 18 && req.ef_pct < 30) status = 'cold_wet_low_ef_inotropes';
  else if (req.ci_l_min_m2 < 1.8 && req.pcap_mmhg < 18) status = 'cold_dry_fluid_then_inotropes';
  else if (req.troponin_ng_ml > 1 && req.mechanical_support) status = 'high_troponin_with_support_review';
  else if (req.ef_pct < 30) status = 'low_ef_review_heart_failure_team';
  else status = 'cardiogenic_profile_assessed';
  return { status, scai: req.scai_shock_stage };
}

function icu_septic_shock(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.lactate_initial, 'lactate_initial');
  ensureNumber(req.lactate_recheck_2h, 'lactate_recheck_2h');
  ensureNumber(req.map_with_vasopressor, 'map_with_vasopressor');
  ensureNumber(req.fluids_first_3h_ml, 'fluids_first_3h_ml');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.antibiotic_first_hour, 'antibiotic_first_hour');
  ensureNumber(req.time_to_abx_min, 'time_to_abx_min');

  let status;
  if (req.time_to_abx_min > 60) status = 'antibiotic_over_60min_delay_critical';
  else if (req.lactate_initial >= 4 && req.lactate_recheck_2h >= req.lactate_initial) status = 'lactate_not_clearing_high_mortality';
  else if (req.map_with_vasopressor < 65) status = 'map_target_not_met_titrate';
  else if (req.fluids_first_3h_ml < req.weight_kg * 30) status = 'inadequate_fluid_30ml_per_kg';
  else if (req.lactate_recheck_2h < 2) status = 'lactate_cleared_septic_shock_resolving';
  else status = 'septic_shock_per_bundle';
  return { status, lactate_change: req.lactate_recheck_2h - req.lactate_initial };
}

function funcs() { return { icu_shock_classify, icu_fluid_responsiveness, icu_vasopressor, icu_cardiogenic, icu_septic_shock }; }
module.exports = { funcs, CITATIONS, ValidationError };