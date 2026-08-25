'use strict';
// TIER4_ORTHO-106 Foot & Ankle
const CITATIONS = [
  { id: 'AOFAS-2024', source: 'American Orthopedic Foot Ankle Society', year: 2024 }
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
function ankleFracture(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const male = ensureEnum(input, 'male_olli', ['1', '2', '3', '4', 'sup_syndesmosis', 'lateral_only']);
  const deltoid = ensureEnum(input, 'deltoid', ['intact', 'incompetent']);
  const surgery = (male === 'sup_syndesmosis' || male === '3') || (male === '4' && deltoid === 'incompetent');
  return {
    module: 'tier4_ortho_106_ankle_fx',
    patient_id: patientId,
    male_olli: male,
    deltoid,
    surgery_indicated: surgery,
    surgery_type: surgery ? 'orif_syndesmotic_screw_if_needed' : 'cast_immobilization',
    weight_bearing: 'protected_6wk',
    citations: CITATIONS
  };
}
function halluxValgus(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const hva = ensureNumber(input, 'hallux_valgus_angle', 0, 60);
  const ima = ensureNumber(input, 'intermetatarsal_angle', 0, 30);
  const dmma = ensureNumber(input, 'distal_metatarsal_artic_angle', 0, 30);
  const pain = input.pain === true;
  const failed_conservative = input.failed_shoe_modification_6mo === true;
  const surgery = (hva >= 20 || ima >= 9) && pain && failed_conservative;
  const procedure = ima >= 16 ? 'lapi_cotton_or_tarsometatarsal_osteotomy' : (hva >= 20 ? 'scarf_or_chevron_osteotomy' : 'chevron_osteotomy');
  return {
    module: 'tier4_ortho_106_bunion',
    patient_id: patientId,
    hva,
    ima,
    dmma,
    surgery_indicated: surgery,
    procedure,
    citations: CITATIONS
  };
}
function diabeticFootRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ulcer = input.ulcer_present === true;
  const charcot = input.charcot_foot === true;
  const infection = input.infection_signs === true;
  const pad = ensureNumber(input, 'padding_or_insole', 0, 4);
  const procedure = charcot ? 'exoskeletal_charcot_restraint_orthotic_walker_or_surgical_off_loading' : (infection ? 'aggressive_debridement_culture_specific_abx' : 'total_contact_cast_3_month');
  return {
    module: 'tier4_ortho_106_dm_foot',
    patient_id: patientId,
    ulcer,
    charcot,
    infection,
    risk_grade: pad,
    procedure,
    monitoring: 'imaging_ankle_brachial_index_pre_cast',
    citations: CITATIONS
  };
}
module.exports = {
  ankleFracture,
  halluxValgus,
  diabeticFootRisk,
  CITATIONS,
  ValidationError
};
