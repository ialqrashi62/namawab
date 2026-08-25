'use strict';
// TIER4_PSYCH-104 Schizophrenia Spectrum
const CITATIONS = [
  { id: 'APA-Psych-2024', source: 'APA Practice Guidelines Schizophrenia', year: 2024 }
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
function firstEpisodePsychosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const duration_weeks = ensureNumber(input, 'psychotic_symptoms_weeks', 0, 500);
  const symptom_type = ensureEnum(input, 'predominant', ['positive', 'negative', 'cognitive', 'mixed']);
  const risk = ensureEnum(input, 'suicide_risk', ['low', 'moderate', 'high']);
  const adherence = input.medication_adherent === true;
  const candidate_coordinated = (duration_weeks < 104) ? 'fep_care_pathway' : 'standard_care';
  const therapy = (symptom_type === 'positive') ? 'second_gen_antipsychotic_risperidone_or_olanzapine' :
    (symptom_type === 'negative') ? 'low_dose_second_gen_or_cariprazine' :
    'risperidone_or_paliperidone_long_acting_if_adherence_issue';
  return {
    module: 'tier4_psych_104_fep',
    patient_id: patientId,
    psychotic_symptoms_weeks: duration_weeks,
    predominant: symptom_type,
    suicide_risk: risk,
    medication_adherent: adherence,
    care_pathway: candidate_coordinated,
    therapy,
    monitoring: 'q1wk_initial_then_q2wk_q1mo_then_q3mo',
    citations: CITATIONS
  };
}
function treatmentResistant(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const prior_trials = ensureNumber(input, 'prior_adequate_trials', 0, 10);
  const compliance = input.compliance_confirmed === true;
  const clozapine_eligible = (prior_trials >= 2 && compliance) ? 'clozapine_indicated' : 'review_compliance';
  const therapy = (prior_trials >= 2 && compliance) ? 'clozapine_initiate_then_monitor_anc_q_wk_x6mo' :
    'optimize_current_consider_laai';
  return {
    module: 'tier4_psych_104_trs',
    patient_id: patientId,
    prior_adequate_trials: prior_trials,
    compliance_confirmed: compliance,
    clozapine_eligible: (clozapine_eligible === 'clozapine_indicated'),
    therapy,
    monitoring: 'clozapine_q1wk_anc_x6mo_then_q4wk',
    citations: CITATIONS
  };
}
module.exports = {
  firstEpisodePsychosis,
  treatmentResistant,
  CITATIONS,
  ValidationError
};