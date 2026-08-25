'use strict';
// TIER4_CARDIO-105 Peripheral Artery Disease & Vascular
const CITATIONS = [
  { id: 'AHA-PAD-2024', source: 'AHA PAD Lower Extremity', year: 2024 }
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
function padAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptoms = ensureEnum(input, 'symptoms', ['asymptomatic', 'claudication', 'rest_pain', 'tissue_loss']);
  const right_ankle = ensureNumber(input, 'right_ankle_brachial_index', 0, 2);
  const left_ankle = ensureNumber(input, 'left_ankle_brachial_index', 0, 2);
  const lower_abi = Math.min(right_ankle, left_ankle);
  const fontaine = symptoms === 'asymptomatic' ? 'I' : (symptoms === 'claudication' ? 'II' : (symptoms === 'rest_pain' ? 'III' : 'IV'));
  const therapy = {
    abstinence: 'smoking_cessation',
    exercise: 'supervised_exercise_30_min_3x_weekly',
    statin: 'high_intensity_statin',
    antiplatelet: 'aspirin_75_to_100_or_clopidogrel_75',
    ace_inhibitor: 'ramipril_10mg_or_equivalent',
    cilostazol: 'consider_claudication_100mg_bid',
    revascularization: (symptoms === 'rest_pain' || symptoms === 'tissue_loss') ? 'endovascular_or_surgical_revascularization' : 'not_initial'
  };
  return {
    module: 'tier4_cardio_105_pad',
    patient_id: patientId,
    symptoms,
    abi: lower_abi,
    fontaine_stage: fontaine,
    therapy,
    monitoring: 'q6mo_symptom_reassessment_q1y_abi',
    citations: CITATIONS
  };
}
function aorticAneurysm(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const location = ensureEnum(input, 'location', ['abdominal', 'thoracic', 'thoracoabdominal', 'unknown']);
  const diameter = ensureNumber(input, 'diameter_cm', 0, 15);
  const growth = ensureNumber(input, 'growth_rate_cm_year', 0, 5);
  const symptoms = input.symptomatic === true;
  const surgery = (location === 'abdominal' && diameter >= 5.5) || (location === 'thoracic' && diameter >= 6) || symptoms || (growth > 1);
  return {
    module: 'tier4_cardio_105_aaa',
    patient_id: patientId,
    location,
    diameter_cm: diameter,
    growth_rate_cm_year: growth,
    symptomatic: symptoms,
    surgery_indicated: surgery,
    monitoring: location === 'abdominal' ? 'us_q6mo_to_q1y' : 'cta_q6mo_to_q1y_growth_rate',
    citations: CITATIONS
  };
}
function carotidStenosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stenosis = ensureNumber(input, 'carotid_stenosis_pct', 0, 100);
  const symptomatic = input.symptomatic === true;
  const sx_criteria = (symptomatic && (stenosis >= 50)) ? 'cea_indicated_50_to_69_individualize_70_to_99' : 'asymptomatic_60_steno_offer_if_low_risk';
  const surgery = (symptomatic && stenosis >= 70) || (!symptomatic && stenosis >= 80);
  return {
    module: 'tier4_cardio_105_carotid',
    patient_id: patientId,
    stenosis_pct: stenosis,
    symptomatic,
    surgery_indicated: surgery,
    decision: sx_criteria,
    citations: CITATIONS
  };
}
module.exports = {
  padAssessment,
  aorticAneurysm,
  carotidStenosis,
  CITATIONS,
  ValidationError
};
