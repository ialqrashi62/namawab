'use strict';
// TIER4_ORTHO-104 Orthopedic Trauma
const CITATIONS = [
  { id: 'OTA-2024', source: 'Orthopedic Trauma Association', year: 2024 }
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
function hipFractureManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const fracture_type = ensureEnum(input, 'fracture_type', ['femoral_neck', 'intertrochanteric', 'subtrochanteric', 'basicervical']);
  const displacement = ensureEnum(input, 'displacement', ['nondisplaced', 'displaced', 'comminuted']);
  const garden = ensureNumber(input, 'garden_class', 1, 4);
  const asa = ensureNumber(input, 'asa_score', 1, 5);
  const surgery_window = ensureNumber(input, 'hours_since_injury', 0, 240);
  const young = age < 60;
  const surgery = (young && (displacement !== 'nondisplaced' || fracture_type === 'femoral_neck')) ? 'orif_or_arthroplasty' :
    (garden === 1 || garden === 2) ? 'orif_with_cannulated_screws' :
    (garden === 3 || garden === 4) ? 'arthroplasty_hemi_or_total' : 'cepha_medullary_nail';
  const goal = surgery_window <= 48 ? 'within_48h_goal' : 'expedited_within_24h';
  return {
    module: 'tier4_ortho_104_hip_fx',
    patient_id: patientId,
    age,
    fracture_type,
    displacement,
    garden_class: garden,
    asa_score: asa,
    surgery_recommended: surgery,
    surgical_goal: goal,
    citations: CITATIONS
  };
}
function openFractureManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const gustilo = ensureEnum(input, 'gustilo', ['1', '2', '3a', '3b', '3c']);
  const location = ensureEnum(input, 'location', ['tibia', 'femur', 'humerus', 'radius_ulna', 'foot', 'hand']);
  const abx_within_3h = true;
  const therapy = {
    abx_first_dose: gustilo === '1' ? 'cefazolin_2g_iv' : 'cefazolin_2g_iv_plus_gentamicin',
    tetanus: 'tetanus_prophylaxis_review',
    surgical_debridement: gustilo === '1' ? 'within_24h' : 'within_6_to_24h',
    stabilization: 'external_fix_then_internal_fix',
    amputation: gustilo === '3c' ? 'consider_amputation_if_non_viable' : 'salvage'
  };
  return {
    module: 'tier4_ortho_104_open_fx',
    patient_id: patientId,
    gustilo,
    location,
    abx_within_3h,
    therapy,
    monitoring: 'serial_debridement_q24_72h',
    citations: CITATIONS
  };
}
function pelvisFracture(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const young_burgess = ensureEnum(input, 'young_burgess', ['lcp_1', 'lcp_2', 'lcp_3', 'apc_1', 'apc_2', 'apc_3', 'vertical_shear', 'combined']);
  const hemodynamically_unstable = input.hemodynamically_unstable === true;
  const binder = input.binder_applied === true;
  let therapy = 'observation_brace_pjs_treatment_of_associated_injury';
  if (young_burgess === 'apc_2' || young_burgess === 'lcp_2') therapy = 'external_fix_si_screw';
  if (young_burgess === 'apc_3' || young_burgess === 'lcp_3' || young_burgess === 'vertical_shear') therapy = 'orif_open_internal_fixation';
  if (hemodynamically_unstable) therapy = 'damage_control_angioembolization_pelvic_packing';
  return {
    module: 'tier4_ortho_104_pelvis',
    patient_id: patientId,
    young_burgess,
    hemodynamically_unstable,
    binder_applied: binder,
    therapy,
    citations: CITATIONS
  };
}
function compartmentSyndrome(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const diastolic = ensureNumber(input, 'diastolic_bp', 0, 200);
  const compartment_pressure = ensureNumber(input, 'compartment_pressure', 0, 100);
  const delta = diastolic - compartment_pressure;
  const fascial_release = compartment_pressure >= 30 || delta <= 30;
  return {
    module: 'tier4_ortho_104_compartment',
    patient_id: patientId,
    diastolic_bp: diastolic,
    compartment_pressure,
    delta_p: delta,
    diagnosis: fascial_release ? 'acute_compartment_syndrome' : 'impending_watch',
    urgent_fasciotomy: fascial_release,
    monitoring: 'serial_pressure_measurements_2h',
    citations: CITATIONS
  };
}
module.exports = {
  hipFractureManagement,
  openFractureManagement,
  pelvisFracture,
  compartmentSyndrome,
  CITATIONS,
  ValidationError
};
