'use strict';
// TIER4_PALL-106 Pediatric Palliative
const CITATIONS = [
  { id: 'AAP-PPC-2024', source: 'AAP Pediatric Palliative Care', year: 2024 }
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
function pediatricPalliative(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 18);
  const diagnosis = ensureEnum(input, 'diagnosis_group', ['congenital_neurologic', 'chromosomal', 'cancer_active', 'cancer_survivorship', 'cystic_fibrosis_advanced', 'organ_failure_advanced', 'other_life_limiting', 'unknown']);
  const complexity = ensureEnum(input, 'complexity', ['low_primarily_symptom', 'moderate_complex_decisions', 'high_actively_dying_or_imminent', 'stable_chronic_complex']);
  const therapy = (complexity === 'high_actively_dying_or_imminent') ? 'urgent_ppc_team_consult_imminent_preparation_family_meeting' :
    (complexity === 'moderate_complex_decisions') ? 'ppc_team_concurrent_curative_consult_decision_support' :
    'ppc_team_intro_concurrent_care_baseline_symptom_management';
  return {
    module: 'tier4_pall_106_peds',
    patient_id: patientId,
    age_years: age,
    diagnosis_group: diagnosis,
    complexity,
    therapy,
    monitoring: 'q1wk_high_then_q2wk_moderate_then_q1mo_low',
    citations: CITATIONS
  };
}
module.exports = {
  pediatricPalliative,
  CITATIONS,
  ValidationError
};