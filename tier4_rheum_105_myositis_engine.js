'use strict';
// TIER4_RHEUM-105 Myositis & CTD-ILD
const CITATIONS = [
  { id: 'ACR-Myositis-2024', source: 'ACR Myositis Classification', year: 2024 }
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
function idiopathicInflammatoryMyopathy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ck = ensureNumber(input, 'ck', 0, 100000);
  const aldolase = ensureNumber(input, 'aldolase', 0, 100);
  const weakness = input.proximal_weakness === true;
  const antibody = ensureEnum(input, 'msa_status', ['anti_jo1', 'anti_mda5', 'anti_tif1g', 'anti_nxp2', 'anti_srp', 'anti_mi2', 'negative', 'not_tested']);
  const dyspnea = input.dyspnea === true;
  const suspicion = (ck >= 2000 && weakness) || (aldolase >= 15 && weakness);
  const therapy = (!suspicion) ? 'no_therapy_review' :
    (antibody === 'anti_mda5' && dyspnea) ? 'pulse_iv_steroids_ivig_then_jak_inhibitor' :
    'oral_prednisone_then_mtx_or_azathioprine_or_ivig';
  const mri = (suspicion) ? 'muscle_mri_with_stir_then_review' : 'not_needed';
  return {
    module: 'tier4_rheum_105_iim',
    patient_id: patientId,
    ck,
    aldolase,
    proximal_weakness: weakness,
    msa_status: antibody,
    dyspnea,
    suspicion,
    therapy,
    mri,
    monitoring: 'q2wk_labs_q3mo_mri_q3mo_pfts',
    citations: CITATIONS
  };
}
function antisynthetaseSyndrome(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const antibody = ensureEnum(input, 'ab', ['anti_jo1', 'anti_pl7', 'anti_pl12', 'anti_ej', 'anti_oj', 'anti_ks', 'negative', 'pending']);
  const triad_count = (input.myositis === true ? 1 : 0) + (input.ild === true ? 1 : 0) + (input.arthritis === true ? 1 : 0);
  const diagnosis = (antibody !== 'negative' && antibody !== 'pending' && triad_count >= 2) ? 'antisynthetase_syndrome' :
    (triad_count === 2) ? 'incomplete_review' : 'not_antisynthetase';
  const therapy = (diagnosis === 'antisynthetase_syndrome') ? 'prednisone_then_mtx_or_rituximab_then_review_ild' :
    'review_other';
  return {
    module: 'tier4_rheum_105_ass',
    patient_id: patientId,
    ab: antibody,
    triad_components: triad_count,
    diagnosis,
    therapy,
    monitoring: 'q3mo_pfts_q3mo_mri_q1y_screen_malignancy',
    citations: CITATIONS
  };
}
module.exports = {
  idiopathicInflammatoryMyopathy,
  antisynthetaseSyndrome,
  CITATIONS,
  ValidationError
};