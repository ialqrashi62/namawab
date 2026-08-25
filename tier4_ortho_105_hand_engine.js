'use strict';
// TIER4_ORTHO-105 Hand & Wrist
const CITATIONS = [
  { id: 'ASSH-2024', source: 'American Society Surgery Hand', year: 2024 }
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
function carpalTunnel(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bctq = ensureNumber(input, 'bctq_symptom_severity', 1, 5);
  const phalen = input.phalen_positive === true;
  const tinel = input.tinel_positive === true;
  const emg_severity = ensureEnum(input, 'emg_severity', ['normal', 'mild', 'moderate', 'severe']);
  const failed_conservative = input.failed_splinting_3mo === true;
  const surgery = (emg_severity === 'moderate' || emg_severity === 'severe') || failed_conservative;
  return {
    module: 'tier4_ortho_105_cts',
    patient_id: patientId,
    bctq_severity: bctq,
    phalen,
    tinel,
    emg_severity,
    surgery_indicated: surgery,
    procedure: surgery ? 'open_or_endoscopic_release' : 'night_splints_activity_modification',
    citations: CITATIONS
  };
}
function distalRadiusFx(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const displacement = ensureEnum(input, 'displacement', ['extra_articular', 'intra_articular', 'comminuted']);
  const radial_height_mm = ensureNumber(input, 'radial_height_mm', 0, 30);
  const radial_inclination = ensureNumber(input, 'radial_inclination_deg', 0, 30);
  const volar_tilt = ensureNumber(input, 'volar_tilt_deg', -90, 30);
  const reduction = ((radial_height_mm < 5 || radial_height_mm > 15) || volar_tilt < -10 || volar_tilt > 25) ? 'cannot_reduce_closed' : 'acceptable_closed';
  const surgery = (age >= 60 && reduction === 'cannot_reduce_closed') || age < 60 ? 'ORIF_volar_plate' : 'acceptable_then_cast';
  return {
    module: 'tier4_ortho_105_dx',
    patient_id: patientId,
    age,
    displacement,
    radial_height_mm,
    radial_inclination,
    volar_tilt,
    reduction_quality: reduction,
    surgery_indicated: surgery,
    citations: CITATIONS
  };
}
function fingerLaceration(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const zone = ensureNumber(input, 'zone', 1, 5);
  const flexor = ensureEnum(input, 'tendon_injury', ['none', 'flexor', 'extensor', 'both']);
  const artery = ensureEnum(input, 'artery', ['intact', 'one', 'both']);
  const nerve = ensureEnum(input, 'nerve', ['intact', 'one', 'both']);
  const surgery = flexor !== 'none' || nerve !== 'intact' || artery === 'both';
  const repair = {
    flexor: 'primary_repair_4_strand_modified_kessler_then_epitendinous',
    extensor: 'running_lor_or_krackow',
    artery: 'microsurgical_anastomosis_9_0_or_10_0',
    nerve: 'epineurial_repair_9_0_nylon'
  };
  return {
    module: 'tier4_ortho_105_laceration',
    patient_id: patientId,
    zone,
    tendon_injury: flexor,
    artery_status: artery,
    nerve_status: nerve,
    surgery_indicated: surgery,
    repair,
    rehab: 'early_protected_motion_duran_protocol_postop_3_days',
    citations: CITATIONS
  };
}
module.exports = {
  carpalTunnel,
  distalRadiusFx,
  fingerLaceration,
  CITATIONS,
  ValidationError
};
