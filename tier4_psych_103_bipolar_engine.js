'use strict';
// TIER4_PSYCH-103 Bipolar Disorder
const CITATIONS = [
  { id: 'CANMAT-2024', source: 'CANMAT Bipolar Guidelines', year: 2024 }
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
function maniaAcute(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ygmrs = ensureNumber(input, 'ygmrs_score', 0, 60);
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const psychotic = input.psychotic_features === true;
  const therapy = (severity === 'severe' || psychotic) ? 'hospitalize_consider_ect_lithium_or_valproate_plus_atypical' :
    (severity === 'moderate') ? 'lithium_or_valproate_or_atypical_monotherapy' :
    'lithium_or_valproate_low_dose_then_review';
  return {
    module: 'tier4_psych_103_mania',
    patient_id: patientId,
    ygmrs_score: ygmrs,
    severity,
    psychotic_features: psychotic,
    therapy,
    monitoring: 'q1wk_until_response_then_q2wk_then_q1mo',
    citations: CITATIONS
  };
}
function bipolarMaintenance(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const recent_episodes = ensureNumber(input, 'episodes_last_2yr', 0, 20);
  const current_phase = ensureEnum(input, 'current_phase', ['euthymic', 'depressed', 'manic', 'mixed', 'rapid_cycling']);
  const therapy = (current_phase === 'rapid_cycling') ? 'lithium_or_valproate_combination_with_lamotrigine' :
    (recent_episodes >= 4) ? 'lithium_with_thyroid_q6mo_lithium_level' :
    'lithium_or_valproate_maintenance_q3mo';
  return {
    module: 'tier4_psych_103_maintenance',
    patient_id: patientId,
    episodes_last_2yr: recent_episodes,
    current_phase,
    therapy,
    monitoring: 'q3mo_lithium_lvl_q3mo_thyroid_q1y_ecg',
    citations: CITATIONS
  };
}
module.exports = {
  maniaAcute,
  bipolarMaintenance,
  CITATIONS,
  ValidationError
};