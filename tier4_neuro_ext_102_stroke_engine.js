'use strict';
// TIER4_NEURO_EXT-102: Stroke (subtype + secondary prevention)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AHA_Stroke_2021', 'ESO_Stroke_2021'];

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

function tpa_eligible(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.nihss, 'nihss');
  ensureNumber(req.symptoms_minutes, 'symptoms_minutes');
  ensureBool(req.bleeding_active, 'bleeding_active');
  ensureBool(req.recent_surgery, 'recent_surgery');
  ensureBool(req.stroke_or_tia_3mo, 'stroke_or_tia_3mo');
  ensureBool(req.head_trauma_3mo, 'head_trauma_3mo');
  ensureBool(req.mrs_2_or_higher, 'mrs_2_or_higher');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.glucose, 'glucose');
  ensureBool(req.anti_coagulated, 'anti_coagulated');

  const inclusions = req.age >= 18 && req.symptoms_minutes <= 270 && req.nihss >= 6;
  const exclusions = req.bleeding_active || req.recent_surgery || req.stroke_or_tia_3mo ||
    req.head_trauma_3mo || req.mrs_2_or_higher || req.sbp > 185 || req.glucose < 50 || req.glucose > 400 || req.anti_coagulated;
  const eligible = inclusions && !exclusions;
  return {
    age: req.age,
    nihss: req.nihss,
    symptoms_minutes: req.symptoms_minutes,
    eligible,
    inclusions_met: inclusions,
    exclusions,
    treatment_if_eligible: eligible ? 'tenecteplase_0.25mg_per_kg_or_alteplase_0.9mg_per_kg' : 'consider_tenecteplase_off_label_or_thrombectomy',
    citations: CITATIONS,
  };
}

function secondary_prevention(req) {
  ensureStr(req.type, 'type'); // ischemic | hemorrhagic
  ensureBool(req.afib, 'afib');
  ensureBool(req.htn, 'htn');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.hyperlipidemia, 'hyperlipidemia');
  ensureBool(req.smoker, 'smoker');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.ldl, 'ldl');

  const antiplatelet = req.afib ? 'anticoagulation_preferred_over_antiplatelet' : 'aspirin_or_clopidogrel_or_dapt_short_term';
  const anticoagulation = req.afib ? req.type === 'ischemic' ? 'doac_within_14_days_or_after_hemorrhage_excluded' : 'defer_anticoagulation_until_hemorrhage_resolved' : 'not_indicated';
  const statin = req.type === 'ischemic' && req.ldl >= 70 ? 'high_intensity_statin' : req.type === 'ischemic' ? 'moderate_or_high_intensity_statin' : 'not_routine';
  const bp_target = req.htn && req.sbp > 130 ? 'target_less_than_130_80' : 'individualized';
  const lifestyle = ['diet', 'exercise', 'smoking_cessation', 'limit_alcohol'];
  return {
    type: req.type,
    antiplatelet,
    anticoagulation,
    statin,
    bp_target,
    lifestyle,
    citations: CITATIONS,
  };
}

module.exports = { tpa_eligible, secondary_prevention, CITATIONS, ValidationError };