'use strict';
// TIER4_HEM-105 Platelet Disorders
const CITATIONS = [
  { id: 'ASH-Platelet-2024', source: 'ASH Platelet Disorders', year: 2024 }
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
function thrombocytopenia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const plt = ensureNumber(input, 'platelet_count', 0, 500);
  const etiology = ensureEnum(input, 'etiology', ['itp', 'drug_induced', 'ttt', 'dic', 'alcohol', 'aplastic', 'leukemia', 'sepsis', 'other', 'unknown']);
  const bleeding = input.mucocutaneous_bleeding === true;
  const therapy = (plt < 10) ? 'ivig_then_steroids_then_tpo_receptor_agonist_review' :
    (plt < 20 && bleeding) ? 'ivig_then_steroids_then_review' :
    (plt < 50 && etiology === 'itp') ? 'steroids_then_observation_then_tpo_review' :
    (plt < 100 && (etiology === 'ttt' || etiology === 'dic')) ? 'treat_underlying_cause_review' :
    'observe_then_review_cause';
  return {
    module: 'tier4_hem_105_thrombo',
    patient_id: patientId,
    platelet_count: plt,
    etiology,
    mucocutaneous_bleeding: bleeding,
    therapy,
    monitoring: 'q2_to_3d_until_response_then_q1wk',
    citations: CITATIONS
  };
}
function itp(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const plt = ensureNumber(input, 'platelet_count', 0, 500);
  const chronicity = ensureEnum(input, 'chronicity', ['newly_diagnosed', 'persistent', 'chronic', 'refractory']);
  const first_line = (chronicity === 'newly_diagnosed') ? 'oral_prednisone_then_ivig_then_review' :
    (chronicity === 'persistent') ? 'tpo_receptor_agonist_then_review' :
    (chronicity === 'refractory') ? 'rituximab_or_splenectomy_review' :
    'tpo_agonist_maintenance_then_review';
  return {
    module: 'tier4_hem_105_itp',
    patient_id: patientId,
    platelet_count: plt,
    chronicity,
    therapy: first_line,
    monitoring: 'q1wk_then_q2wk_then_q1mo',
    citations: CITATIONS
  };
}
module.exports = {
  thrombocytopenia,
  itp,
  CITATIONS,
  ValidationError
};