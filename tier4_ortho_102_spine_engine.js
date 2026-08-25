'use strict';
// TIER4_ORTHO-102 Spine Surgery
const CITATIONS = [
  { id: 'NASS-2024', source: 'North American Spine Society', year: 2024 },
  { id: 'AANS-2024', source: 'American Association Neurological Surgeons', year: 2024 }
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
function spinalStenosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const neurogenic_claudication = input.neurogenic_claudication === true;
  const walking_distance_m = ensureNumber(input, 'walking_distance_m', 0, 2000);
  const canal_area_mm2 = ensureNumber(input, 'canal_area_mm2', 0, 250);
  const odi = ensureNumber(input, 'oswestry_disability_index', 0, 100);
  const failed_conservative = input.failed_conservative_3mo === true;
  const surgery = failed_conservative && odi >= 40 && canal_area_mm2 < 100;
  return {
    module: 'tier4_ortho_102_stenosis',
    patient_id: patientId,
    neurogenic_claudication,
    walking_distance_m,
    canal_area_mm2,
    odi,
    conservative: 'pt_epidural_steroid_injections_medication',
    surgery_indicated: surgery,
    surgery_type: surgery ? 'decompression_possible_fusion_if_instability' : 'continue_conservative',
    citations: CITATIONS
  };
}
function discHerniation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const level = ensureEnum(input, 'level', ['c5_c6', 'c6_c7', 'l3_l4', 'l4_l5', 'l5_s1', 't11_t12']);
  const radiculopathy = input.radiculopathy === true;
  const motor_deficit = input.motor_deficit === true;
  const cauda_equina = input.cauda_equina === true;
  const conservative_weeks = ensureNumber(input, 'conservative_weeks', 0, 30);
  const surgery = cauda_equina || motor_deficit || (radiculopathy && conservative_weeks >= 6);
  return {
    module: 'tier4_ortho_102_disc',
    patient_id: patientId,
    level,
    radiculopathy,
    motor_deficit,
    cauda_equina,
    conservative_weeks,
    surgery_indicated: surgery,
    surgery_type: surgery ? (cauda_equina ? 'EMERGENT_decompression' : 'discectomy_micro_or_endoscopic') : 'continue_conservative',
    citations: CITATIONS
  };
}
function scoliosisAdult(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cobb_angle = ensureNumber(input, 'cobb_angle_deg', 0, 180);
  const progression = input.progression_per_year >= 5 === true;
  const pain = input.pain === true;
  const pulmonary = input.pulmonary_deficit === true;
  const surgery = cobb_angle >= 50 || (progression && pain) || pulmonary;
  return {
    module: 'tier4_ortho_102_scoliosis',
    patient_id: patientId,
    cobb_angle,
    progression,
    pain,
    pulmonary_deficit: pulmonary,
    observation: 'observation_q6mo_bracing_if_25_to_40_deg',
    surgery_indicated: surgery,
    surgery_type: surgery ? 'posterior_spinal_fusion_pelvic_fix_if_needed' : 'not_indicated',
    citations: CITATIONS
  };
}
function spinalCordInjury(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const asia = ensureEnum(input, 'asia', ['A', 'B', 'C', 'D', 'E']);
  const level = ensureEnum(input, 'neurologic_level', ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 't1', 't6', 't12', 'l1', 'l4', 's2_s5']);
  const steroid_window = ensureNumber(input, 'hours_since_injury', 0, 72);
  const first_line_therapy = steroid_window <= 8 ? 'mp_30mg_kg_15min_then_5_4mg_kg_23h_within_8h' : 'no_benefit_after_8h';
  return {
    module: 'tier4_ortho_102_sci',
    patient_id: patientId,
    asia,
    neurologic_level: level,
    hours_since_injury: steroid_window,
    first_line_therapy,
    surgical_decompression: 'within_24h_if_cervical',
    monitoring: 'icu_pressure_injury_autonomic_dysreflexia',
    citations: CITATIONS
  };
}
module.exports = {
  spinalStenosis,
  discHerniation,
  scoliosisAdult,
  spinalCordInjury,
  CITATIONS,
  ValidationError
};
