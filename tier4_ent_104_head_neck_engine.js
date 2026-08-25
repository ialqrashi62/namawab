'use strict';
// TIER4_ENT-104 Head & Neck Oncology
const CITATIONS = [
  { id: 'NCCN-HNC-2024', source: 'NCCN Head Neck Cancer', year: 2024 },
  { id: 'AHNS-2024', source: 'American Head Neck Society', year: 2024 }
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
function neckMassWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const smoking = input.smoking === true;
  const alcohol = input.alcohol === true;
  const size_cm = ensureNumber(input, 'mass_size_cm', 0, 30);
  const persistent = input.persistent_4_weeks === true;
  const tenderness = input.tender === true;
  const hpv = ensureEnum(input, 'hpv_status', ['unknown', 'positive', 'negative']);
  const red_flag = (age > 40 && persistent) || smoking || (size_cm > 1.5 && !tenderness);
  const workup = red_flag ? 'fna_with_p16_or_p53_immunohistochemistry_then_staging_ct_pet' : 'observation_antibiotic_then_recheck';
  if (red_flag) {
    return {
      module: 'tier4_ent_104_neck',
      patient_id: patientId,
      age,
      smoking,
      alcohol,
      size_cm,
      persistent,
      hpv,
      red_flag,
      workup,
      citations: CITATIONS
    };
  }
  return {
    module: 'tier4_ent_104_neck',
    patient_id: patientId,
    age,
    size_cm,
    persistent,
    red_flag,
    workup,
    citations: CITATIONS
  };
}
function headNeckTStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const site = ensureEnum(input, 'site', ['oral_cavity', 'oropharynx', 'larynx', 'hypopharynx', 'nasopharynx', 'salivary', 'sinus', 'unknown']);
  const t = ensureNumber(input, 't_stage', 1, 4);
  const n = ensureNumber(input, 'n_stage', 0, 3);
  const m = ensureNumber(input, 'm_stage', 0, 1);
  const hpv = ensureEnum(input, 'hpv_status', ['unknown', 'positive', 'negative']);
  const stage = (m === 1) ? 'stage_4_m1' : (t >= 3 || n >= 2) ? 'stage_3_locally_advanced' : 'stage_1_2_early';
  const therapy = stage === 'stage_4_m1' ? 'systemic_immunotherapy_palliative' :
    (stage === 'stage_3_locally_advanced' ? 'cisplatin_and_radiation_70gy' : 'surgery_with_selective_neck_dissection');
  return {
    module: 'tier4_ent_104_staging',
    patient_id: patientId,
    site,
    t,
    n,
    m,
    hpv,
    stage,
    therapy,
    monitoring: 'ct_mri_pet_3mo_post_then_q3mo_x2_q6mo_x3',
    citations: CITATIONS
  };
}
function thyroidNodule(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const size_cm = ensureNumber(input, 'nodule_size_cm', 0, 10);
  const tirads = ensureEnum(input, 'tirads', ['1', '2', '3', '4', '5']);
  const bethesda = ensureEnum(input, 'bethesda', ['1', '2', '3', '4', '5', '6']);
  const surgery = (tirads === '4' && size_cm >= 1.5) || (tirads === '5') || (bethesda === '5' || bethesda === '6');
  const biopsy = (tirads === '3' && size_cm >= 2.5) || tirads === '4' || tirads === '5';
  return {
    module: 'tier4_ent_104_thyroid',
    patient_id: patientId,
    size_cm,
    tirads,
    bethesda,
    biopsy_indicated: biopsy,
    surgery_indicated: surgery,
    monitoring: 'us_q6mo_to_q1y_lifelong',
    citations: CITATIONS
  };
}
module.exports = {
  neckMassWorkup,
  headNeckTStaging,
  thyroidNodule,
  CITATIONS,
  ValidationError
};
