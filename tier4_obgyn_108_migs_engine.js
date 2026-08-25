'use strict';
// TIER4_OBGYN-108 Minimally Invasive Gynecologic Surgery
const CITATIONS = [
  { id: 'AAGL-2024', source: 'American Association Gynecologic Laparoscopists', year: 2024 }
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
function fibroidManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const size_cm = ensureNumber(input, 'fibroid_size_cm', 0, 30);
  const symptom = ensureEnum(input, 'symptoms', ['none', 'bleeding', 'pressure', 'pain', 'fertility', 'recurrent_pregnancy_loss']);
  const count = ensureNumber(input, 'fibroid_count', 0, 50);
  const location = ensureEnum(input, 'location', ['submucosal', 'intramural', 'subserosal', 'pedunculated', 'cervical']);
  const plan = {
    none: 'observe',
    bleeding: 'medical_tranexamic_or_hormonal_medical_gnrh',
    pressure: 'myomectomy_or_uae',
    pain: 'myomectomy_or_hysterectomy',
    fertility: 'myomectomy_submucosal_hysteroscopic',
    recurrent_pregnancy_loss: 'myomectomy_submucosal_or_subserosal'
  };
  const medical = (size_cm < 6 && symptom === 'bleeding') ? 'medical_options_tranexamic_ngs_levonorgestrel_iud' : 'not_first_line';
  return {
    module: 'tier4_obgyn_108_fibroid',
    patient_id: patientId,
    size_cm,
    count,
    location,
    symptom,
    plan: plan[symptom],
    medical,
    procedure: location === 'submucosal' ? 'hysteroscopic_myomectomy' : (size_cm >= 6 ? 'laparoscopic_myomectomy_or_robot' : 'observe_or_medical'),
    citations: CITATIONS
  };
}
function endometriosisManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 60);
  const pain_score = ensureNumber(input, 'pain_score', 0, 10);
  const infertility = input.infertility === true;
  const deep_infiltrating = input.deep_infiltrating === true;
  const therapy = {
    medical_first_line: 'continuous_ocp_or_progestin_then_lng_iud',
    medical_second_line: 'ngs_or_dienogest',
    surgery: pain_score >= 7 || deep_infiltrating || infertility ? 'laparoscopic_excision_with_adhesiolysis' : 'medical_only',
    fertility: infertility ? 'refer_ivi_after_6_month_medical' : 'medical_managed'
  };
  return {
    module: 'tier4_obgyn_108_endometriosis',
    patient_id: patientId,
    age,
    pain_score,
    infertility,
    deep_infiltrating,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  fibroidManagement,
  endometriosisManagement,
  CITATIONS,
  ValidationError
};
