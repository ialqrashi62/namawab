'use strict';
// TIER4_NEPH-108 Pediatric Nephrology
const CITATIONS = [
  { id: 'IPNA-2024', source: 'International Pediatric Nephrology Association', year: 2024 }
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
function pediatricUTI(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 18);
  const fever = input.fever === true;
  const pyuria = input.pyuria === true;
  const culture = ensureEnum(input, 'culture', ['e_coli', 'klebsiella', 'proteus', 'pseudomonas', 'enterococcus', 'mixed', 'negative', 'pending']);
  const recurrence = input.recurrent_uti === true;
  const ultrasound = ensureEnum(input, 'ultrasound', ['normal', 'hydronephrosis', 'scarring', 'duplicated_system', 'reflux_suspected', 'pending']);
  const cystography_indicated = (age_years < 2 && (fever || pyuria) && recurrence) || ultrasound === 'reflux_suspected';
  const therapy = (culture === 'e_coli' || culture === 'klebsiella') ? 'oral_cephalosporin_or_amoxicillin_clavulanate_7_to_10d' :
    (culture === 'pseudomonas') ? 'iv_ceftazidime_or_aminoglycoside_then_review' :
    (culture === 'pending' && fever) ? 'empiric_iv_cephalosporin_until_culture' : 'supportive_q48h_reassess';
  return {
    module: 'tier4_neph_108_uti',
    patient_id: patientId,
    age_years,
    fever,
    pyuria,
    culture,
    recurrent: recurrence,
    ultrasound,
    cystography_indicated,
    therapy,
    monitoring: 'q48h_clinical_q2wk_urine_repeat_q3mo_prophylaxis_review',
    citations: CITATIONS
  };
}
function nephroticSyndromePeds(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 18);
  const proteinuria = ensureNumber(input, 'proteinuria', 0, 30);
  const albumin = ensureNumber(input, 'serum_albumin', 0, 6);
  const steroid_responsive = input.steroid_responsive === true;
  const syndrome = (proteinuria >= 3.5 && albumin <= 2.5) ? 'nephrotic_syndrome' : 'not_nephrotic';
  const diagnosis = (age_years >= 1 && age_years <= 10 && syndrome === 'nephrotic_syndrome' && !input.hematuria) ? 'likely_ssns' : 'consider_biopsy';
  const therapy = (diagnosis === 'likely_ssns') ? 'prednisone_2mg_kg_then_taper' :
    'prednisone_while_awaiting_biopsy_then_review';
  const fr_consideration = input.frequent_relapser === true;
  return {
    module: 'tier4_neph_108_ns',
    patient_id: patientId,
    age_years,
    proteinuria,
    serum_albumin: albumin,
    syndrome,
    diagnosis,
    therapy,
    frequent_relapser: fr_consideration,
    fr_therapy: fr_consideration ? 'cyclophosphamide_or_mmf_then_rituximab' : 'continue_standard_therapy',
    citations: CITATIONS
  };
}
module.exports = {
  pediatricUTI,
  nephroticSyndromePeds,
  CITATIONS,
  ValidationError
};