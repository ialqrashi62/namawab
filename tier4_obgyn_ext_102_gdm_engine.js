'use strict';
// TIER4_OBGYN_EXT-102: Gestational DM - screening + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ADA_GDM_2024', 'ACOG_GDM_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function screen(req) {
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.fpg, 'fpg');
  ensureNumber(req.ogtt_1h, 'ogtt_1h');
  ensureNumber(req.ogtt_2h, 'ogtt_2h');
  ensureNumber(req.hba1c, 'hba1c');

  const gdm = req.fpg >= 92 || req.ogtt_1h >= 180 || req.ogtt_2h >= 153 || req.hba1c >= 5.7 && req.hba1c < 6.5;
  const overt = req.fpg >= 126 || req.ogtt_2h >= 200 || req.hba1c >= 6.5;
  return {
    gestational_age_weeks: req.gestational_age_weeks,
    gdm_diagnosis: gdm,
    overt_diabetes: overt,
    first_trimester_overt_diabetes: req.gestational_age_weeks < 13 && (req.fpg >= 126 || req.hba1c >= 6.5),
    treatment: gdm && !overt ? 'medical_nutrition_therapy_self_monitoring_glucose' :
      overt ? 'insulin_then_metformin_lifestyle' : 'no_gdm_rescreen_in_4_weeks_if_normal',
    monitoring: gdm ? 'fasting_and_postprandial_glucose_q4_weeks' : 'routine_prenatal',
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureNumber(req.fpg, 'fpg');
  ensureNumber(req.postprandial_1h, 'postprandial_1h');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.lifestyle_failure, 'lifestyle_failure');

  const fpg_target = req.fpg > 95 || req.postprandial_1h > 140 ? 'initiate_pharmacotherapy' : 'lifestyle_continues';
  const insulin = req.fpg > 95 ? 'basal_insulin_nph_or_determir_then_meal_insulin' :
    req.postprandial_1h > 140 ? 'rapid_acting_insulin_lispro_aspart_with_meals' :
      'no_insulin';
  const metformin = req.lifestyle_failure && !req.fpg ? 'metformin_alternative' : 'metformin_secondary';
  const delivery = req.gestational_age_weeks < 39 ? 'expectant_with_antepartum_monitoring' : 'deliver_at_39_to_40_weeks';
  return {
    fpg_target: '<95',
    one_hour_postprandial_target: '<140',
    fpg_target_met: fpg_target,
    insulin,
    metformin,
    delivery_timing: delivery,
    postpartum_ogtt: 'q4_to_12_weeks_post_delivery_lifelong_diabetes_screening',
    citations: CITATIONS,
  };
}

module.exports = { screen, treat, CITATIONS, ValidationError };