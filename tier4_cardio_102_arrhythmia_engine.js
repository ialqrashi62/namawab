'use strict';
// TIER4_CARDIO-102 Arrhythmia & Electrophysiology
const CITATIONS = [
  { id: 'ACC-2024-AF', source: 'ACC/AHA 2024 AF', year: 2024 },
  { id: 'HRS-2023', source: 'Heart Rhythm Society', year: 2023 }
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
function afStrokeRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const chf = input.chf === true;
  const htn = input.htn === true;
  const dm = input.diabetes === true;
  const stroke = input.prior_stroke_tia === true;
  const vascular = input.vascular_disease === true;
  const female = input.female === true;
  const cha2ds2vasc = (age >= 75 ? 2 : (age >= 65 ? 1 : 0)) + (chf ? 1 : 0) + (htn ? 1 : 0) + (dm ? 1 : 0) + (stroke ? 2 : 0) + (vascular ? 1 : 0) + (female ? 1 : 0);
  const anticoagulation = (cha2ds2vasc >= 2) ? 'doac_first_line' : (cha2ds2vasc === 1) ? 'consider_noac_individualize' : 'doac_not_recommended';
  return {
    module: 'tier4_cardio_102_afscore',
    patient_id: patientId,
    age,
    cha2ds2vasc,
    anticoagulation,
    monitoring: 'q_year_renal_crp_thyroid',
    citations: CITATIONS
  };
}
function afRhythmControl(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const onset_hours = ensureNumber(input, 'onset_hours', 0, 240);
  const heart_failure = input.heart_failure === true;
  const lad = ensureNumber(input, 'left_atrial_diameter_mm', 0, 80);
  const duration_years = ensureNumber(input, 'af_duration_years', 0, 50);
  const symptoms = ['palpitations', 'fatigue', 'dyspnea'];
  const cardioversion = (onset_hours <= 48) ? 'planned_dcec_or_chem_anticoagulation_3wk_then_after_4wk' : 'consider_wait_3wk_anticoagulation';
  const long_term = (heart_failure || (lad >= 50) || (duration_years < 1)) ? 'rhythm_control_ablation_or_aad' : 'rate_control_metoprolol_or_diltiazem';
  return {
    module: 'tier4_cardio_102_af_rhythm',
    patient_id: patientId,
    onset_hours,
    heart_failure,
    left_atrial_diameter: lad,
    af_duration_years: duration_years,
    cardioversion,
    long_term_strategy: long_term,
    citations: CITATIONS
  };
}
function ablationDecision(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const af_type = ensureEnum(input, 'af_type', ['paroxysmal', 'persistent', 'long_standing_persistent', 'early_persistent', 'secondary']);
  const age = ensureNumber(input, 'age', 0, 120);
  const heart_failure = input.heart_failure === true;
  const failed_drug = input.failed_drug === true;
  const la_size = ensureNumber(input, 'left_atrial_volume_index', 0, 100);
  const eligible = (af_type === 'paroxysmal' && failed_drug) || (heart_failure && (af_type === 'paroxysmal' || af_type === 'persistent'));
  return {
    module: 'tier4_cardio_102_ablation',
    patient_id: patientId,
    af_type,
    age,
    heart_failure,
    failed_drug,
    la_volume_index: la_size,
    ablation_eligible: eligible,
    citation: CITATIONS
  };
}
function bradyPacing(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptomatic = input.symptomatic === true;
  const sinus = ensureNumber(input, 'sinus_rate', 0, 200);
  const av_conduction = ensureEnum(input, 'av_conduction', ['normal', '1st_degree', 'mobitz_1', 'mobitz_2', 'complete']);
  const pause = ensureNumber(input, 'pause_seconds', 0, 60);
  const pacing = (symptomatic && (sinus < 40 || av_conduction === 'complete' || av_conduction === 'mobitz_2' || pause >= 3));
  return {
    module: 'tier4_cardio_102_pacing',
    patient_id: patientId,
    symptomatic,
    sinus_rate: sinus,
    av_conduction,
    pause,
    pacing_indicated: pacing,
    citation: CITATIONS
  };
}
function icdPrimary(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lvef = ensureNumber(input, 'lvef', 0, 80);
  const nhya = ensureNumber(input, 'nyha_class', 1, 4);
  const on_optimal = input.on_optimal_therapy_3mo === true;
  const primary = (lvef <= 35 && nhya >= 2 && on_optimal);
  const secondary = input.scd_history === true;
  return {
    module: 'tier4_cardio_102_icd',
    patient_id: patientId,
    lvef,
    nyha: nhya,
    on_optimal,
    primary_prevention: primary,
    secondary_prevention: secondary,
    icd_indicated: primary || secondary,
    citation: CITATIONS
  };
}
module.exports = {
  afStrokeRisk,
  afRhythmControl,
  ablationDecision,
  bradyPacing,
  icdPrimary,
  CITATIONS,
  ValidationError
};
