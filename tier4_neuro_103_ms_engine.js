'use strict';
// TIER4_NEURO-103 Multiple Sclerosis
const CITATIONS = [
  { id: 'ECTRIMS-2024', source: 'European Committee Treatment Research MS', year: 2024 },
  { id: 'AAN-2024', source: 'American Academy Neurology', year: 2024 }
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
function msDiagnosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const clinical_attacks = ensureNumber(input, 'clinical_attacks', 0, 50);
  const mri_lesions = ensureNumber(input, 'mri_lesions', 0, 100);
  const csocb = ensureNumber(input, 'csf_oligoclonal_bands', 0, 20);
  const diagnosis = (clinical_attacks >= 2 && mri_lesions >= 2) ? 'rms_mcdonald_2017' :
    (clinical_attacks >= 1 && mri_lesions >= 1 && csocb > 0) ? 'rms_dissemination_in_time_and_space' :
    (clinical_attacks === 0 && mri_lesions >= 1 && csocb > 0) ? 'ris' : 'under_review';
  const subtype = ensureEnum(input, 'subtype', ['ris', 'cis', 'rms', 'spms', 'ppms', 'unknown']);
  return {
    module: 'tier4_neuro_103_dx',
    patient_id: patientId,
    clinical_attacks,
    mri_lesions,
    csocb,
    diagnosis,
    subtype,
    monitoring: 'mri_q6mo_first_2yr_then_q1y',
    citations: CITATIONS
  };
}
function msDmtSelection(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const activity = ensureEnum(input, 'activity', ['low', 'moderate', 'high']);
  const jcv = ensureEnum(input, 'jcv_status', ['negative', 'positive', 'unknown']);
  const platform = ['interferon_beta', 'glatiramer', 'dimethyl_fumarate', 'teriflunomide'];
  const high_efficacy = ['ocrelizumab', 'natalizumab', 'fingolimod', 'cladribine', 'alemtuzumab'];
  const recommended = activity === 'high' || jcv === 'positive' ? high_efficacy : platform;
  const specific = (activity === 'high' && jcv === 'positive') ? 'ocrelizumab_or_cladribine' : (jcv === 'positive' ? 'natalizumab_with_jcv_index_stratification' : 'dimethyl_fumarate_or_glatiramer');
  return {
    module: 'tier4_neuro_103_dmt',
    patient_id: patientId,
    activity,
    jcv_status: jcv,
    recommended_class: recommended,
    first_line: specific,
    monitoring: 'mri_q6mo_lfts_cbc_ash_per_choice',
    citations: CITATIONS
  };
}
function msRelapse(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptoms = Array.isArray(input.symptoms) ? input.symptoms : [];
  const edss = ensureNumber(input, 'edss', 0, 10);
  const mri_active = input.mri_gad_enhancement === true;
  const therapy = (edss >= 4 || mri_active) ? 'iv_methylprednisolone_1g_3_to_5_days' : 'observe_if_mild';
  return {
    module: 'tier4_neuro_103_relapse',
    patient_id: patientId,
    symptoms,
    edss,
    mri_active,
    therapy,
    rehab: 'PT_OT_neuro_rehab_2_to_4_weeks_afte_steroid',
    citations: CITATIONS
  };
}
module.exports = {
  msDiagnosis,
  msDmtSelection,
  msRelapse,
  CITATIONS,
  ValidationError
};
