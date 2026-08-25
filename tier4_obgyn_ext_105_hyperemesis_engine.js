'use strict';
// TIER4_OBGYN_EXT-105: Hyperemesis gravidarum - severity + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACOG_Hyperemesis_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function severity(req) {
  ensureNumber(req.episodes_per_day, 'episodes_per_day');
  ensureBool(req.unable_to_keep_fluids, 'unable_to_keep_fluids');
  ensureNumber(req.weight_loss_kg, 'weight_loss_kg');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.ketones_positive, 'ketones_positive');
  ensureNumber(req.ketone_level, 'ketone_level');
  ensureBool(req.electrolyte_disturbance, 'electrolyte_disturbance');

  const hyperemesis = req.episodes_per_day >= 3 && req.unable_to_keep_fluids && (req.weight_loss_kg >= 5 || req.ketones_positive);
  const severe = hyperemesis && (req.electrolyte_disturbance || req.ketone_level >= 3 || req.weight_loss_kg >= 10);
  return {
    severity: severe ? 'severe' : hyperemesis ? 'moderate' : 'mild',
    hyperemesis_diagnosis: hyperemesis,
    dehydration_risk: req.episodes_per_day >= 5 || req.weight_loss_kg >= 7,
    inpatient_criteria: severe || req.electrolyte_disturbance || req.weight_loss_kg >= 10,
    treatment: severe ? 'admit_iv_fluids_electrolyte_repletion_ondansetron_q8h' :
      hyperemesis ? 'ondansetron_4_to_8mg_q8h_vitamin_b6_with_doxylamine_thiamine' :
        'lifestyle_dietary_modifications_ginger_pressure_points',
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureStr(req.severity, 'severity'); // mild | moderate | severe
  ensureBool(req.pregnant, 'pregnant');
  ensureBool(req.iv_access, 'iv_access');

  const first_line = req.severity === 'severe' ? 'admit_iv_fluids_normal_saline_with_5_percent_dextrose_and_thiamine_ondansetron_iv' :
    req.severity === 'moderate' ? 'oral_ondansetron_4_to_8mg_q8h_metoclopramide_10mg_q8h_with_vitamin_b6' :
      'lifestyle_dietary_changes_ginger_vitamin_b6';
  const steroids = req.severity === 'severe' && req.first_line_failed ? 'iv_methylprednisolone_then_oral_prednisone' : 'no_steroids';
  const reassess = req.severity === 'mild' ? 'follow_up_1_week_then_routine' :
    req.severity === 'moderate' ? 'follow_up_2_days_reassess_response' : 'inpatient_reassess_q12_24h';
  return {
    first_line,
    steroids,
    reassess,
    citations: CITATIONS,
  };
}

function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

module.exports = { severity, treat, CITATIONS, ValidationError };