'use strict';
// TIER4_ONC-101 Solid Tumor General Workup & Staging
const CITATIONS = [
  { id: 'AJCC-8th', source: 'AJCC TNM 8th Edition', year: 2024 }
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
function tnmStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const t = ensureNumber(input, 't_stage', 0, 4);
  const n = ensureNumber(input, 'n_stage', 0, 3);
  const m = ensureNumber(input, 'm_stage', 0, 1);
  const stage = (m === 1) ? 'stage_4' : (t >= 3 || n >= 2) ? 'stage_3' : (t === 2 || n === 1) ? 'stage_2' : 'stage_1';
  return {
    module: 'tier4_onc_101_tnm',
    patient_id: patientId,
    t,
    n,
    m,
    stage,
    monitoring: 'q3mo_imaging_q3mo_tumor_markers',
    citations: CITATIONS
  };
}
function ecogPerformanceStatus(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ecog = ensureNumber(input, 'ecog', 0, 4);
  const fit = (ecog <= 2) ? 'eligible_for_full_chemo' : 'consider_dose_reduction_or_best_supportive';
  return {
    module: 'tier4_onc_101_ecog',
    patient_id: patientId,
    ecog,
    fit_for_full_chemo: (ecog <= 2),
    therapy_recommendation: fit,
    citations: CITATIONS
  };
}
module.exports = {
  tnmStaging,
  ecogPerformanceStatus,
  CITATIONS,
  ValidationError
};