'use strict';
// TIER4_PEDS-107 Pediatric Heme/Onc
// ALL, neutropenic fever, SCD, hemophilia, ITP
const CITATIONS = [
  { id: 'COG-2024', source: 'Children Oncology Group protocols', year: 2024 },
  { id: 'NHLBI-SCD', source: 'NHLBI Sickle Cell Disease', year: 2024 }
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
function neutropenicFever(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const temp_c = ensureNumber(input, 'temperature_c', 30, 45);
  const anc = ensureNumber(input, 'anc', 0, 30);
  const neutropenic = anc < 0.5;
  const fever = temp_c >= 38.3 || input.temp_twice_1h_apart === true;
  const therapy = {
    immediate: 'broad_spectrum_antibiotic_within_1h_pip_tazo_or_cefepime',
    cultures: 'blood_culture_central_and_peripheral_urine',
    supportive: 'fluid_resuscitation_if_hypotension',
    antifungal: 'if_persistent_fever_after_4_to_7_days_empirical_echinocandin',
    gcsf: 'consider_gcsf_if_prolonged_neutropenia'
  };
  return {
    module: 'tier4_peds_107_neutropenic_fever',
    patient_id: patientId,
    neutropenic,
    fever,
    therapy,
    monitoring: 'vitals_q4h_hemodynamics_urine_output',
    citations: CITATIONS
  };
}
function sickleCellCrisis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const crisis_type = ensureEnum(input, 'crisis_type', ['vaso_occlusive', 'acute_chest', 'splenic_sequestration', 'aplastic', 'priapism', 'stroke']);
  const hgb = ensureNumber(input, 'hemoglobin', 0, 20);
  const retic = ensureNumber(input, 'retic_pct', 0, 50);
  const spo2 = ensureNumber(input, 'spo2', 0, 100);
  const pain_score = ensureNumber(input, 'pain_score', 0, 10);
  const on_hydroxyurea = input.on_hydroxyurea === true;
  const therapy = {
    hydration: 'iv_fluid_maintenance_avoid_overload',
    analgesia: 'iv_opioid_pca_or_scheduled_plus_nsaid',
    oxygen: spo2 < 92 ? 'supplemental' : 'none',
    transfusion: crisis_type === 'acute_chest' || crisis_type === 'stroke' ? 'simple_top_up_then_exchange' : 'consider_simple',
    hydroxyurea_review: on_hydroxyurea ? 'continue_adherence' : 'initiate_15_to_20mg_kg_d',
    antibiotics: 'macrolide_if_acute_chest_cef'
  };
  return {
    module: 'tier4_peds_107_scd',
    patient_id: patientId,
    crisis_type,
    hgb,
    retic,
    spo2,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  neutropenicFever,
  sickleCellCrisis,
  CITATIONS,
  ValidationError
};
