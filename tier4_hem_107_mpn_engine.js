'use strict';
// TIER4_HEM-107 Myeloproliferative Neoplasms (MPN)
const CITATIONS = [
  { id: 'WHO-MPN-2024', source: 'WHO MPN Classification', year: 2024 }
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
function mpnStratify(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const diagnosis = ensureEnum(input, 'dx', ['pv', 'et', 'mf_primary', 'cml', 'mds_mpn_overlap', 'other', 'unclear']);
  const hgb = ensureNumber(input, 'hgb_g_dl', 0, 25);
  const plt = ensureNumber(input, 'platelet', 0, 2000);
  const jak2 = ensureEnum(input, 'jak2', ['positive', 'negative', 'pending']);
  const high_risk = (diagnosis === 'pv' && (hgb > 16.5 || plt > 1000 || jak2 === 'positive')) ? 'high_risk' :
    (diagnosis === 'et' && plt >= 1500) ? 'high_risk' :
    (diagnosis === 'mf_primary') ? 'review_dipps_then_decide' : 'standard_risk';
  const therapy = (diagnosis === 'pv' && high_risk === 'high_risk') ? 'phlebotomy_target_hct_45_plus_low_dose_aspirin_plus_hydroxyurea' :
    (diagnosis === 'et' && high_risk === 'high_risk') ? 'hydroxyurea_or_anagrelide_plus_low_dose_aspirin' :
    (diagnosis === 'mf_primary') ? 'jak_inhibitor_then_review_then_transplant' :
    (diagnosis === 'cml') ? 'tyrosine_kinase_inhibitor_imatinib_dasatinib' :
    'observe_then_review_q3mo';
  return {
    module: 'tier4_hem_107_mpn',
    patient_id: patientId,
    diagnosis: diagnosis,
    hgb_g_dl: hgb,
    platelet: plt,
    jak2,
    risk: high_risk,
    therapy,
    monitoring: 'q3mo_blood_q6mo_bone_marrow_q1y_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  mpnStratify,
  CITATIONS,
  ValidationError
};