'use strict';
// TIER4_PEDS-101 Neonatology
// NICU: prematurity, RDS, BPD, NEC, IVH, ROP, hyperbilirubinemia, sepsis
const CITATIONS = [
  { id: 'AAP-NICU', source: 'AAP - Neonatal care guidelines', year: 2023 },
  { id: 'NICE-NG', source: 'NICE - Neonatal guideline NG1-NG196', year: 2024 },
  { id: 'COFN-2024', source: 'Committee on Fetus Newborn - Hyperbilirubinemia', year: 2024 }
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
function apgarScoring(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const a1 = ensureNumber(input, 'appearance_1min', 0, 2);
  const p1 = ensureNumber(input, 'pulse_1min', 0, 2);
  const g1 = ensureNumber(input, 'grimace_1min', 0, 2);
  const act1 = ensureNumber(input, 'activity_1min', 0, 2);
  const r1 = ensureNumber(input, 'respirations_1min', 0, 2);
  const a5 = ensureNumber(input, 'appearance_5min', 0, 2);
  const p5 = ensureNumber(input, 'pulse_5min', 0, 2);
  const g5 = ensureNumber(input, 'grimace_5min', 0, 2);
  const act5 = ensureNumber(input, 'activity_5min', 0, 2);
  const r5 = ensureNumber(input, 'respirations_5min', 0, 2);
  const one_min = a1 + p1 + g1 + act1 + r1;
  const five_min = a5 + p5 + g5 + act5 + r5;
  let response = 'vigorous';
  if (one_min <= 3) response = 'depressed_requires_resuscitation';
  else if (one_min <= 6) response = 'moderately_depressed';
  const therapy = one_min <= 3 ? 'ppv_positive_pressure_ventilation_then_cpap' : 'warm_dry_stimulate';
  return {
    module: 'tier4_peds_101_apgar',
    patient_id: patientId,
    apgar_1min: one_min,
    apgar_5min: five_min,
    response,
    therapy,
    citations: CITATIONS
  };
}
function neonatalRespiratoryCare(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 22, 42);
  const birth_weight_g = ensureNumber(input, 'birth_weight_g', 300, 6000);
  const fio2 = ensureNumber(input, 'fio2', 0.21, 1.0);
  const peep = ensureNumber(input, 'peep_cm', 0, 12);
  const o2_sat = ensureNumber(input, 'o2_sat', 0, 100);
  const abx = ensureNumber(input, 'silverman_andersen', 0, 10);
  const surfactant_given = input.surfactant_given === true;
  const on_mech = input.on_mech_vent === true;
  let diagnosis = 'transient_tachypnea';
  if (ga_weeks < 32 && on_mech) diagnosis = 'respiratory_distress_syndrome_rds';
  if (ga_weeks < 30 && id_high(surfactant_given, on_mech, fio2)) diagnosis = 'severe_rds';
  const respiratory_therapy = {
    o2_target: ga_weeks < 32 ? '90_to_95' : '92_to_97',
    cpap_first: ga_weeks >= 28 && !on_mech,
    surfactant: o2_sat < 90 || fio2 > 0.4 ? 'consider_beractant_200mg_kg' : 'not_indicated',
    caffeine: ga_weeks < 32 ? 'initiate_loading_20mg_kg' : 'not_routine'
  };
  return {
    module: 'tier4_peds_101_respiratory',
    patient_id: patientId,
    ga_weeks,
    birth_weight_g,
    diagnosis,
    abx_score: abx,
    respiratory_therapy,
    citations: CITATIONS
  };
}
function id_high(s, m, f) { return s || (m && f >= 0.4); }
function necBellStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const perc = ensureEnum(input, 'pneumatosis', ['none', 'present', 'portal_venous_gas', 'pneumoperitoneum']);
  const abd_distension = ensureNumber(input, 'abdominal_distension', 0, 3);
  const tenderness = input.tenderness === true;
  const platelets = ensureNumber(input, 'platelet_count', 0, 1000);
  const acidosis = ensureNumber(input, 'ph', 6.5, 7.6);
  const ofi = input.omental_fat_inflammation === true;
  const fixed_loop = input.fixed_bowel_loop === true;
  let stage = 'stage_1a_suspected';
  if (perc === 'pneumoperitoneum') stage = 'stage_3b_pneumoperitoneum';
  else if (perc === 'portal_venous_gas' || ofi) stage = 'stage_2a_advanced';
  else if (perc === 'present') stage = 'stage_1b_confirmed';
  else if (fixed_loop && tenderness) stage = 'stage_2b_advanced';
  const therapy = {
    npo: 'initiate_immediately',
    ngt_decompression: perc !== 'none',
    antibiotics: 'ampicillin_gentamicin_metronidazole_7_to_14_days',
    surgery: perc === 'pneumoperitoneum' ? 'URGENT_laparotomy' : (fixed_loop ? 'consider_drainage_or_laparotomy' : 'medical_only'),
    platelets_target: platelets < 50 ? 'transfuse_above_50' : 'monitor'
  };
  return {
    module: 'tier4_peds_101_nec',
    patient_id: patientId,
    bell_stage: stage,
    therapy,
    monitoring: { abd_q6h: true, wbc_q24h: true, plt_q24h: true, film_q12h: true },
    citations: CITATIONS
  };
}
function neonatalHyperbilirubinemia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tcb = ensureNumber(input, 'transcut_bili', 0, 30);
  const tcb_age_hours = ensureNumber(input, 'age_hours', 0, 336);
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 22, 42);
  const risk = ensureEnum(input, 'risk_category', ['low', 'medium', 'high']);
  const phototherapy_threshold = tcb >= 15 ? 'phototherapy_indicated' : 'phototherapy_not_indicated';
  const exchange_threshold_indicator = tcb >= 25 ? 'consider_exchange_transfusion' : 'no_exchange_indic';
  const therapy = {
    intensive_phototherapy: tcb >= 12 ? 'initiate_bili_blanket_led' : 'monitor_q4_to_8h',
    iv_ig: 'isoimmune_hemolytic_disease_only',
    exchange: tcb >= 25 ? 'consider_double_volume_exchange' : 'not_indicated',
    feeding: 'breastfeeding_continue_increase_frequency'
  };
  return {
    module: 'tier4_peds_101_bili',
    patient_id: patientId,
    tcb,
    age_hours: tcb_age_hours,
    ga_weeks,
    risk,
    phototherapy_threshold,
    exchange_threshold_indicator,
    therapy,
    citations: CITATIONS
  };
}
function neonatalSepsisPathway(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const temperature = ensureNumber(input, 'temperature_c', 30, 45);
  const heart_rate = ensureNumber(input, 'heart_rate', 0, 250);
  const respiratory_rate = ensureNumber(input, 'respiratory_rate', 0, 100);
  const wbc = ensureNumber(input, 'wbc', 0, 100000);
  const crp = ensureNumber(input, 'crp', 0, 200);
  const lt_ratio = ensureNumber(input, 'immature_to_total_neutrophil_ratio', 0, 1);
  const blood_culture = input.blood_culture_drawn === true;
  const abx_started = input.antibiotics_started === true;
  const response = (temperature > 38.5 || temperature < 36.5) && crp > 10;
  const therapy = {
    antibiotics_first_line: 'ampicillin_plus_gentamicin',
    alternatives: 'cefotaxime_if_meningitis_suspected',
    stop_thresholds: 'negative_culture_48h_normal_crp',
    duration: 'positive_culture_10_to_14_days_meningitis_21_days'
  };
  return {
    module: 'tier4_peds_101_sepsis',
    patient_id: patientId,
    meets_eos_screening: response,
    blood_culture_drawn: blood_culture,
    antibiotics_started: abx_started,
    therapy,
    monitoring: { q_change_vitals: true, repeat_crp_24h: true, blood_culture_48h: 'final' },
    citations: CITATIONS
  };
}
module.exports = {
  apgarScoring,
  neonatalRespiratoryCare,
  necBellStaging,
  neonatalHyperbilirubinemia,
  neonatalSepsisPathway,
  CITATIONS,
  ValidationError
};
