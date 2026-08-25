'use strict';
// TIER4_ORTHO-108 Orthopedic Oncology
const CITATIONS = [
  { id: 'MSTS-2024', source: 'Musculoskeletal Tumor Society', year: 2024 },
  { id: 'NCCN-BoneCancer', source: 'NCCN Bone Cancer', year: 2024 }
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
function boneLesionWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const location = ensureEnum(input, 'location', ['femur_distal', 'femur_proximal', 'tibia_proximal', 'humerus_proximal', 'pelvis', 'spine', 'foot', 'hand']);
  const pattern = ensureEnum(input, 'pattern', ['lytic', 'blastic', 'mixed', 'permeative']);
  const margin = ensureEnum(input, 'margin', ['geographic', 'moth_eaten', 'permeative']);
  const periosteal_reaction = ensureEnum(input, 'periosteal_reaction', ['none', 'solid', 'lamellated', 'sunburst', 'codman_triangle']);
  const size_cm = ensureNumber(input, 'size_cm', 0, 30);
  const pain = input.pain === true;
  const lodwick = (pattern === 'lytic' && margin === 'geographic' && size_cm > 5) ? 'lodwick_1a_slow_growing_benign' :
    (pattern === 'blastic' && margin === 'geographic') ? 'lodwick_2_mixed_benign_to_aggressive' :
    (pattern === 'permeative' || margin === 'permeative') ? 'lodwick_3_aggressive_malignant' : 'lodwick_2_indeterminate';
  const urgency = (lodwick === 'lodwick_3_aggressive_malignant') ? 'urgent_refer_sarcoma_center' : 'image_review_and_biopsy_planning';
  return {
    module: 'tier4_ortho_108_lesion',
    patient_id: patientId,
    age,
    location,
    pattern,
    margin,
    periosteal_reaction,
    size_cm,
    lodwick,
    pain,
    urgency,
    citations: CITATIONS
  };
}
function osteosarcomaProtocol(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const location = ensureEnum(input, 'location', ['femur_distal', 'femur_proximal', 'tibia_proximal', 'humerus_proximal', 'other']);
  const size_cm = ensureNumber(input, 'size_cm', 0, 30);
  const metastases = ensureEnum(input, 'metastases', ['none', 'lung', 'bone', 'both']);
  const biopsy = input.image_guided_biopsy_done === true;
  const neoadjuvant = input.neoadjuvant_chemo_done === true;
  const surgery = input.surgery_planned === true;
  const reconstruction = ensureEnum(input, 'reconstruction', ['limb_sparing_endoprosthesis', 'allograft', 'rotationplasty', 'amputation']);
  return {
    module: 'tier4_ortho_108_osteosarcoma',
    patient_id: patientId,
    age,
    location,
    size_cm,
    metastases,
    biopsy,
    neoadjuvant,
    surgery,
    reconstruction,
    protocol: 'image_guided_biopsy_then_neoadjuvant_then_surgery_then_adjuvant',
    citations: CITATIONS
  };
}
function softTissueMass(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const size_cm = ensureNumber(input, 'size_cm', 0, 50);
  const depth = ensureEnum(input, 'depth', ['superficial', 'deep_fascia', 'sub_fascial']);
  const growth = ensureEnum(input, 'growth', ['stable', 'enlarging', 'rapid']);
  const pain = input.pain === true;
  const red_flags = size_cm > 5 || depth === 'deep_fascia' || growth !== 'stable' || pain;
  const workup = red_flags ? 'mri_with_contrast_then_image_guided_biopsy' : 'ultrasound_observation_3_to_6mo';
  return {
    module: 'tier4_ortho_108_mass',
    patient_id: patientId,
    size_cm,
    depth,
    growth,
    pain,
    red_flags,
    workup,
    citations: CITATIONS
  };
}
module.exports = {
  boneLesionWorkup,
  osteosarcomaProtocol,
  softTissueMass,
  CITATIONS,
  ValidationError
};
