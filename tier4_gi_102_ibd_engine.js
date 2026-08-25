'use strict';
// TIER4_GI-102 Inflammatory Bowel Disease
const CITATIONS = [
  { id: 'ECCO-2024', source: 'European Crohn Colitis Organisation', year: 2024 }
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
function ibdDiagnosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['crohns', 'ulcerative_colitis', 'ibd_unclassified', 'pouchitis', 'microscopic_colitis']);
  const crp = ensureNumber(input, 'crp', 0, 200);
  const calprotectin = ensureNumber(input, 'fecal_calprotectin', 0, 5000);
  const endoscopy = ensureEnum(input, 'endoscopy', ['not_done', 'performed', 'pending']);
  const activity = (crp > 10 || calprotectin > 250) ? 'active' : 'remission';
  return {
    module: 'tier4_gi_102_dx',
    patient_id: patientId,
    subtype,
    crp,
    calprotectin,
    endoscopy,
    activity,
    monitoring: 'q3mo_calprotectin_labs_then_q6mo_endoscopy_q1_to_3y',
    citations: CITATIONS
  };
}
function ucSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stool_count = ensureNumber(input, 'stools_per_day', 0, 30);
  const bleeding = input.bleeding === true;
  const mayo = ensureNumber(input, 'mayo_score', 0, 12);
  const severe = (stool_count >= 6 && bleeding && mayo >= 9);
  const therapy = severe ? 'infliximab_vedolizumab_or_ixekizumab_surgery_if_refractory' :
    (mayo >= 5) ? 'biologic_or_small_molecule' :
    'mesalamine_topical_or_oral';
  return {
    module: 'tier4_gi_102_uc_severity',
    patient_id: patientId,
    stool_count,
    bleeding,
    mayo_score: mayo,
    severe,
    therapy,
    citations: CITATIONS
  };
}
function ibdTherapy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['crohns', 'ulcerative_colitis']);
  const moderate = ensureEnum(input, 'moderate', ['mild', 'moderate', 'severe']);
  const loss_of_response = input.loss_of_response_to_anti_tnf === true;
  const therapy = {
    crohns: {
      mild: 'budesonide_or_5asa_or_antibiotic',
      moderate: 'immunosuppressant_azathioprine_methotrexate',
      severe: 'biologic_anti_tnf_or_vedolizumab_or_ustekinumab'
    },
    ulcerative_colitis: {
      mild: '5asa_topical_or_oral',
      moderate: 'biologic_vedolizumab_or_ustekinumab',
      severe: 'biologic_jak_inhibitor_or_surgery'
    }
  };
  let first = therapy[subtype][moderate];
  if (loss_of_response) first = 'switch_class_anti_integrin_or_jak_inhibitor';
  return {
    module: 'tier4_gi_102_therapy',
    patient_id: patientId,
    subtype,
    moderate,
    loss_of_response_to_anti_tnf: loss_of_response,
    therapy: first,
    monitoring: 'q3mo_q6mo_imaging_labs',
    citations: CITATIONS
  };
}
module.exports = {
  ibdDiagnosis,
  ucSeverity,
  ibdTherapy,
  CITATIONS,
  ValidationError
};
