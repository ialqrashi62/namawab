'use strict';
// TIER4_NEURO-107 Neuroimmunology: NMO, MOG, Autoimmune encephalitis
const CITATIONS = [
  { id: 'IPND-2024', source: 'International Panel NMO Diagnosis', year: 2024 }
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
function nmoDiagnosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const aquaporin4 = ensureEnum(input, 'aquaporin4', ['positive', 'negative', 'pending']);
  const mog = ensureEnum(input, 'mog', ['positive', 'negative', 'pending']);
  const optic_neuritis = input.optic_neuritis === true;
  const longitudinally_extensive = input.longitudinally_extensive_cord === true;
  const area_postrema = input.area_postrema_syndrome === true;
  const meets = (aquaporin4 === 'positive' && (optic_neuritis || longitudinally_extensive || area_postrema)) ? 'nmosd_2015_ipnd' :
    (mog === 'positive' && optic_neuritis) ? 'mog_associated_disorder' : 'further_workup';
  return {
    module: 'tier4_neuro_107_nmo',
    patient_id: patientId,
    aquaporin4,
    mog,
    optic_neuritis,
    longitudinally_extensive,
    area_postrema,
    diagnosis: meets,
    monitoring: 'mri_brain_spinal_orbit_q6mo',
    citations: CITATIONS
  };
}
function nmoTherapy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const antibody = ensureEnum(input, 'antibody', ['aquaporin4', 'mog', 'seronegative']);
  const acute_severity = ensureNumber(input, 'acute_severity', 0, 10);
  const acute = acute_severity >= 5 ? 'iv_methylprednisolone_1g_3_to_5d_then_plasmapheresis_5x' : 'iv_methylpred_3_to_5d';
  const long_term = {
    aquaporin4: 'rituximab_first_line_alternative_eculizumab_satralizumab',
    mog: 'ivig_or_rituximab_or_mycophenolate_review_response',
    seronegative: 'review_diagnosis_consider_other_syndromes'
  };
  return {
    module: 'tier4_neuro_107_nmo_tx',
    patient_id: patientId,
    antibody,
    acute_severity,
    acute_therapy: acute,
    long_term: long_term[antibody],
    monitoring: 'cd19_q3mo_for_rituximab',
    citations: CITATIONS
  };
}
function autoimmuneEncephalitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const antibody = ensureEnum(input, 'antibody', ['nmdar', 'lgI1', 'caspr2', 'ampa', 'gaba_b', 'mGluR5', 'negative', 'pending']);
  const clinical = {
    psychiatric: input.psychiatric_onset === true,
    seizures: input.seizures === true,
    movement: input.dyskinesia_face_arm === true,
    autonomic: input.autonomic_dysfunction === true,
    cognitive: input.cognitive_decline === true
  };
  const score = (clinical.psychiatric ? 1 : 0) + (clinical.seizures ? 1 : 0) + (clinical.movement ? 1 : 0) + (clinical.autonomic ? 1 : 0) + (clinical.cognitive ? 1 : 0);
  const likely = score >= 3;
  const acute = likely ? 'iv_methylpred_1g_3d_plus_ivig_0_4g_kg_5d_then_plasmapheresis' : 'review_infectious_cause';
  const chronic = antibody === 'nmdar' ? 'rituximab_375mg_m2_weekly_x4_then_q6mo' : 'maintenance_immunosuppression_per_antibody';
  return {
    module: 'tier4_neuro_107_ae',
    patient_id: patientId,
    antibody,
    clinical_score: score,
    likely_ae: likely,
    acute_therapy: acute,
    chronic_therapy: chronic,
    monitoring: 'csf_q3mo_until_undetectable',
    citations: CITATIONS
  };
}
module.exports = {
  nmoDiagnosis,
  nmoTherapy,
  autoimmuneEncephalitis,
  CITATIONS,
  ValidationError
};
