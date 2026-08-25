'use strict';
// TIER4_NEPH-105 Electrolyte & Acid-Base
const CITATIONS = [
  { id: 'UpToDate-2024', source: 'UpToDate Electrolyte & Acid-Base', year: 2024 }
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
function hyperkalemia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const k = ensureNumber(input, 'potassium', 0, 12);
  const ecg_change = ensureEnum(input, 'ecg_change', ['none', 'peaked_t', 'prolonged_pr', 'wide_qrs', 'sine_wave']);
  const therapy = (k >= 6.5 || ecg_change === 'sine_wave' || ecg_change === 'wide_qrs') ? 'calcium_gluconate_insulin_dextrose_then_kayexalate_or_dialysis' :
    (k >= 5.5 || ecg_change !== 'none') ? 'insulin_dextrose_kayexalate_stop_acei_review' :
    'review_diet_meds_q1mo';
  return {
    module: 'tier4_neph_105_hyperk',
    patient_id: patientId,
    potassium: k,
    ecg_change,
    therapy,
    monitoring: 'q1_to_2h_potassium_recheck_q4h',
    citations: CITATIONS
  };
}
function hyponatremia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const na = ensureNumber(input, 'sodium', 0, 200);
  const osm = ensureNumber(input, 'serum_osm', 0, 1500);
  const volume = ensureEnum(input, 'volume_status', ['hypovolemic', 'euvolemic', 'hypervolemic']);
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe_symptomatic']);
  const therapy = (severity === 'severe_symptomatic') ? 'hypertonic_saline_3pct_100ml_bolus_then_review' :
    (volume === 'hypovolemic') ? 'isotonic_saline_replace_deficit_careful_correction' :
    (volume === 'euvolemic') ? 'fluid_restriction_then_vaptans_siadh_review' :
    'fluid_restriction_salt_restriction_review_diuretics';
  return {
    module: 'tier4_neph_105_hypona',
    patient_id: patientId,
    sodium: na,
    serum_osm: osm,
    volume_status: volume,
    severity,
    therapy,
    monitoring: 'q2h_na_correction_not_exceed_8_to_10_meq_per_day',
    citations: CITATIONS
  };
}
function metabolicAcidosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ph = ensureNumber(input, 'ph', 0, 14);
  const hco3 = ensureNumber(input, 'bicarbonate', 0, 50);
  const ag = ensureNumber(input, 'anion_gap', 0, 40);
  const etiology = ensureEnum(input, 'etiology', ['dka', 'lactic', 'uremic', 'rta', 'tube_loss', 'toxin', 'salicylate', 'other', 'unknown']);
  const severity = (ph < 7.1) ? 'severe' : (ph < 7.2) ? 'moderate' : 'mild';
  const therapy = (severity === 'severe' || etiology === 'uremic') ? 'iv_bicarbonate_then_dialysis_or_treat_underlying' :
    (severity === 'moderate') ? 'iv_bicarbonate_or_treat_underlying' :
    'treat_underlying_then_review_q24h';
  return {
    module: 'tier4_neph_105_acidosis',
    patient_id: patientId,
    ph,
    bicarbonate: hco3,
    anion_gap: ag,
    etiology,
    severity,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  hyperkalemia,
  hyponatremia,
  metabolicAcidosis,
  CITATIONS,
  ValidationError
};