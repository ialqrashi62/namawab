'use strict';
// TIER4_PEDS-102 Pediatric Cardiology
// CHD, Kawasaki, myocarditis, arrhythmia, FTT
const CITATIONS = [
  { id: 'AHA-CHD-2024', source: 'AHA - Pediatric Cardiology', year: 2024 },
  { id: 'AHA-Kawasaki', source: 'AHA - Kawasaki Disease', year: 2023 }
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
function kawasakiIncompleteEval(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const fever_days = ensureNumber(input, 'fever_days', 0, 30);
  const criteria_met = ensureNumber(input, 'classic_criteria_count', 0, 5);
  const labs = {
    crp: ensureNumber(input, 'crp', 0, 200),
    esr: ensureNumber(input, 'esr', 0, 200),
    albumin: ensureNumber(input, 'albumin', 0, 6),
    hgb: ensureNumber(input, 'hemoglobin', 0, 25),
    plt: ensureNumber(input, 'platelet_count', 0, 1500),
    alt: ensureNumber(input, 'alt', 0, 1000),
    wbc: ensureNumber(input, 'wbc', 0, 50)
  };
  const eco_z = ensureNumber(input, 'coronary_artery_z_max', 0, 20);
  const supplemental_count = (labs.crp >= 3 || labs.esr >= 40 ? 1 : 0) +
    (labs.albumin <= 3 ? 1 : 0) +
    (labs.alt >= 100 ? 1 : 0) +
    (labs.plt >= 450 ? 1 : 0) +
    (labs.wbc >= 15 ? 1 : 0) +
    (labs.hgb <= 2 ? 1 : 0);
  const incomplete = criteria_met < 4 && fever_days >= 5 && supplemental_count >= 3;
  const complete = criteria_met >= 4 && fever_days >= 5;
  const diagnosis = complete || incomplete ? 'kawasaki_disease' : 'incomplete_likely_other';
  const therapy = {
    ivig: '2_g_kg_single_infusion_over_10_to_12h_when_diagnosis_made',
    asa: 'high_dose_80_to_100_mg_kg_day_divided_q6_until_afebrile_then_low_dose_3_to_5_mg_kg',
    echo_baseline: 'within_48h_then_2wk_then_6wk',
    z_score_followup: eco_z >= 2.5 ? 'weekly_then_2wk_then_6wk' : 'standard'
  };
  return {
    module: 'tier4_peds_102_kawasaki',
    patient_id: patientId,
    fever_days,
    classic_criteria_count: criteria_met,
    supplemental_count,
    complete,
    incomplete,
    diagnosis,
    coronary_z_max: eco_z,
    therapy,
    citations: CITATIONS
  };
}
function chdCyanoticAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const o2_sat = ensureNumber(input, 'o2_sat', 0, 100);
  const pao2 = ensureNumber(input, 'pao2', 0, 500);
  const echo_dx = ensureEnum(input, 'echo_diagnosis', ['d_tga', 'truncus_arteriosus', 'tof', 'tga_corrected', 'tapvr', 'ta', 'pa_ivs', 'hlhs', 'asd', 'vsd']);
  const prostaglandin = input.on_pge1 === true;
  const stable = o2_sat >= 75 && pao2 >= 40;
  return {
    module: 'tier4_peds_102_chd_cyanotic',
    patient_id: patientId,
    o2_sat,
    pao2,
    echo_diagnosis: echo_dx,
    pge1_running: prostaglandin,
    stable_on_pge1: stable,
    action: stable ? 'continue_pge1_plan_surgical' : 'urgent_cardiology',
    citations: CITATIONS
  };
}
module.exports = {
  kawasakiIncompleteEval,
  chdCyanoticAssessment,
  CITATIONS,
  ValidationError
};
