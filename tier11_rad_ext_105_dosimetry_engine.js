// filepath: tier11_rad_ext_105_dosimetry_engine.js
// TIER11_RAD_EXT-105: Radiation dose tracking (CT, fluoro, mammography, DRL, cumulative)
'use strict';

const CITATIONS = ['AAPM_TG_2024','ICRP_DRL_2024','ACR_DOSE_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dose_ct_dlp(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.protocol, 'protocol', ['ct_head','ct_chest','ct_abdomen','ct_abdomen_pelvis','ct_chest_abdomen_pelvis','ct_coronary_angiography','ct_pulmonary_angiography','ct_angiography_runoff','ct_aorta','ct_kidney_ureter_bladder','ct_pediatric_head','ct_pediatric_chest','ct_pediatric_abdomen','ct_cone_beam','ct_screening_lung','other']);
  ensureNumber(req.dlp_mgy_cm, 'dlp_mgy_cm');
  ensureNumber(req.ctdi_vol_mgy, 'ctdi_vol_mgy');
  ensureNumber(req.drl_dlp_mgy_cm, 'drl_dlp_mgy_cm');
  ensureNumber(req.scan_length_cm, 'scan_length_cm');
  ensureBool(req.iterative_reconstruction, 'iterative_reconstruction');

  let dose_status;
  const ratio = req.drl_dlp_mgy_cm > 0 ? req.dlp_mgy_cm / req.drl_dlp_mgy_cm : 0;
  if (ratio >= 2.5) dose_status = 'dose_2_5x_drl_review_protocol';
  else if (ratio >= 1.5) dose_status = 'dose_above_drl_review';
  else if (ratio <= 0.5) dose_status = 'dose_well_below_drl_possible_under_exposure';
  else if (!req.iterative_reconstruction) dose_status = 'no_iterative_reconstruction_higher_dose_review';
  else dose_status = 'dose_within_drl';
  return { dose_status, ratio: Math.round(ratio * 100) / 100, dlp: req.dlp_mgy_cm };
}

function dose_fluoro(req) {
  ensureStr(req.study_id, 'study_id');
  ensureEnum(req.procedure, 'procedure', ['coronary_angiography','pci','peripheral_angiography','embolization','vertebroplasty','ablation','line_placement','ercep','ercp','myelography','cystography','other']);
  ensureNumber(req.dap_gy_cm2, 'dap_gy_cm2');
  ensureNumber(req.fluoro_time_min, 'fluoro_time_min');
  ensureNumber(req.drl_dap_gy_cm2, 'drl_dap_gy_cm2');

  let fluoro_status;
  const ratio = req.drl_dap_gy_cm2 > 0 ? req.dap_gy_cm2 / req.drl_dap_gy_cm2 : 0;
  if (req.fluoro_time_min > 60) fluoro_status = 'long_fluoro_time_review_patient_skin_dose';
  else if (ratio >= 2.5) fluoro_status = 'dose_2_5x_drl_review_technique';
  else if (ratio >= 1.5) fluoro_status = 'dose_above_drl_review';
  else if (ratio <= 0.3) fluoro_status = 'dose_well_below_drl_possible_under_exposure';
  else fluoro_status = 'dose_within_drl';
  return { fluoro_status, ratio: Math.round(ratio * 100) / 100, time_min: req.fluoro_time_min };
}

function dose_mammo(req) {
  ensureStr(req.study_id, 'study_id');
  ensureNumber(req.mgd_view, 'mgd_view');
  ensureNumber(req.average_glandular_dose_limit, 'average_glandular_dose_limit');
  ensureEnum(req.density_composition, 'density_composition', ['almost_entirely_fat','scattered_fibroglandular','heterogeneously_dense','extremely_dense','unknown']);
  ensureBool(req.dbcf_available, 'dbcf_available');
  ensureNumber(req.thickness_mm, 'thickness_mm');

  let mammo_status;
  if (req.mgd_view > req.average_glandular_dose_limit * 1.5) mammo_status = 'mgd_above_limit_review_protocol';
  else if (!req.dbcf_available) mammo_status = 'dbcf_dose_calculation_unavailable';
  else if (req.thickness_mm > 60) mammo_status = 'thick_breast_review_compression_and_dose';
  else mammo_status = 'mammo_dose_within_limit';
  return { mammo_status, mgd: req.mgd_view, thickness: req.thickness_mm };
}

function dose_pediatric(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.ssde_mgy, 'ssde_mgy');
  ensureNumber(req.drl_pediatric_mgy, 'drl_pediatric_mgy');
  ensureBool(req.size_specific_protocol, 'size_specific_protocol');

  let ped_status;
  if (age_years_or_weight_unset(req)) ped_status = 'age_weight_required';
  else {
    const ratio = req.drl_pediatric_mgy > 0 ? req.ssde_mgy / req.drl_pediatric_mgy : 0;
    if (!req.size_specific_protocol) ped_status = 'size_specific_protocol_required_for_pediatric';
    else if (ratio >= 1.5) ped_status = 'pediatric_dose_above_drl_review';
    else if (ratio <= 0.4) ped_status = 'pediatric_dose_well_below_drl';
    else ped_status = 'pediatric_dose_within_drl';
  }
  return { ped_status, ratio: req.drl_pediatric_mgy > 0 ? Math.round(req.ssde_mgy / req.drl_pediatric_mgy * 100) / 100 : 0 };
}

function age_years_or_weight_unset(req) { return typeof req.age_years !== 'number' || typeof req.weight_kg !== 'number'; }

function dose_cumulative(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.studies_12mo, 'studies_12mo');
  ensureNumber(req.cumulative_dose_msv, 'cumulative_dose_msv');
  ensureEnum(req.dose_band, 'dose_band', ['low_less_than_3','moderate_3_to_20','high_20_to_50','very_high_50_to_100','extreme_over_100','not_calculated']);
  ensureBool(req.alerts_to_provider, 'alerts_to_provider');

  let cum_status;
  if (req.cumulative_dose_msv >= 100) cum_status = 'extreme_cumulative_dose_risk_review';
  else if (req.cumulative_dose_msv >= 50) cum_status = 'very_high_cumulative_dose_review';
  else if (req.cumulative_dose_msv >= 20) cum_status = 'high_cumulative_dose_monitor';
  else if (req.cumulative_dose_msv < 3) cum_status = 'low_cumulative_dose_no_action';
  else cum_status = 'moderate_cumulative_dose_continue_monitoring';
  return { cum_status, total: req.cumulative_dose_msv, studies: req.studies_12mo };
}

function funcs() { return { dose_ct_dlp, dose_fluoro, dose_mammo, dose_pediatric, dose_cumulative }; }
module.exports = { funcs, CITATIONS, ValidationError };