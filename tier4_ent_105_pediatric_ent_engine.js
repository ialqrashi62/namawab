'use strict';
// TIER4_ENT-105 Pediatric ENT
const CITATIONS = [
  { id: 'AAP-ENT-2024', source: 'AAP Pediatric ENT', year: 2024 }
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
function pediatricAdenotonsillectomy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 18);
  const sleep_disordered_breathing = input.sleep_disordered_breathing === true;
  const tonsillitis_episodes = ensureNumber(input, 'tonsillitis_episodes_per_year', 0, 20);
  const apnea_hypopnea_index = ensureNumber(input, 'ahi', 0, 100);
  const surgery = (sleep_disordered_breathing && apnea_hypopnea_index >= 5) || (tonsillitis_episodes >= 7) || (tonsillitis_episodes >= 3 && apnea_hypopnea_index >= 1);
  return {
    module: 'tier4_ent_105_tat',
    patient_id: patientId,
    age,
    sleep_disordered_breathing,
    tonsillitis_episodes_per_year: tonsillitis_episodes,
    ahi,
    surgery_indicated: surgery,
    paralysis: 'consider_for_sleep_breathing_then_ent',
    citations: CITATIONS
  };
}
function pediatricAirwayEvaluation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stridor = ensureEnum(input, 'stridor', ['inspiratory', 'expiratory', 'biphasic', 'none']);
  const cms = ensureNumber(input, 'cotton_myer_score', 0, 4);
  const age = ensureNumber(input, 'age_months', 0, 200);
  const mri = input.mri_considered === true;
  const microlaryngoscopy = (stridor === 'biphasic' || cms >= 2) ? 'operative_direct_laryngoscopy_bronchoscopy' : 'flex_laryngoscopy_then_review';
  return {
    module: 'tier4_ent_105_airway',
    patient_id: patientId,
    stridor,
    cms,
    age_months: age,
    mri_considered: mri,
    microlaryngoscopy,
    citations: CITATIONS
  };
}
function congenitalHearingLoss(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const screen_pass = input.newborn_screening_passed === true;
  const age_months = ensureNumber(input, 'age_months', 0, 200);
  const bil = ensureNumber(input, 'bilateral_threshold_db', 0, 120);
  const unilateral = ensureNumber(input, 'unilateral_threshold_db', 0, 120);
  const genetic = input.genetic_testing_sent === true;
  const mri = input.mri_considered === true;
  const cochlear = (bil >= 70 && age_months < 60) ? 'cochlear_implant_evaluation' : 'hearing_aid_early';
  const referral = (bil >= 70 || unilateral >= 70) ? 'refer_to_pediatric_audiology_genetic_ENT' : 'recheck_3mo';
  return {
    module: 'tier4_ent_105_chl',
    patient_id: patientId,
    newborn_screening_passed: screen_pass,
    age_months,
    bilateral_threshold_db: bil,
    unilateral_threshold_db: unilateral,
    genetic_testing_sent: genetic,
    imaging_mri_considered: mri,
    intervention: cochlear,
    referral,
    citations: CITATIONS
  };
}
module.exports = {
  pediatricAdenotonsillectomy,
  pediatricAirwayEvaluation,
  congenitalHearingLoss,
  CITATIONS,
  ValidationError
};
