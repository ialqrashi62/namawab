// filepath: tier5_ed_ext_102_resus_engine.js
// TIER5_ED_EXT-102: Resuscitation (ACLS, ATLS, sepsis bundle, hemorrhage)
'use strict';

const CITATIONS = [
  'AHA_ACLS_2020',
  'ATLS_10th_Ed_2018',
  'SSC_Sepsis_2021',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function acls(req) {
  ensureStr(req.rhythm, 'rhythm');
  ensureEnum(req.rhythm, 'rhythm', ['vf','pulseless_vt','asystole','pea','sinus_tachy','sinus_brady','afib_rvr','post_rosc']);
  ensureBool(req.shockable, 'shockable');
  ensureBool(req.cpr_in_progress, 'cpr_in_progress');
  ensureNumber(req.epi_doses_given, 'epi_doses_given');
  ensureBool(req.amiodarone_given, 'amiodarone_given');

  let action;
  if (req.shockable && req.cpr_in_progress) action = 'continue_with_cpr_then_defibrillate_then_amiodarone';
  else if (req.rhythm === 'pea') action = 'continue_with_cpr_then_search_reversible_causes';
  else if (req.rhythm === 'asystole') action = 'continue_with_cpr_then_confirm_then_search_causes';
  else if (req.rhythm === 'post_rosc') action = 'continue_with_targeted_temperature_management';
  else if (req.rhythm === 'afib_rvr') action = 'continue_with_rate_control_then_rhythm_review';
  else if (req.rhythm === 'sinus_brady') action = 'continue_with_atropine_then_review';
  else action = 'continue_with_standard_protocol';
  return { action };
}

function atls(req) {
  ensureBool(req.airway_patent, 'airway_patent');
  ensureBool(req.breathing_abnormal, 'breathing_abnormal');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureBool(req.cervical_spine_clear, 'cervical_spine_clear');
  ensureBool(req.gcs_below_8, 'gcs_below_8');
  ensureBool(req.massive_transfusion_protocol_activated, 'massive_transfusion_protocol_activated');

  let plan;
  if (!req.airway_patent) plan = 'continue_with_definitive_airway_review';
  else if (req.gcs_below_8) plan = 'continue_with_intubation_review';
  else if (req.breathing_abnormal) plan = 'continue_with_chest_tube_or_needle_decompression_review';
  else if (req.systolic_bp < 90 && req.massive_transfusion_protocol_activated === false) plan = 'continue_with_mtp_activation_then_hemorrhage_control';
  else if (!req.cervical_spine_clear) plan = 'continue_with_c_spine_imaging_review';
  else plan = 'continue_with_secondary_survey';
  return { plan };
}

function sepsis_bundle(req) {
  ensureBool(req.sirs_positive, 'sirs_positive');
  ensureBool(req.likely_infection_source, 'likely_infection_source');
  ensureBool(req.hypotension_or_lactate_above_4, 'hypotension_or_lactate_above_4');
  ensureNumber(req.lactate_mmol_l, 'lactate_mmol_l');
  ensureBool(req.antibiotic_within_1_hour, 'antibiotic_within_1_hour');
  ensureNumber(req.crystalloid_30ml_kg_given, 'crystalloid_30ml_kg_given');

  let plan;
  if (req.sirs_positive && req.likely_infection_source) plan = 'continue_with_sepsis_bundle';
  else if (req.hypotension_or_lactate_above_4) plan = 'continue_with_septic_shock_bundle';
  else if (!req.antibiotic_within_1_hour) plan = 'continue_with_antibiotic_immediately';
  else if (req.crystalloid_30ml_kg_given === 0) plan = 'continue_with_crystalloid_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function hemorrhage(req) {
  ensureBool(req.active_hemorrhage, 'active_hemorrhage');
  ensureNumber(req.heart_rate_bpm, 'heart_rate_bpm');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.shock_index, 'shock_index');
  ensureBool(req.pelvic_fracture, 'pelvic_fracture');
  ensureBool(req.tourniquet_applied, 'tourniquet_applied');

  let plan;
  if (req.active_hemorrhage && req.shock_index >= 1) plan = 'continue_with_mtp_then_hemorrhage_control';
  else if (req.pelvic_fracture) plan = 'continue_with_pelvic_binder_then_review';
  else if (!req.tourniquet_applied && req.active_hemorrhage) plan = 'continue_with_tourniquet_review';
  else if (req.systolic_bp < 90) plan = 'continue_with_pressors_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function stroke_alert(req) {
  ensureNumber(req.last_known_well_minutes, 'last_known_well_minutes');
  ensureNumber(req.nihss_score, 'nihss_score');
  ensureBool(req.large_vessel_occlusion_suspected, 'large_vessel_occlusion_suspected');
  ensureBool(req.glycemia_done, 'glycemia_done');
  ensureBool(req.ct_in_progress, 'ct_in_progress');
  ensureBool(req.iv_access_established, 'iv_access_established');

  let plan;
  if (!req.glycemia_done) plan = 'continue_with_glucose_check';
  else if (req.last_known_well_minutes <= 270 && req.nihss_score >= 6 && req.large_vessel_occlusion_suspected) plan = 'continue_with_thrombectomy_pathway';
  else if (req.last_known_well_minutes <= 270 && req.nihss_score <= 25) plan = 'continue_with_thrombolysis_pathway';
  else if (req.ct_in_progress === false) plan = 'continue_with_ct_immediately';
  else if (req.iv_access_established === false) plan = 'continue_with_iv_access';
  else plan = 'continue_with_standard_pathway';
  return { plan };
}

function ami_pathway(req) {
  ensureStr(req.ecg_finding, 'ecg_finding');
  ensureEnum(req.ecg_finding, 'ecg_finding', ['st_elevation','st_depression','t_wave_inversion','new_lbbb','normal','non_diagnostic']);
  ensureBool(req.ongoing_chest_pain, 'ongoing_chest_pain');
  ensureBool(req.cath_lab_activated, 'cath_lab_activated');
  ensureBool(req.antiplatelet_therapy_given, 'antiplatelet_therapy_given');

  let plan;
  if (req.ecg_finding === 'st_elevation' && req.cath_lab_activated === false) plan = 'continue_with_immediate_cath_lab_activation';
  else if (req.ongoing_chest_pain) plan = 'continue_with_antiplatelet_then_review';
  else if (req.ecg_finding === 'normal') plan = 'continue_with_serial_ecg_review';
  else if (!req.antiplatelet_therapy_given) plan = 'continue_with_antiplatelet_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function funcs() { return { acls, atls, sepsis_bundle, hemorrhage, stroke_alert, ami_pathway }; }
module.exports = { funcs, CITATIONS, ValidationError };
