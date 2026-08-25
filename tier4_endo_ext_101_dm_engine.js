'use strict';
// TIER4_ENDO_EXT-101: DM - insulin titration + DKA protocol
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ADA_DM_2024', 'ADA_DKA_2009'];

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

function insulin_titration(req) {
  ensureNumber(req.fbg, 'fbg');
  ensureNumber(req.pre_dinner_bg, 'pre_dinner_bg');
  ensureNumber(req.current_total_daily_dose, 'current_total_daily_dose');
  ensureNumber(req.hypoglycemia_per_week, 'hypoglycemia_per_week');
  ensureNumber(req.a1c, 'a1c');

  const basal_dose = Math.round(req.current_total_daily_dose * 0.5);
  let adjustment = 'maintain';
  if (req.hypoglycemia_per_week >= 2) adjustment = 'decrease_10_20_percent';
  else if (req.fbg > 130) adjustment = 'increase_2_units_every_3_days';
  else if (req.fbg < 80) adjustment = 'decrease_basal_or_increase_glucose_monitoring';
  return {
    fbg: req.fbg,
    pre_dinner_bg: req.pre_dinner_bg,
    basal_dose_units: basal_dose,
    adjustment,
    a1c_target: req.a1c < 7 ? 'continue_target_7_or_less' : req.a1c < 9 ? 'target_7_in_3_6_months' : 'target_8_individualized',
    citations: CITATIONS,
  };
}

function dka(req) {
  ensureNumber(req.blood_glucose, 'blood_glucose');
  ensureNumber(req.bicarbonate, 'bicarbonate');
  ensureNumber(req.ph, 'ph');
  ensureNumber(req.anion_gap, 'anion_gap');
  ensureBool(req.ketones_present, 'ketones_present');
  ensureNumber(req.potassium, 'potassium');

  const severe = req.ph < 7.1 || req.bicarbonate < 5 || req.anion_gap > 25;
  const protocol = severe ? 'iv_insulin_drip_with_aggressive_fluid_resuscitation_icu' :
    req.blood_glucose > 250 && req.bicarbonate < 18 ? 'iv_insulin_drip_then_subq_when_anion_gap_closed' :
      'subq_insulin_protocol_with_close_monitoring';
  const k_replacement = req.potassium < 3.3 ? 'replace_k_before_insulin' :
    req.potassium > 5.3 ? 'no_k_supplementation_insulin_lowers_k' :
      'k_20_30_meq_per_liter_of_fluid';
  return {
    severity: severe ? 'severe' : 'moderate_or_mild',
    blood_glucose: req.blood_glucose,
    ph: req.ph,
    bicarbonate: req.bicarbonate,
    anion_gap: req.anion_gap,
    protocol,
    k_replacement,
    dextrose_addition: req.blood_glucose < 200 ? 'add_d5_to_fluid' : 'no_dextrose_until_below_200',
    monitoring: ['bg_q1h', 'anion_gap_q2h', 'k_q4h', 'fluid_balance_q4h'],
    citations: CITATIONS,
  };
}

module.exports = { insulin_titration, dka, CITATIONS, ValidationError };