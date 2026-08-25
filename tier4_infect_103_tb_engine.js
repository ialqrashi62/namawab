'use strict';
// TIER4_INFECT-103 Tuberculosis
const CITATIONS = [
  { id: 'WHO-TB-2024', source: 'WHO TB Guidelines', year: 2024 }
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
function activeTb(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const site = ensureEnum(input, 'site', ['pulmonary', 'lymph_node', 'pleural', 'meningeal', 'abdominal', 'spinal', 'miliary', 'other']);
  const smear = ensureEnum(input, 'smear', ['positive', 'negative', 'pending']);
  const resistance = ensureEnum(input, 'resistance', ['drug_susceptible', 'mono_resistant_inh', 'mono_resistant_rif', 'mdr', 'xdr', 'pending']);
  const weight_kg = ensureNumber(input, 'weight_kg', 0, 300);
  const regimen = (resistance === 'drug_susceptible') ? 'hrze_2mo_then_hr_4mo_total_6mo' :
    (resistance === 'mdr' || resistance === 'xdr') ? 'individualized_bedaquiline_or_delamanid_regimen_18_to_24mo' :
    (resistance === 'mono_resistant_inh') ? 'hrze_plus_lfx_or_inj_6mo' :
    'sensitive_tb_until_resistance_result';
  return {
    module: 'tier4_infect_103_active',
    patient_id: patientId,
    site,
    smear,
    resistance,
    weight_kg,
    regimen,
    monitoring: 'q2wk_until_smear_neg_q1mo_labs_q3mo_imaging',
    citations: CITATIONS
  };
}
function ltbi(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const screening = ensureEnum(input, 'screening_test', ['tst', 'igra_positive', 'igra_negative', 'pending', 'unknown']);
  const high_risk = (input.hiv_positive === true || input.tnf_inhibitor === true || input.transplant === true || input.silicosis === true);
  const therapy = (screening === 'igra_positive' || screening === 'tst') ? (high_risk ? 'inh_300_x9mo_or_rifampin_4mo_or_3hp' : 'inh_x9mo_or_rifampin_4mo') :
    'no_ltbi_therapy_review_risk';
  return {
    module: 'tier4_infect_103_ltbi',
    patient_id: patientId,
    screening_test: screening,
    high_risk,
    therapy,
    monitoring: 'q1mo_lfts_q3mo_review',
    citations: CITATIONS
  };
}
module.exports = {
  activeTb,
  ltbi,
  CITATIONS,
  ValidationError
};