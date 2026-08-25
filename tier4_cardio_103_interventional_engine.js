'use strict';
// TIER4_CARDIO-103 Interventional Cardiology
const CITATIONS = [
  { id: 'ACC-PCI-2024', source: 'ACC/AHA PCI Guideline', year: 2024 }
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
function stemiPathway(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const pain_onset_min = ensureNumber(input, 'pain_onset_min', 0, 720);
  const heart_rate = ensureNumber(input, 'heart_rate', 0, 250);
  const systolic = ensureNumber(input, 'sbp', 0, 250);
  const st_elevation = ensureEnum(input, 'st_elevation', ['anterior', 'inferior', 'lateral', 'posterior', 'lbbb', 'no_elevation']);
  const cardiac_arrest = input.cardiac_arrest === true;
  const cardiogenic_shock = input.cardiogenic_shock === true;
  const door_to_balloon = ensureNumber(input, 'door_to_balloon_min', 0, 240);
  const primary_pci = (pain_onset_min < 720 && (st_elevation !== 'no_elevation' || cardiac_arrest)) ? true : false;
  const therapy = cardiogenic_shock ? 'primary_pci_impella_va_ecmo' : 'primary_pci_d2b_under_90_min';
  return {
    module: 'tier4_cardio_103_stemi',
    patient_id: patientId,
    pain_onset_min,
    st_elevation,
    cardiogenic_shock,
    cardiac_arrest,
    door_to_balloon_min: door_to_balloon,
    primary_pci,
    therapy,
    monitoring: 'icu_24_to_36h_weaning_assist_devices',
    citations: CITATIONS
  };
}
function pciLesionClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const syntax = ensureNumber(input, 'syntax_score', 0, 60);
  const vessel = ensureEnum(input, 'vessel', ['lmt', 'lad_proximal', 'lad_mid', 'rca', 'lcx', 'diagonal', 'om', 'ramus', 'pda']);
  const dm = input.diabetes === true;
  const ef = ensureNumber(input, 'ef', 0, 80);
  const recommendation = (syntax >= 23 || (vessel === 'lmt' && syntax >= 23)) ? 'consult_cabg_review' : 'consider_pci_with_des';
  return {
    module: 'tier4_cardio_103_lesion',
    patient_id: patientId,
    syntax_score: syntax,
    vessel,
    diabetes: dm,
    ef,
    recommendation,
    citations: CITATIONS
  };
}
function tavrDecision(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const sts = ensureNumber(input, 'sts_score', 0, 30);
  const risk = ensureEnum(input, 'risk', ['low', 'intermediate', 'high', 'prohibitive']);
  const bicuspid = input.bicuspid === true;
  const favor_tavr = age >= 75 || (sts >= 8) || (risk === 'high' || risk === 'prohibitive');
  const favor_savr = age < 65 || (sts < 4) || (risk === 'low') || (bicuspid && age < 75);
  return {
    module: 'tier4_cardio_103_tavr',
    patient_id: patientId,
    age,
    sts_score: sts,
    risk,
    bicuspid,
    favor_tavr,
    favor_savr,
    heart_team: 'always_review_threshold_documented',
    citations: CITATIONS
  };
}
module.exports = {
  stemiPathway,
  pciLesionClassification,
  tavrDecision,
  CITATIONS,
  ValidationError
};
