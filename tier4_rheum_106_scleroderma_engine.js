'use strict';
// TIER4_RHEUM-106 Systemic Sclerosis (Scleroderma)
const CITATIONS = [
  { id: 'ACR-SSc-2024', source: 'ACR/EULAR SSc Classification', year: 2024 }
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
function sclerodermaSubset(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subset = ensureEnum(input, 'subset', ['diffuse', 'limited', 'sine_scleroderma', 'early', 'overlap', 'unknown']);
  const antibody = ensureEnum(input, 'ab', ['anti_scl70', 'anti_centromere', 'anti_rna_polymerase_iii', 'anti_u1rnp', 'anti_pm_scl', 'negative', 'pending']);
  const ild = input.ild === true;
  const renal_crisis = input.renal_crisis_risk === true;
  const therapy = (subset === 'diffuse') ? 'mmf_for_immuno_modulation_then_assess' :
    (subset === 'limited') ? 'no_immunosuppression_review_screen_htn_pah' :
    (subset === 'early') ? 'consider_mmf_within_5y_onset' :
    'standard_immunosuppression';
  const monitoring = (renal_crisis) ? 'q1_to_4wk_bp_creatinine_q3mo' : 'q3mo_labs_q6mo_pfts_q1y_echocardiogram';
  return {
    module: 'tier4_rheum_106_subset',
    patient_id: patientId,
    subset,
    ab: antibody,
    ild,
    renal_crisis_risk: renal_crisis,
    therapy,
    monitoring,
    citations: CITATIONS
  };
}
function pahScreening(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sys_pap = ensureNumber(input, 'systolic_pap_mmhg', 0, 200);
  const ntprobnp = ensureNumber(input, 'ntprobnp', 0, 50000);
  const dlco = ensureNumber(input, 'dlco_pct', 0, 100);
  const high_risk = (sys_pap >= 35 || ntprobnp >= 1400 || dlco <= 50);
  const plan = (high_risk) ? 'rheum_cardiopulmonary_refer_right_heart_cath' : 'q1y_echocardiogram_pfts';
  return {
    module: 'tier4_rheum_106_pah',
    patient_id: patientId,
    systolic_pap_mmhg: sys_pap,
    ntprobnp,
    dlco_pct: dlco,
    high_risk,
    plan,
    citations: CITATIONS
  };
}
module.exports = {
  sclerodermaSubset,
  pahScreening,
  CITATIONS,
  ValidationError
};