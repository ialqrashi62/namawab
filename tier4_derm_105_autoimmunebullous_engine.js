'use strict';
// TIER4_DERM-105 Autoimmune Bullous Diseases
// Pemphigus vulgaris, foliaceus, bullous pemphigoid, dermatitis herpetiformis
const CITATIONS = [
  { id: 'BAD-Bullous', source: 'British Association Dermatology - Bullous Diseases', year: 2024 }
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
function pemphigusVs(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const mucosal_inv = input.mucosal_involvement === true;
  const nikolsky = input.nikolsky_sign === true;
  const dsg1 = ensureNumber(input, 'dsg1_antibody_titer', 0, 1000);
  const dsg3 = ensureNumber(input, 'dsg3_antibody_titer', 0, 1000);
  const tzanck = input.tzanck_acantholytic === true;
  const subtype = mucosal_inv && dsg3 > 30 ? 'pemphigus_vulgaris'
    : (!mucosal_inv && dsg1 > 30 ? 'pemphigus_foliaceus' : 'pemphigus_unclassified');
  const therapy = {
    systemic_steroid: 'prednisone_1mg_kg_d_taper_over_12_18_month',
    steroid_sparing: 'azathioprine_2mg_kg_d_or_mycophenolate_or_rituximab_in_severe',
    rituximab: 'maintenance_every_6_months_severe_pv',
    supportive: 'wound_care_pain_management'
  };
  return {
    module: 'tier4_derm_105_pemphigus',
    patient_id: patientId,
    subtype,
    mucosal_inv,
    dsg1,
    dsg3,
    therapy,
    monitoring: 'titer_correlates_3_to_6_months',
    citations: CITATIONS
  };
}
function bullousPemphigoidManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 120);
  const bsa = ensureNumber(input, 'bsa_pct', 0, 100);
  const bp180 = ensureNumber(input, 'bp180_antibody', 0, 1000);
  const bp230 = ensureNumber(input, 'bp230_antibody', 0, 1000);
  const severity = bsa >= 30 ? 'severe'
    : bsa >= 10 ? 'moderate' : 'mild';
  const therapy = {
    mild: 'topical_clobetasol_0_05_bid',
    moderate: 'topical_steroid_plus_doxy_100mg_bid_or_prednisone_0_5mg_kg',
    severe: 'prednisone_0_75mg_kg_d_plus_azathioprine_plus_consider_omalizumab_or_dupilumab'
  };
  const picks = [null, 'mild', 'moderate', 'severe'];
  const pick = severity === 'severe' ? 'severe' : (severity === 'moderate' ? 'moderate' : 'mild');
  return {
    module: 'tier4_derm_105_bp',
    patient_id: patientId,
    age,
    bsa,
    antibodies: { bp180, bp230 },
    severity,
    therapy: therapy[pick],
    monitoring: { bsa_q_2wk: true, antibody_titer_3_months: true },
    citations: CITATIONS
  };
}
function bullousDiagnosisAlgorithm(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const mucosal = input.mucosal_involvement === true;
  const tense_blisters = input.tense_blisters === true;
  const dsg1 = ensureNumber(input, 'dsg1', 0, 1000);
  const dsg3 = ensureNumber(input, 'dsg3', 0, 1000);
  const bp180 = ensureNumber(input, 'bp180', 0, 1000);
  const bp230 = ensureNumber(input, 'bp230', 0, 1000);
  let diagnosis = 'undifferentiated_bullous';
  if (mucosal && (dsg3 > 30 || dsg1 > 30)) diagnosis = 'pemphigus_vulgaris';
  else if (!mucosal && dsg1 > 30) diagnosis = 'pemphigus_foliaceus';
  else if (tense_blisters && bp180 > 30) diagnosis = 'bullous_pemphigoid';
  else if (tense_blisters && bp230 > 30) diagnosis = 'bullous_pemphigoid';
  return {
    module: 'tier4_derm_105_algorithm',
    patient_id: patientId,
    diagnosis,
    next_step: 'pemphigus_or_bp_specific_therapy',
    citations: CITATIONS
  };
}
module.exports = {
  pemphigusVs,
  bullousPemphigoidManagement,
  bullousDiagnosisAlgorithm,
  CITATIONS,
  ValidationError
};
