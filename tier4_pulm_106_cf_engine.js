'use strict';
// TIER4_PULM-106 Cystic Fibrosis
const CITATIONS = [
  { id: 'CFF-2024', source: 'Cystic Fibrosis Foundation', year: 2024 }
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
function cfModulator(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 100);
  const mutation = ensureEnum(input, 'mutation', ['f508del_homozygous', 'f508del_heterozygous', 'g551d', 'other_gating', 'minimal_function', 'unknown', 'other']);
  const fvc = ensureNumber(input, 'fvc_pct', 0, 200);
  const fev1_val = ensureNumber(input, 'fev1_pct', 0, 200);
  const modulator = (mutation === 'f508del_homozygous' && age >= 12) ? 'elexacaftor_tezacaftor_ivacaftor_trikafta' :
    (mutation === 'g551d' || mutation === 'other_gating') ? 'ivacaftor_kalydeco' :
    (mutation === 'f508del_heterozygous' && age >= 12) ? 'tezacaftor_ivacaftor_symdeko' :
    'genotype_review_then_modulator';
  return {
    module: 'tier4_pulm_106_modulator',
    patient_id: patientId,
    age_years: age,
    mutation,
    fvc_pct: fvc,
    fev1_pct: fev1_val,
    modulator,
    monitoring: 'q1mo_lfts_q3mo_labs_q3mo_imaging_q1y_assessment',
    citations: CITATIONS
  };
}
function cfExacerbation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const organism = ensureEnum(input, 'organism', ['pseudomonas', 'staph_aureus', 'h_influenza', 'mrsa', 'achromobacter', 'stenotrophomonas', 'other', 'culture_negative', 'pending']);
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const therapy = (severity === 'severe') ? 'iv_anti_pseudomonal_beta_lactam_plus_aminoglycoside_then_review' :
    (severity === 'moderate') ? 'iv_then_oral_review_targeted_to_culture' :
    (organism === 'pseudomonas') ? 'oral_cipro_or_iv_then_inhaled_tobramycin' :
    'oral_amox_clav_or_cephalexin_then_review';
  return {
    module: 'tier4_pulm_106_exac',
    patient_id: patientId,
    organism,
    severity,
    therapy,
    monitoring: 'q24h_review_q1wk_labs_q2wk_imaging_q3mo_pfts',
    citations: CITATIONS
  };
}
module.exports = {
  cfModulator,
  cfExacerbation,
  CITATIONS,
  ValidationError
};