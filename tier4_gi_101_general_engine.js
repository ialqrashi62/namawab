'use strict';
// TIER4_GI-101 General GI: GERD, IBS, dyspepsia, constipation, diarrhea
const CITATIONS = [
  { id: 'ACG-2024', source: 'American College Gastroenterology', year: 2024 }
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
function gerdManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const duration_weeks = ensureNumber(input, 'symptom_duration_weeks', 0, 200);
  const alarm = (input.dysphagia === true || input.weight_loss_kg >= 5 || input.gi_bleeding === true || input.anemia === true || input.vomiting === true || age >= 60);
  const therapy = alarm ? 'eudy_8wk_then_edg' : 'ppi_lifestyle_8wk';
  return {
    module: 'tier4_gi_101_gerd',
    patient_id: patientId,
    age,
    duration_weeks,
    alarm_features: alarm,
    therapy,
    monitoring: 'q4_to_8wk_review',
    citations: CITATIONS
  };
}
function ibsClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['ibs_c', 'ibs_d', 'ibs_m', 'ibs_u']);
  const therapy = {
    ibs_c: 'osmotic_laxative_pegasus_study_then_linaclotide',
    ibs_d: 'loperamide_ondansetron_then_rifaximin_or_eluxadoline',
    ibs_m: 'lifestyle_psychological_low_fodmap',
    ibs_u: 'review_and_rule_out_organic'
  };
  return {
    module: 'tier4_gi_101_ibs',
    patient_id: patientId,
    subtype,
    therapy: therapy[subtype],
    monitoring: 'q4wk_review',
    citations: CITATIONS
  };
}
function dyspepsiaTriage(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const alarm = (input.dysphagia === true || input.weight_loss_kg >= 5 || input.bleeding === true || input.iron_deficiency_anemia === true || input.vomiting_persistent === true || age >= 60);
  const therapy = alarm ? 'edg_then_treat_h_pylori' : 'test_and_treat_h_pylori_then_ppi_4wk';
  return {
    module: 'tier4_gi_101_dyspepsia',
    patient_id: patientId,
    age,
    alarm,
    therapy,
    monitoring: 'q4wk_review',
    citations: CITATIONS
  };
}
module.exports = {
  gerdManagement,
  ibsClassification,
  dyspepsiaTriage,
  CITATIONS,
  ValidationError
};
