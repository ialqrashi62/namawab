// filepath: tier5_mtm_ext_102_disease_engine.js
// TIER5_MTM_EXT-102: Disease-state MTM (diabetes, HTN, asthma, CHF, COPD, dyslipidemia)
'use strict';

const CITATIONS = [
  'ADA_Standards_2024',
  'AHA_HTN_2017',
  'GINA_Asthma_2023',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function diabetes_mtm(req) {
  ensureNumber(req.a1c_pct, 'a1c_pct');
  ensureNumber(req.bg_pre_meal_mg_dl, 'bg_pre_meal_mg_dl');
  ensureBool(req.on_metformin, 'on_metformin');
  ensureBool(req.on_basal_insulin, 'on_basal_insulin');
  ensureBool(req.hypoglycemia_present, 'hypoglycemia_present');
  ensureNumber(req.egfr, 'egfr');

  let plan;
  if (req.a1c_pct >= 9) plan = 'continue_with_intensification_review';
  else if (req.a1c_pct >= 7 && req.on_metformin === false) plan = 'continue_with_metformin_review';
  else if (req.hypoglycemia_present) plan = 'continue_with_hypo_review';
  else if (req.egfr < 30 && req.on_metformin) plan = 'continue_with_metformin_discontinuation_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function htn_mtm(req) {
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.diastolic_bp, 'diastolic_bp');
  ensureBool(req.on_ace_or_arb, 'on_ace_or_arb');
  ensureBool(req.beta_blocker_present, 'beta_blocker_present');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.potassium_mmol_l, 'potassium_mmol_l');

  let plan;
  if (req.systolic_bp >= 160) plan = 'continue_with_intensification_review';
  else if (req.egfr < 30 && req.on_ace_or_arb) plan = 'continue_with_renal_review';
  else if (req.potassium_mmol_l >= 5.5) plan = 'continue_with_potassium_review';
  else if (req.systolic_bp >= 140) plan = 'continue_with_uptitration_review';
  else plan = 'continue_with_standard_review';
  return { plan };
}

function asthma_mtm(req) {
  ensureNumber(req.act_score, 'act_score');
  ensureBool(req.on_ics_controller, 'on_ics_controller');
  ensureBool(req.rescue_inhaler_refill_3_per_year, 'rescue_inhaler_refill_3_per_year');
  ensureBool(req.nighttime_symptoms, 'nighttime_symptoms');
  ensureBool(req.exacerbation_last_year, 'exacerbation_last_year');

  let plan;
  if (req.act_score < 16) plan = 'continue_with_step_up_review';
  else if (req.rescue_inhaler_refill_3_per_year) plan = 'continue_with_step_up_review';
  else if (req.exacerbation_last_year) plan = 'continue_with_controller_step_up_review';
  else if (!req.on_ics_controller) plan = 'continue_with_ics_initiation_review';
  else plan = 'continue_with_maintenance_review';
  return { plan };
}

function chf_mtm(req) {
  ensureNumber(req.lvef_pct, 'lvef_pct');
  ensureBool(req.on_ace_arb_arNI, 'on_ace_arb_arNI');
  ensureBool(req.on_beta_blocker, 'on_beta_blocker');
  ensureBool(req.on_mra, 'on_mra');
  ensureBool(req.on_sglt2_inhibitor, 'on_sglt2_inhibitor');
  ensureNumber(req.potassium_mmol_l, 'potassium_mmol_l');
  ensureNumber(req.egfr, 'egfr');

  let plan;
  if (req.lvef_pct < 40 && !req.on_ace_arb_arNI) plan = 'continue_with_initiate_ace_arb_arNI_review';
  else if (req.lvef_pct < 40 && !req.on_beta_blocker) plan = 'continue_with_initiate_bb_review';
  else if (req.lvef_pct < 40 && !req.on_sglt2_inhibitor) plan = 'continue_with_initiate_sglt2_review';
  else if (req.on_mra && req.potassium_mmol_l >= 5.0) plan = 'continue_with_potassium_review';
  else if (req.egfr < 30) plan = 'continue_with_renal_review';
  else plan = 'continue_with_review';
  return { plan };
}

function copd_mtm(req) {
  ensureNumber(req.fev1_pct_predicted, 'fev1_pct_predicted');
  ensureNumber(req.exacerbations_per_year, 'exacerbations_per_year');
  ensureBool(req.on_lama, 'on_lama');
  ensureBool(req.on_laba, 'on_laba');
  ensureBool(req.on_ics, 'on_ics');
  ensureBool(req.smoker, 'smoker');

  let plan;
  if (req.exacerbations_per_year >= 2 && !req.on_lama) plan = 'continue_with_lama_initiation_review';
  else if (req.exacerbations_per_year >= 2 && !req.on_laba) plan = 'continue_with_laba_addition_review';
  else if (req.exacerbations_per_year >= 2 && req.fev1_pct_predicted < 50) plan = 'continue_with_ics_addition_review';
  else if (req.smoker) plan = 'continue_with_smoking_cessation_review';
  else plan = 'continue_with_review';
  return { plan };
}

function dyslipidemia_mtm(req) {
  ensureNumber(req.ldl_mg_dl, 'ldl_mg_dl');
  ensureNumber(req.ten_year_risk_pct, 'ten_year_risk_pct');
  ensureBool(req.on_statins, 'on_statins');
  ensureBool(req.statins_high_intensity, 'statins_high_intensity');
  ensureNumber(req.alt_u_l, 'alt_u_l');
  ensureBool(req.diabetic, 'diabetic');

  let plan;
  if (req.diabetic && req.ldl_mg_dl >= 70) plan = 'continue_with_high_intensity_statins_review';
  else if (req.ten_year_risk_pct >= 7.5 && req.ldl_mg_dl >= 100) plan = 'continue_with_statin_review';
  else if (req.on_statins && req.alt_u_l >= 3) plan = 'continue_with_alt_review';
  else if (!req.statins_high_intensity && req.ten_year_risk_pct >= 20) plan = 'continue_with_intensification_review';
  else plan = 'continue_with_review';
  return { plan };
}

function funcs() { return { diabetes_mtm, htn_mtm, asthma_mtm, chf_mtm, copd_mtm, dyslipidemia_mtm }; }
module.exports = { funcs, CITATIONS, ValidationError };
