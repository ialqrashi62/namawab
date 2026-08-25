'use strict';
// TIER4_DERM-103 Atopic Dermatitis / Eczema
const CITATIONS = [
  { id: 'AAAAI-2024', source: 'AAAAI - Atopic Dermatitis', year: 2024 },
  { id: 'AAD-Atopic-2024', source: 'AAD - Atopic Dermatitis', year: 2024 }
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
function eczemaSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 120);
  const bsa = ensureNumber(input, 'bsa_pct', 0, 100);
  const iga = ensureNumber(input, 'investigator_global_assessment', 0, 4);
  const eosi = ensureNumber(input, 'eosi_score', 0, 72);
  const sleep_impact = input.sleep_impact === true;
  const severity = (iga >= 3 || bsa >= 30) ? 'severe'
    : (iga >= 2 || bsa >= 10 ? 'moderate' : 'mild');
  const therapy = severity === 'severe' ? 'systemic_dupilumab_or_tralokinumab_or_jak_inhibitor'
    : severity === 'moderate' ? 'phototherapy_narrowband_uvb_or_methotrexate_cyclosporine'
    : 'topical_corticosteroid_plus_topical_calcineurin_inhibitor';
  return {
    module: 'tier4_derm_103_eczema',
    patient_id: patientId,
    age_years,
    severity,
    therapy,
    monitoring: { iga_q_8wk: severity !== 'mild', dupilumab_if_severe: true, sleep_q: sleep_impact },
    citations: CITATIONS
  };
}
function dupilumabProtocol(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 120);
  const weight_kg = ensureNumber(input, 'weight_kg', 0, 200);
  const eosinophil_count = ensureNumber(input, 'eos_count', 0, 50);
  const conjunctivitis = input.history_conjunctivitis === true;
  const dose = age_years >= 18 ? 'dupilumab_600mg_loading_then_300mg_q2w'
    : (weight_kg >= 60 ? '600mg_loading_300mg_q2w' : (weight_kg >= 30 ? '400mg_loading_200mg_q2w' : '300mg_loading_100mg_q2w'));
  return {
    module: 'tier4_derm_103_dupilumab',
    patient_id: patientId,
    age_years,
    weight_kg,
    dose,
    conjunctivitis_watch: 'eye_drop_prophylaxis_baseline',
    eos_counts_baseline: eosinophil_count,
    monitoring: { eos_q_3mo: true, conjunctivitis_review: conjunctivitis, response_assessment_q_4mo: true },
    citations: CITATIONS
  };
}
function ezcemaEmollientSelection(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const skin_type = ensureEnum(input, 'skin_type', ['dry', 'flaky', 'sensitive', 'normal']);
  const preservative_sensitivity = input.preservative_sensitivity === true;
  const fragrance_free = input.fragrance_free_required === true;
  const recommendation = {
    type: skin_type === 'dry' ? 'ointment' : (skin_type === 'flaky' ? 'cream' : 'lotion'),
    ingredients: preservative_sensitivity ? 'petrolatum_glycerin_minimal_ingredients' : 'ceramide_cholesterol_colloidal_oat',
    quantity: '300g_weekly_for_full_body',
    fragrance: fragrance_free ? 'fragrance_free_required' : 'fragrance_ok'
  };
  return {
    module: 'tier4_derm_103_emollient',
    patient_id: patientId,
    skin_type,
    recommendation,
    application: 'apply_within_3_min_of_bath_liberal_2_to_3x_daily',
    citations: CITATIONS
  };
}
module.exports = {
  eczemaSeverity,
  dupilumabProtocol,
  ezcemaEmollientSelection,
  CITATIONS,
  ValidationError
};
