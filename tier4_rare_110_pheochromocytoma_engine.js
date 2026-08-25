'use strict';
// TIER4_RARE-110 Pheochromocytoma & Paraganglioma
const CITATIONS = [
  { id: 'ES-2024', source: 'Endocrine Society - Pheochromocytoma and Paraganglioma', year: 2024 },
  { id: 'NCCN-PPGL', source: 'NCCN Guidelines - Pheochromocytoma/Paraganglioma', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function ppglBiochemicalDx(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const plasma_metanephrine = ensureNumber(input, 'plasma_free_metanephrine_pg_ml', 0, 5000);
  const plasma_normetanephrine = ensureNumber(input, 'plasma_free_normetanephrine_pg_ml', 0, 5000);
  const urinary_metanephrine_24h = ensureNumber(input, 'urinary_metanephrine_24h_ug', 0, 5000);
  const urinary_normetanephrine_24h = ensureNumber(input, 'urinary_normetanephrine_24h_ug', 0, 5000);
  const elevated = (plasma_metanephrine > 88 || plasma_normetanephrine > 180 || urinary_metanephrine_24h > 400 || urinary_normetanephrine_24h > 900);
  const flags = [];
  if (elevated) flags.push('CONFIRM_WITH_REPEAT_TEST_OR_SUPPLEMENT');
  if (plasma_normetanephrine > 1000) flags.push('NORADRENERGIC_PREDOMINANT_SCREEN_SDHX_VHL');
  if (plasma_metanephrine > 1000) flags.push('ADRENERGIC_PREDOMINANT_SCREEN_RET_VHL');
  return {
    module: 'tier4_rare_110_ppgl_biochem',
    patient_id: patientId,
    labs: { plasma_metanephrine, plasma_normetanephrine, urinary_metanephrine_24h, urinary_normetanephrine_24h },
    elevated,
    flags,
    citations: CITATIONS
  };
}
function ppglAlphaBlockade(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bp_systolic = ensureNumber(input, 'bp_systolic', 0, 300);
  const bp_diastolic = ensureNumber(input, 'bp_diastolic', 0, 200);
  const heart_rate = ensureNumber(input, 'heart_rate', 0, 250);
  const on_phenoxy = input.on_phenoxybenzamine === true;
  const days_to_surgery = ensureNumber(input, 'days_to_surgery', 0, 90);
  const target = {
    bp_target: 'below_130_over_80',
    hr_target: 'below_85',
    salt_and_fluid: 'high_intake_if_tolerated_pretumor_removal'
  };
  const therapy = {
    alpha_blocker: on_phenoxy ? 'continue_phenoxybenzamine' : 'initiate_phenoxybenzamine_10mg_bid_titrate',
    beta_blocker: 'only_after_alpha_blockade_achieved',
    ccb: 'amlodipine_adjunct_if_needed',
    metyrosine: 'consider_for_catecholamine_crisis_or_short_preop'
  };
  const monitoring = {
    bp_laying_standing: 'twice_daily',
    hr: 'resting_target_below_85',
    ecg: 'baseline_and_weekly',
    duration: days_to_surgery >= 7 ? 'adequate' : 'prolong_to_at_least_7_days'
  };
  return {
    module: 'tier4_rare_110_ppgl_alpha_blockade',
    patient_id: patientId,
    bp: { systolic: bp_systolic, diastolic: bp_diastolic },
    heart_rate,
    on_phenoxy,
    days_to_surgery,
    therapy,
    target,
    monitoring,
    citations: CITATIONS
  };
}
module.exports = {
  ppglBiochemicalDx,
  ppglAlphaBlockade,
  CITATIONS,
  ValidationError
};
