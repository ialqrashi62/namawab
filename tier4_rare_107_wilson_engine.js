'use strict';
// TIER4_RARE-107 Wilson Disease
const CITATIONS = [
  { id: 'AASLD-Wilson', source: 'American Association Liver - Wilson Disease', year: 2022 },
  { id: 'EASL-Wilson', source: 'European Association Liver - Wilson Disease', year: 2023 }
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
function wilsonDiseaseDiagnosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ceruloplasmin = ensureNumber(input, 'ceruloplasmin_mg_dl', 0, 100);
  const urinary_copper_24h = ensureNumber(input, 'urinary_copper_24h_ug', 0, 5000);
  const serum_copper = ensureNumber(input, 'serum_copper_ug_dl', 0, 500);
  const hepatic_copper_dry = ensureNumber(input, 'hepatic_copper_dry_weight_ug_g', 0, 2000);
  const kayser_fleischer = input.kayser_fleischer === true;
  const atp7b_mutations = ensureNumber(input, 'atp7b_mutations_count', 0, 2);
  let score = 0;
  if (ceruloplasmin < 10) score += 2; else if (ceruloplasmin < 20) score += 1;
  if (urinary_copper_24h > 100) score += 2;
  if (hepatic_copper_dry > 250) score += 2;
  if (kayser_fleischer) score += 2;
  if (atp7b_mutations === 2) score += 4;
  else if (atp7b_mutations === 1) score += 1;
  let diagnosis = 'unlikely';
  if (score >= 4) diagnosis = 'highly_likely';
  else if (score >= 2) diagnosis = 'probable';
  return {
    module: 'tier4_rare_107_wilson_dx',
    patient_id: patientId,
    leipzig_score: score,
    diagnosis: diagnosis,
    labs: { ceruloplasmin: ceruloplasmin, urinary_copper_24h: urinary_copper_24h, serum_copper: serum_copper, hepatic_copper_dry: hepatic_copper_dry },
    genetics: { atp7b_mutations: atp7b_mutations },
    kayser_fleischer: kayser_fleischer,
    citations: CITATIONS
  };
}
function wilsonDiseaseTreatment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const phase = ensureEnum(input, 'phase', ['initial', 'maintenance', 'lifelong']);
  const neuro_symptoms = input.neuro_symptoms === true;
  const pregnant = input.pregnant === true;
  let first_line = 'd_penicillamine';
  if (neuro_symptoms) first_line = 'trientine_risk_of_worsening_with_penicillamine';
  if (pregnant) first_line = 'zinc_only_monotherapy';
  const monitoring = {
    lft_q1mo_x6_then_q3mo: true,
    urine_copper_24h: phase === 'maintenance' ? 'q6mo' : 'q3mo',
    penicillamine_toxicity: 'proteinuria_cbc_Qmonthly',
    zinc_appropriate: phase === 'maintenance' ? 'check_24h_urine_copper' : 'monitor'
  };
  return {
    module: 'tier4_rare_107_wilson_tx',
    patient_id: patientId,
    phase: phase,
    neuro_symptoms: neuro_symptoms,
    pregnant: pregnant,
    first_line: first_line,
    monitoring: monitoring,
    citations: CITATIONS
  };
}
module.exports = {
  wilsonDiseaseDiagnosis: wilsonDiseaseDiagnosis,
  wilsonDiseaseTreatment: wilsonDiseaseTreatment,
  CITATIONS: CITATIONS,
  ValidationError: ValidationError
};
