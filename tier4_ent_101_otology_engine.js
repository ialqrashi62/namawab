'use strict';
// TIER4_ENT-101 Otology
const CITATIONS = [
  { id: 'AAOHNS-2024', source: 'American Academy Otolaryngology Head Neck Surgery', year: 2024 }
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
function suddenHearingLoss(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const hours = ensureNumber(input, 'hours_since_onset', 0, 240);
  const laterality = ensureEnum(input, 'laterality', ['unilateral', 'bilateral', 'unknown']);
  const audiogram = ensureNumber(input, 'audiogram_threshold_db', 0, 120);
  const vertigo = input.associated_vertigo === true;
  const tinnitus = input.associated_tinnitus === true;
  const urgent = hours <= 72;
  const therapy = urgent ? 'high_dose_oral_steroid_1mg_kg_2_weeks_then_taper' : 'consider_steroid_intratympanic';
  return {
    module: 'tier4_ent_101_ssnhl',
    patient_id: patientId,
    hours_since_onset: hours,
    laterality,
    audiogram_threshold_db: audiogram,
    vertigo,
    tinnitus,
    urgent,
    therapy,
    monitoring: 'audiogram_q1week_to_q3mo',
    citations: CITATIONS
  };
}
function cholesteatomaManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'type', ['attic', 'pars_flaccida', 'tensa', 'congenital', 'external_auditory_canal']);
  const hearing_loss = ensureNumber(input, 'bc_ab_gap_db', 0, 60);
  const surgery = (hearing_loss >= 20 || type === 'attic') ? 'tympanoplasty_with_mastoidectomy' : 'observe';
  return {
    module: 'tier4_ent_101_cholesteatoma',
    patient_id: patientId,
    type,
    bc_ab_gap_db: hearing_loss,
    surgery_indicated: surgery === 'tympanoplasty_with_mastoidectomy',
    surgery,
    monitoring: 'otoscopy_q6mo_audiometry_q1y',
    citations: CITATIONS
  };
}
function bppvAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const canal = ensureEnum(input, 'canal', ['posterior', 'horizontal', 'anterior', 'multicanal', 'unknown']);
  const dix_hallpike = input.dix_hallpike_positive === true;
  const supine_roll = input.supine_roll_positive === true;
  const therapy = (canal === 'posterior' && dix_hallpike) ? 'epley_maneuver_14_steps_test_then_roll' :
    (canal === 'horizontal' && supine_roll) ? 'bbq_roll_maneuver_horizontal' :
    (canal === 'anterior') ? 'reverse_epley' : 'mastoid_vibration_dix_hallpike_diagnostic';
  return {
    module: 'tier4_ent_101_bppv',
    patient_id: patientId,
    canal,
    dix_hallpike_positive: dix_hallpike,
    supine_roll_positive: supine_roll,
    therapy,
    monitoring: 'q1week_reposition_then_q1mo',
    citations: CITATIONS
  };
}
function otitisMedia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const effusion = input.effusion_present === true;
  const duration = ensureNumber(input, 'weeks_permanent', 0, 60);
  const history = ensureNumber(input, 'recurrent_episodes_6mo', 0, 20);
  const bilateral = input.bilateral === true;
  const surgery = (duration >= 12 && (bilateral || age < 3)) ? 'bilateral_myringotomy_with_tubes' : (history >= 3 ? 'myringotomy_with_tubes' : 'observe_3mo');
  return {
    module: 'tier4_ent_101_om',
    patient_id: patientId,
    age,
    effusion,
    duration_weeks: duration,
    recurrent_episodes_6mo: history,
    bilateral,
    surgery_indicated: surgery !== 'observe_3mo',
    surgery,
    monitoring: 'audiology_q3mo_media_review',
    citations: CITATIONS
  };
}
module.exports = {
  suddenHearingLoss,
  cholesteatomaManagement,
  bppvAssessment,
  otitisMedia,
  CITATIONS,
  ValidationError
};
