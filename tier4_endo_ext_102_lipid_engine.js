'use strict';
// TIER4_ENDO_EXT-102: Lipid - ASCVD risk + statin intensity
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AHA_Cholesterol_2018', 'AHA_Statin_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function risk(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.total_cholesterol, 'total_cholesterol');
  ensureNumber(req.hdl, 'hdl');
  ensureNumber(req.sbp, 'sbp');
  ensureBool(req.htn_treated, 'htn_treated');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.cvd, 'cvd');

  const high_risk_categories = req.cvd || req.diabetes && req.age >= 40;
  if (high_risk_categories) {
    return {
      category: req.cvd ? 'secondary_prevention_cvd' : 'high_risk_diabetes_age_40_plus',
      ten_year_ascvd: 'high',
      recommendation: 'high_intensity_statin_or_ezetimibe_add_on',
      citations: CITATIONS,
    };
  }
  const age_points = req.age >= 75 ? 7 : req.age >= 65 ? 5 : req.age >= 55 ? 3 : req.age >= 45 ? 1 : 0;
  const chol_points = req.total_cholesterol >= 280 ? 3 : req.total_cholesterol >= 230 ? 2 : req.total_cholesterol >= 200 ? 1 : 0;
  const hdl_points = req.hdl >= 60 ? -1 : req.hdl < 40 ? 2 : 0;
  const sbp_points = req.sbp >= 160 ? 3 : req.sbp >= 140 ? 2 : req.sbp >= 130 ? 1 : 0;
  const total = age_points + chol_points + hdl_points + sbp_points +
    (req.htn_treated ? 1 : 0) + (req.diabetes ? 2 : 0) + (req.smoker ? 2 : 0);
  const female_adjust = req.age ? -1 : 0;
  const ten_year = total + female_adjust > 12 ? 'high_greater_than_20' :
    total + female_adjust > 7 ? 'intermediate_10_20' :
      total + female_adjust > 4 ? 'low_intermediate_5_10' : 'low_less_than_5';
  return {
    score_points: total + female_adjust,
    ten_year,
    recommendation: ten_year.startsWith('high') ? 'high_intensity_statin' :
      ten_year.startsWith('intermediate') ? 'moderate_intensity_statin_with_risk_enhancers' :
        ten_year.startsWith('low_intermediate') ? 'moderate_statin_or_lifestyle_then_risk_enhancers' : 'lifestyle_intensive',
    citations: CITATIONS,
  };
}

function statin_intensity(req) {
  ensureNumber(req.ldl, 'ldl');
  ensureBool(req.cvd, 'cvd');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.egfr_lt_30, 'egfr_lt_30');
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.hepatic_active, 'hepatic_active');

  let intensity;
  if (req.cvd) intensity = 'high_intensity_statin_target_ldl_below_70';
  else if (req.diabetes && req.ldl >= 190) intensity = 'high_intensity_statin';
  else if (req.ldl >= 190) intensity = 'high_intensity_statin';
  else if (req.diabetes) intensity = 'moderate_intensity_statin_with_age_risk_enhancers';
  else intensity = 'lifestyle_then_low_moderate_per_risk';
  const contraindications = [];
  if (req.pregnant) contraindications.push('pregnancy_all_statin_avoid');
  if (req.egfr_lt_30) contraindications.push('avoid_high_dose_simvastatin_or_pravastatin_safe');
  if (req.hepatic_active) contraindications.push('avoid_all_statin_evaluate_underlying_liver_disease');
  return {
    intensity,
    contraindications,
    monitoring: req.hepatic_active ? 'no_statin_due_to_liver' : 'lipid_panel_q4_12_weeks_lft_baseline_then_if_symptomatic',
    citations: CITATIONS,
  };
}

module.exports = { risk, statin_intensity, CITATIONS, ValidationError };