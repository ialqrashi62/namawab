'use strict';
// TIER4_RARE-109 Ehlers-Danlos Syndromes
const CITATIONS = [
  { id: 'EDS-2017', source: 'International EDS Consortium Classification', year: 2017 },
  { id: 'hEDS-IC', source: 'hEDS International Consortium 2017 criteria', year: 2017 }
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
function edsClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const hypermobility = ensureEnum(input, 'hypermobility_beighton', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
  const beighton = Number(hypermobility);
  const skin_hyperextensibility = input.skin_hyperextensibility === true;
  const atrophic_scars = input.atrophic_scars === true;
  const joint_dislocations = input.joint_dislocations === true;
  const easy_bruising = input.easy_bruising === true;
  const positive_family = input.positive_family === true;
  const suspected_type = ensureEnum(input, 'suspected_type', ['heds', 'clds', 'veds', 'keds', 'peds', 'deds', 'speds', 'mcds', 'adeds']);
  let subtype = 'generalized_hypermobility';
  if (suspected_type === 'heds' && beighton >= 5 && skin_hyperextensibility) subtype = 'hEDS_possible';
  if (suspected_type === 'veds') subtype = 'VEDS_urgent_genetic';
  if (suspected_type === 'adeds') subtype = 'ADEDS_classical_like';
  const flags = [];
  if (suspected_type === 'veds') flags.push('VASCULAR_EDS_RULE_OUT_ANEURYSM_SCREEN');
  if (suspected_type === 'keds') flags.push('KYPHOSCOLIOTIC_EDS_SCREEN_MMA');
  return {
    module: 'tier4_rare_109_eds_class',
    patient_id: patientId,
    beighton_score: beighton,
    skin_hyperextensibility,
    atrophic_scars,
    joint_dislocations,
    easy_bruising,
    positive_family,
    suspected_type,
    subtype,
    flags,
    citations: CITATIONS
  };
}
function edsPainAndRehab(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const chronic_pain = input.chronic_pain === true;
  const subluxation_count = ensureNumber(input, 'subluxation_count_per_year', 0, 100);
  const fatigue = input.fatigue === true;
  const therapy = {
    pt: 'proprioceptive_resistance_gentle_load',
    aquatic_therapy: chronic_pain ? 'recommended' : 'consider',
    fatigue_program: fatigue ? 'pacing_energy_envelope' : 'not_indicated',
    brace: 'functional_brace_for_recurrent_subluxation',
    pain: 'neuropathic_first_line_gabapentin_or_duloxetine'
  };
  const avoid = ['manipulation_chiropractic', 'high_impact_sports', 'stretching_past_neutral'];
  return {
    module: 'tier4_rare_109_eds_rehab',
    patient_id: patientId,
    chronic_pain,
    subluxation_count,
    fatigue,
    therapy,
    avoid,
    citations: CITATIONS
  };
}
module.exports = {
  edsClassification,
  edsPainAndRehab,
  CITATIONS,
  ValidationError
};
