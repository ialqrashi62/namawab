'use strict';
// TIER4_ENT-106 Facial Plastics & Reconstructive
const CITATIONS = [
  { id: 'AAFPRS-2024', source: 'American Academy Facial Plastics Reconstructive', year: 2024 }
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
function septorhinoplastyIndication(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const functional = (input.septal_deviation === true || input.turbinate_hypertrophy === true || input.valve_collapse === true);
  const aesthetic = input.aesthetic === true;
  const prior_surgery = input.prior_surgery === true;
  const compliance = input.tolerate_recovery === true;
  const surgery = (functional || aesthetic) && age >= 16 && compliance;
  return {
    module: 'tier4_ent_106_srp',
    patient_id: patientId,
    age,
    functional,
    aesthetic,
    prior_surgery,
    surgery_indicated: surgery,
    technique: 'open_or_closed_approach_per_consult',
    citations: CITATIONS
  };
}
function facialTraumaRepair(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const fracture = ensureEnum(input, 'fracture', ['nasal', 'orbital_blowout', 'zygoma', 'maxilla', 'mandible', 'frontal_sinus', 'noe_pylons', 'pan_facial']);
  const dislocation = input.dislocation === true;
  const airway = input.airway_compromised === true;
  const open = input.open_fracture === true;
  const timing = airway ? 'emergent_intervention' : open ? 'within_24h' : 'within_2_weeks_after_swelling_resolves';
  const therapy = (fracture === 'noe_pylons' || fracture === 'pan_facial') ? 'open_reduction_internal_fixation_then_consult' : 'open_reduction_with_miniplate';
  return {
    module: 'tier4_ent_106_trauma',
    patient_id: patientId,
    fracture,
    dislocation,
    airway_compromised: airway,
    open_fracture: open,
    timing,
    therapy,
    citations: CITATIONS
  };
}
function skinCancerReconstruction(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const location = ensureEnum(input, 'anatomic_location', ['nose', 'eyelid', 'lip', 'cheek', 'forehead', 'ear', 'scalp', 'neck']);
  const size_cm = ensureNumber(input, 'defect_size_cm', 0, 30);
  const depth = ensureEnum(input, 'depth', ['superficial', 'deep_subcutaneous', 'deep_cartilage_bone', 'full_thickness']);
  const closure = size_cm <= 1 ? 'primary_closure' : (size_cm <= 3 ? 'local_flap_or_advancement' : 'interpolation_flap_or_full_thickness_skin_graft');
  if (depth === 'sup_threshold_skin_graft') {
    return {
      module: 'tier4_ent_106_defect',
      patient_id: patientId,
      location,
      size_cm,
      depth,
      closure: 'reconstruction_with_flap_or_graft',
      monitoring: 'q1week_suture_followup',
      citations: CITATIONS
    };
  }
  return {
    module: 'tier4_ent_106_defect',
    patient_id: patientId,
    location,
    size_cm,
    depth,
    closure,
    monitoring: 'q1week_suture_followup',
    citations: CITATIONS
  };
}
module.exports = {
  septorhinoplastyIndication,
  facialTraumaRepair,
  skinCancerReconstruction,
  CITATIONS,
  ValidationError
};
